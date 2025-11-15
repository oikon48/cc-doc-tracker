import fetch from 'node-fetch';
import TurndownService from 'turndown';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';

interface DocInfo {
  title: string;
  url: string;
  lastUpdated?: string;
}

interface FetchResult {
  success: boolean;
  filename: string;
  content?: string;
  error?: string;
}

export class ClaudeDocsFetcher {
  private readonly baseUrl = 'https://code.claude.com/docs/en';
  private readonly docsMapUrl = `${this.baseUrl}/claude_code_docs_map.md`;
  private readonly docsDir: string;
  private readonly metadataDir: string;
  private turndown: TurndownService;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  constructor(rootDir: string = '.') {
    this.docsDir = path.join(rootDir, 'docs', 'en');
    this.metadataDir = path.join(rootDir, 'metadata');
    this.turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
    });

    // Configure Turndown to handle special elements
    this.configureTurndown();
  }

  private configureTurndown(): void {
    // Keep code blocks and preserve formatting
    this.turndown.addRule('preserveCodeBlocks', {
      filter: ['pre'],
      replacement: (content: string) => {
        return '\n```\n' + content + '\n```\n';
      }
    });

    // Handle tabs and accordions (common in documentation)
    this.turndown.addRule('tabs', {
      filter: (node) => {
        return node.nodeName === 'DIV' &&
               (node.className?.includes('tabs') || node.className?.includes('tab-'));
      },
      replacement: (content: string) => {
        return '\n' + content + '\n';
      }
    });
  }

  /**
   * Initialize directories
   */
  async init(): Promise<void> {
    await fs.mkdir(this.docsDir, { recursive: true });
    await fs.mkdir(this.metadataDir, { recursive: true });
    console.log('✅ Directories initialized');
  }

  /**
   * Fetch docs map to get list of all documentation pages
   */
  async fetchDocsMap(): Promise<DocInfo[]> {
    console.log('📥 Fetching documentation map...');

    try {
      const response = await this.fetchWithRetry(this.docsMapUrl);
      const content = await response.text();

      // Save the docs map
      await fs.writeFile(
        path.join(this.metadataDir, 'docs_map.md'),
        content,
        'utf-8'
      );

      // Parse the markdown to extract document URLs
      const docs = this.parseDocsMap(content);
      console.log(`✅ Found ${docs.length} documentation pages`);

      return docs;
    } catch (error) {
      console.error('❌ Failed to fetch docs map:', error);
      throw error;
    }
  }

  /**
   * Parse the docs map markdown to extract document information
   */
  private parseDocsMap(content: string): DocInfo[] {
    const docs: DocInfo[] = [];
    const lines = content.split('\n');

    // Look for markdown links in the format [Title](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    for (const line of lines) {
      let match;
      while ((match = linkRegex.exec(line)) !== null) {
        const [, title, url] = match;
        // Only include actual documentation pages (not external links)
        if (url.startsWith('/') || url.includes('code.claude.com/docs')) {
          const filename = url.split('/').pop() || 'index';
          docs.push({
            title: title.trim(),
            url: url.includes('http') ? url : `${this.baseUrl}/${filename}`
          });
        }
      }
    }

    // Also check for date information (Last updated:)
    const dateMatch = content.match(/Last updated:\s*(.+)/);
    if (dateMatch) {
      const lastUpdated = dateMatch[1];
      // Store this in metadata
      this.saveMetadata({ lastMapUpdate: lastUpdated });
    }

    return docs;
  }

  /**
   * Fetch a single documentation page
   */
  async fetchDoc(docInfo: DocInfo): Promise<FetchResult> {
    const filename = this.getFilenameFromUrl(docInfo.url);

    console.log(`📄 Fetching: ${docInfo.title} (${filename})`);

    try {
      const response = await this.fetchWithRetry(docInfo.url);
      const html = await response.text();

      // Parse HTML and extract content
      const $ = cheerio.load(html);

      // Remove navigation, footer, and other non-content elements
      $('nav, footer, header, script, style, .sidebar, .navigation').remove();

      // Get the main content (adjust selector based on actual structure)
      let mainContent = $('main').html() || $('article').html() || $('.content').html() || $('body').html() || '';

      // Convert HTML to Markdown
      const markdown = this.turndown.turndown(mainContent);

      // Add front matter with metadata
      const frontMatter = this.createFrontMatter(docInfo);
      const fullContent = frontMatter + markdown;

      // Save the file
      const filePath = path.join(this.docsDir, filename);
      await fs.writeFile(filePath, fullContent, 'utf-8');

      return {
        success: true,
        filename,
        content: fullContent
      };
    } catch (error) {
      console.error(`❌ Failed to fetch ${docInfo.title}:`, error);
      return {
        success: false,
        filename,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create front matter for markdown files
   */
  private createFrontMatter(docInfo: DocInfo): string {
    const now = new Date().toISOString();
    return `---
title: ${docInfo.title}
source: ${docInfo.url}
fetched: ${now}
---

# ${docInfo.title}

`;
  }

  /**
   * Get filename from URL
   */
  private getFilenameFromUrl(url: string): string {
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];

    // Remove query parameters and hash
    const filename = lastPart.split('?')[0].split('#')[0];

    // Ensure it has .md extension
    return filename.endsWith('.md') ? filename : `${filename}.md`;
  }

  /**
   * Fetch with retry logic
   */
  private async fetchWithRetry(url: string, retries = 0): Promise<any> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Claude-Code-Doc-Tracker/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (retries < this.maxRetries) {
        console.log(`⚠️  Retry ${retries + 1}/${this.maxRetries} for ${url}`);
        await this.sleep(this.retryDelay * Math.pow(2, retries)); // Exponential backoff
        return this.fetchWithRetry(url, retries + 1);
      }
      throw error;
    }
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Save metadata
   */
  private async saveMetadata(data: any): Promise<void> {
    const metadataPath = path.join(this.metadataDir, 'last_update.json');

    try {
      let existing = {};
      try {
        const content = await fs.readFile(metadataPath, 'utf-8');
        existing = JSON.parse(content);
      } catch {
        // File doesn't exist yet
      }

      const metadata = {
        ...existing,
        ...data,
        lastRun: new Date().toISOString()
      };

      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save metadata:', error);
    }
  }

  /**
   * Fetch all documentation
   */
  async fetchAllDocs(): Promise<void> {
    console.log('🚀 Starting documentation fetch...');

    // Initialize directories
    await this.init();

    // Get list of all docs
    const docs = await this.fetchDocsMap();

    if (docs.length === 0) {
      console.warn('⚠️  No documentation pages found in docs map');
      return;
    }

    // Fetch documents in batches to avoid overwhelming the server
    const batchSize = 5;
    const results: FetchResult[] = [];

    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = docs.slice(i, i + batchSize);
      const batchPromises = batch.map(doc => this.fetchDoc(doc));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches
      if (i + batchSize < docs.length) {
        await this.sleep(500);
      }
    }

    // Report results
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);

    console.log('\n📊 Fetch Summary:');
    console.log(`✅ Successfully fetched: ${successful}/${docs.length} documents`);

    if (failed.length > 0) {
      console.log(`❌ Failed documents:`);
      failed.forEach(f => {
        console.log(`  - ${f.filename}: ${f.error}`);
      });
    }

    // Save summary metadata
    await this.saveMetadata({
      totalDocs: docs.length,
      successfulFetch: successful,
      failedFetch: failed.length,
      failedFiles: failed.map(f => f.filename)
    });

    console.log('\n✨ Documentation fetch complete!');
  }
}