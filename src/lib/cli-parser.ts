import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

/**
 * Recognized CLI flags
 */
export const RECOGNIZED_FLAGS = [
  '--output-dir', '-o',
  '--dry-run',
  '--force',
  '--verbose',
  '--version', '-v',
  '--help', '-h'
] as const;

/**
 * Available CLI commands
 */
export const COMMANDS = ['fetch', 'list', 'status', 'sync'] as const;

export type Command = typeof COMMANDS[number];

export interface ParsedOptions {
  outputDir?: string;
  dryRun: boolean;
  force: boolean;
  verbose: boolean;
}

export interface ParsedArgs {
  command: Command;
  options: ParsedOptions;
}

/**
 * Parse command line arguments
 * Following cchistory pattern: manual parsing without external libraries
 */
export function parseArgs(args: string[]): ParsedArgs {
  let command: Command = 'fetch'; // default command
  const options: ParsedOptions = {
    dryRun: false,
    force: false,
    verbose: false,
    outputDir: undefined
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Check for commands
    if (COMMANDS.includes(arg as Command)) {
      command = arg as Command;
      continue;
    }

    // Check for flags
    switch (arg) {
      case '--output-dir':
      case '-o': {
        const nextArg = args[++i];
        if (!nextArg || nextArg.startsWith('-')) {
          throw new Error(`Missing value for ${arg}`);
        }
        options.outputDir = nextArg;
        break;
      }
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--force':
        options.force = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--version':
      case '-v':
      case '--help':
      case '-h':
        // These are handled before parseArgs is called
        break;
      default:
        if (arg.startsWith('-')) {
          throw new Error(`Unknown option: ${arg}`);
        }
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { command, options };
}

/**
 * Get package version from package.json
 */
export function getVersion(): string {
  try {
    // Try multiple paths to find package.json
    const paths = [
      path.join(__dirname, '../../package.json'),
      path.join(__dirname, '../../../package.json'),
      path.join(process.cwd(), 'package.json')
    ];

    for (const pkgPath of paths) {
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        return pkg.version || '0.0.0';
      }
    }
    return '0.0.0';
  } catch {
    return '0.0.0';
  }
}

/**
 * Display version information
 */
export function showVersion(): void {
  console.log(`ccdocs v${getVersion()}`);
}

/**
 * Display help message
 */
export function showHelp(): void {
  const help = `
${chalk.bold.cyan('ccdocs')} - Claude Code Documentation Tracker

${chalk.bold('Usage:')}
  ccdocs [command] [options]

${chalk.bold('Commands:')}
  ${chalk.green('fetch')}          Fetch all documentation ${chalk.gray('(default)')}
  ${chalk.green('list')}           List fetched documents
  ${chalk.green('status')}         Show fetch status and statistics
  ${chalk.green('sync')}           Sync local files (remove orphans)

${chalk.bold('Options:')}
  ${chalk.yellow('--output-dir, -o')} <path>   Output directory ${chalk.gray('(default: ./docs/en)')}
  ${chalk.yellow('--dry-run')}                 Preview changes without writing files
  ${chalk.yellow('--force')}                   Force re-fetch all documents
  ${chalk.yellow('--verbose')}                 Show detailed output
  ${chalk.yellow('--version, -v')}             Show version number
  ${chalk.yellow('--help, -h')}                Show this help message

${chalk.bold('Examples:')}
  ${chalk.gray('$')} ccdocs                           ${chalk.gray('# Fetch all docs')}
  ${chalk.gray('$')} ccdocs fetch --dry-run           ${chalk.gray('# Preview fetch')}
  ${chalk.gray('$')} ccdocs list                      ${chalk.gray('# List documents')}
  ${chalk.gray('$')} ccdocs status                    ${chalk.gray('# Show statistics')}
  ${chalk.gray('$')} ccdocs sync                      ${chalk.gray('# Remove orphan files')}
  ${chalk.gray('$')} ccdocs fetch -o ./custom-docs    ${chalk.gray('# Custom output dir')}

${chalk.bold('Environment:')}
  ${chalk.yellow('DEBUG=1')}    Show stack traces on errors

${chalk.gray('Repository: https://github.com/your-username/cc-doc-tracker')}
`;
  console.log(help);
}

/**
 * Check if help flag is present
 */
export function hasHelpFlag(args: string[]): boolean {
  return args.includes('--help') || args.includes('-h');
}

/**
 * Check if version flag is present
 */
export function hasVersionFlag(args: string[]): boolean {
  return args.includes('--version') || args.includes('-v');
}
