#!/usr/bin/env node

import { ClaudeDocsFetcher } from './lib/doc-fetcher.js';
import {
  parseArgs,
  showHelp,
  showVersion,
  hasHelpFlag,
  hasVersionFlag,
  type ParsedOptions
} from './lib/cli-parser.js';
import {
  displayHeader,
  displayDryRunMode,
  formatStatus,
  formatList,
  formatError,
  formatSuccess,
  formatInfo,
  formatWarning,
  formatElapsedTime
} from './lib/cli-output.js';

/**
 * Handle fetch command
 */
async function handleFetch(fetcher: ClaudeDocsFetcher, options: ParsedOptions): Promise<void> {
  const startTime = Date.now();

  if (options.dryRun) {
    displayDryRunMode();
  }

  if (options.verbose) {
    formatInfo(`Output directory: ${options.outputDir || process.cwd()}`);
    formatInfo(`Force mode: ${options.force ? 'enabled' : 'disabled'}`);
  }

  // Fetch all documentation
  await fetcher.fetchAllDocs();

  formatSuccess(`Completed in ${formatElapsedTime(startTime)}`);
}

/**
 * Handle list command
 */
async function handleList(fetcher: ClaudeDocsFetcher): Promise<void> {
  const docs = await fetcher.listDocs();

  if (docs.length === 0) {
    formatWarning('No documents found. Run "ccdocs fetch" first.');
    return;
  }

  formatList(docs);
}

/**
 * Handle status command
 */
async function handleStatus(fetcher: ClaudeDocsFetcher): Promise<void> {
  const stats = await fetcher.getStats();

  if (!stats) {
    formatWarning('No status data found. Run "ccdocs fetch" first.');
    return;
  }

  formatStatus(stats);
}

/**
 * Handle sync command
 */
async function handleSync(fetcher: ClaudeDocsFetcher, options: ParsedOptions): Promise<void> {
  if (options.dryRun) {
    displayDryRunMode();
  }

  formatInfo('Fetching documentation map...');

  // First fetch the docs map to know expected files
  const docs = await fetcher.fetchDocsMap();

  if (options.verbose) {
    formatInfo(`Found ${docs.length} documents in map`);
  }

  // Sync local files
  const deletedCount = await fetcher.syncLocalFiles(docs);

  if (deletedCount === 0) {
    formatSuccess('All files are in sync. No orphans found.');
  } else {
    formatSuccess(`Removed ${deletedCount} orphan file(s)`);
  }
}

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Handle version flag early
  if (hasVersionFlag(args)) {
    showVersion();
    process.exit(0);
  }

  // Handle help flag or no arguments
  if (hasHelpFlag(args) || args.length === 0) {
    showHelp();
    process.exit(0);
  }

  // Display header
  displayHeader();

  try {
    // Parse arguments
    const { command, options } = parseArgs(args);

    // Initialize fetcher with output directory or current working directory
    const rootDir = options.outputDir || process.cwd();
    const fetcher = new ClaudeDocsFetcher(rootDir);

    // Route to appropriate handler
    switch (command) {
      case 'fetch':
        await handleFetch(fetcher, options);
        break;
      case 'list':
        await handleList(fetcher);
        break;
      case 'status':
        await handleStatus(fetcher);
        break;
      case 'sync':
        await handleSync(fetcher, options);
        break;
      default:
        // This shouldn't happen due to parseArgs validation
        throw new Error(`Unknown command: ${command}`);
    }

    process.exit(0);
  } catch (error) {
    const debug = process.env.DEBUG === '1';
    formatError(error, debug);
    process.exit(1);
  }
}

// Run main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
