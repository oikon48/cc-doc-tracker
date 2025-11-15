#!/usr/bin/env node

import { ClaudeDocsFetcher } from './lib/doc-fetcher';

/**
 * Main entry point for fetching Claude Code documentation
 */
async function main() {
  console.log('🤖 Claude Code Documentation Tracker');
  console.log('====================================\n');

  const startTime = Date.now();

  try {
    // Initialize fetcher with current directory as root
    const fetcher = new ClaudeDocsFetcher(process.cwd());

    // Fetch all documentation
    await fetcher.fetchAllDocs();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  Total time: ${elapsed} seconds`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main };