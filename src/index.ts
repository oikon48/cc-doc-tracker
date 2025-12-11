// Core functionality
export { ClaudeDocsFetcher } from './lib/doc-fetcher.js';
export { main as fetchDocs } from './fetch-docs.js';

// CLI utilities (for programmatic use)
export {
  parseArgs,
  showHelp,
  showVersion,
  hasHelpFlag,
  hasVersionFlag,
  getVersion,
  COMMANDS,
  RECOGNIZED_FLAGS,
  type Command,
  type ParsedArgs,
  type ParsedOptions
} from './lib/cli-parser.js';

export {
  formatStatus,
  formatList,
  formatError,
  formatSuccess,
  formatInfo,
  formatWarning,
  displayHeader,
  displayDryRunMode,
  formatElapsedTime,
  type DocStats,
  type DocListItem
} from './lib/cli-output.js';

// Re-export for convenience
import { ClaudeDocsFetcher } from './lib/doc-fetcher.js';

/**
 * Default export for easy importing
 */
export default ClaudeDocsFetcher;