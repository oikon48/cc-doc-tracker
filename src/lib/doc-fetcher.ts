import fetch from 'node-fetch';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  constructor(rootDir: string = '.') {
    this.docsDir = path.join(rootDir, 'docs', 'en');
    this.metadataDir = path.join(rootDir, 'metadata');
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
    // Only match full URLs ending with .md to avoid inline relative links
    const linkRegex = /\[([^\]]+)\]\((https:\/\/[^)]+\.md)\)/g;

    for (const line of lines) {
      let match;
      while ((match = linkRegex.exec(line)) !== null) {
        const [, title, url] = match;
        docs.push({
          title: title.trim(),
          url: url
        });
      }
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
      const markdown = await response.text();

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
    return `---
title: ${docInfo.title}
source: ${docInfo.url}
---

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
          'Accept': 'text/markdown, text/plain, */*',
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
   * Check if there are changes in docs directory
   */
  private async hasDocsChanges(): Promise<boolean> {
    try {
      const { stdout } = await execAsync('git diff --quiet docs/en/ || echo "changed"');
      return stdout.trim() === 'changed';
    } catch (error) {
      // If git command fails (e.g., not a git repo), assume there are changes
      console.warn('⚠️  Could not check git diff, assuming changes exist');
      return true;
    }
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
        ...data
      };

      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save metadata:', error);
    }
  }

  /**
   * Sync local files with docs_map (remove files not in docs_map)
   */
  async syncLocalFiles(expectedDocs: DocInfo[]): Promise<number> {
    // Get list of expected files from docs_map
    const expectedFiles = new Set(
      expectedDocs.map(doc => this.getFilenameFromUrl(doc.url))
    );

    // Get list of actual files in docs directory
    let actualFiles: string[] = [];
    try {
      actualFiles = await fs.readdir(this.docsDir);
    } catch (error) {
      // Directory doesn't exist yet, nothing to clean
      return 0;
    }

    // Find files to delete (exist locally but not in docs_map)
    const filesToDelete = actualFiles.filter(file => !expectedFiles.has(file));

    // Delete orphaned files
    let deletedCount = 0;
    for (const file of filesToDelete) {
      const filePath = path.join(this.docsDir, file);
      try {
        await fs.unlink(filePath);
        console.log(`🗑️  Removed orphaned file: ${file}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Failed to delete ${file}:`, error);
      }
    }

    if (deletedCount > 0) {
      console.log(`🧹 Cleaned up ${deletedCount} orphaned file(s)`);
    }

    return deletedCount;
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

    // Sync local files (remove files not in docs_map)
    const deletedCount = await this.syncLocalFiles(docs);

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

    if (deletedCount > 0) {
      console.log(`🗑️  Removed ${deletedCount} orphaned document(s)`);
    }

    // Check if there are changes in docs directory
    const hasChanges = await this.hasDocsChanges();

    // Save summary metadata (include lastMapUpdate only if docs changed)
    const metadata: any = {
      totalDocs: docs.length,
      successfulFetch: successful,
      failedFetch: failed.length,
      failedFiles: failed.map(f => f.filename),
      deletedFiles: deletedCount
    };

    if (hasChanges) {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      metadata.lastMapUpdate = now;
      console.log('📝 Documentation changes detected, updating timestamp');
    } else {
      console.log('ℹ️  No documentation changes detected');
    }

    await this.saveMetadata(metadata);

    console.log('\n✨ Documentation fetch complete!');
  }

  /**
   * Get current statistics from metadata
   * Used by CLI status command
   */
  async getStats(): Promise<{
    totalDocs: number;
    successfulFetch: number;
    failedFetch: number;
    failedFiles?: string[];
    deletedFiles?: number;
    lastMapUpdate?: string;
  } | null> {
    const metadataPath = path.join(this.metadataDir, 'last_update.json');

    try {
      const content = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      // File doesn't exist or is invalid
      return null;
    }
  }

  /**
   * List all fetched documents
   * Used by CLI list command
   */
  async listDocs(): Promise<Array<{ title: string; filename: string }>> {
    const docs: Array<{ title: string; filename: string }> = [];

    try {
      const files = await fs.readdir(this.docsDir);

      for (const file of files) {
        if (!file.endsWith('.md')) continue;

        try {
          const content = await fs.readFile(
            path.join(this.docsDir, file),
            'utf-8'
          );

          // Extract title from front matter
          const titleMatch = content.match(/^---\s*\ntitle:\s*(.+)\n/);
          const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '');

          docs.push({ title, filename: file });
        } catch {
          // If we can't read a file, still include it with filename as title
          docs.push({ title: file.replace('.md', ''), filename: file });
        }
      }

      // Sort by title
      docs.sort((a, b) => a.title.localeCompare(b.title));

      return docs;
    } catch {
      // Directory doesn't exist
      return [];
    }
  }
}