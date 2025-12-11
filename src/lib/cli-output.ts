import chalk from 'chalk';

/**
 * Document statistics interface
 */
export interface DocStats {
  totalDocs: number;
  successfulFetch: number;
  failedFetch: number;
  failedFiles?: string[];
  deletedFiles?: number;
  lastMapUpdate?: string;
}

/**
 * Document info interface
 */
export interface DocListItem {
  title: string;
  filename: string;
}

/**
 * Format and display status/statistics
 */
export function formatStatus(stats: DocStats): void {
  console.log();
  console.log(chalk.bold.cyan('  Documentation Status'));
  console.log(chalk.gray('  ════════════════════════════════'));
  console.log();
  console.log(`  ${chalk.white('Total documents:')}    ${chalk.bold.white(stats.totalDocs)}`);
  console.log(`  ${chalk.green('Successfully fetched:')} ${chalk.bold.green(stats.successfulFetch)}`);

  if (stats.failedFetch > 0) {
    console.log(`  ${chalk.red('Failed:')}              ${chalk.bold.red(stats.failedFetch)}`);
    if (stats.failedFiles && stats.failedFiles.length > 0) {
      stats.failedFiles.forEach(file => {
        console.log(`    ${chalk.red('•')} ${chalk.gray(file)}`);
      });
    }
  } else {
    console.log(`  ${chalk.green('Failed:')}              ${chalk.bold.green('0')}`);
  }

  if (stats.deletedFiles !== undefined && stats.deletedFiles > 0) {
    console.log(`  ${chalk.yellow('Deleted orphans:')}    ${chalk.bold.yellow(stats.deletedFiles)}`);
  }

  if (stats.lastMapUpdate) {
    console.log();
    console.log(`  ${chalk.gray('Last update:')} ${chalk.white(stats.lastMapUpdate)}`);
  }
  console.log();
}

/**
 * Format and display document list
 */
export function formatList(docs: DocListItem[]): void {
  console.log();
  console.log(chalk.bold.cyan('  Fetched Documents'));
  console.log(chalk.gray('  ════════════════════════════════'));
  console.log();

  docs.forEach((doc, index) => {
    const num = (index + 1).toString().padStart(2, ' ');
    console.log(`  ${chalk.gray(num + '.')} ${chalk.white(doc.title)}`);
    console.log(`      ${chalk.gray(doc.filename)}`);
  });

  console.log();
  console.log(`  ${chalk.bold('Total:')} ${chalk.cyan(docs.length)} documents`);
  console.log();
}

/**
 * Format and display error message
 */
export function formatError(error: unknown, debug: boolean = false): void {
  console.log();
  console.log(chalk.bold.red('  Error'));
  console.log(chalk.gray('  ════════════════════════════════'));
  console.log();

  if (error instanceof Error) {
    console.log(`  ${chalk.red('•')} ${error.message}`);

    if (debug && error.stack) {
      console.log();
      console.log(chalk.gray('  Stack trace:'));
      error.stack.split('\n').slice(1).forEach(line => {
        console.log(chalk.gray(`  ${line.trim()}`));
      });
    }
  } else {
    console.log(`  ${chalk.red('•')} ${String(error)}`);
  }

  if (!debug) {
    console.log();
    console.log(chalk.gray('  Tip: Set DEBUG=1 for detailed stack traces'));
  }
  console.log();
}

/**
 * Format and display success message
 */
export function formatSuccess(message: string): void {
  console.log();
  console.log(`  ${chalk.green('✓')} ${chalk.bold.green(message)}`);
  console.log();
}

/**
 * Format and display info message
 */
export function formatInfo(message: string): void {
  console.log(`  ${chalk.blue('ℹ')} ${chalk.white(message)}`);
}

/**
 * Format and display warning message
 */
export function formatWarning(message: string): void {
  console.log(`  ${chalk.yellow('⚠')} ${chalk.yellow(message)}`);
}

/**
 * Display CLI header/banner
 */
export function displayHeader(): void {
  console.log();
  console.log(chalk.bold.cyan('  ccdocs') + chalk.gray(' - Claude Code Documentation Tracker'));
  console.log(chalk.gray('  ════════════════════════════════════════════'));
  console.log();
}

/**
 * Display dry-run mode indicator
 */
export function displayDryRunMode(): void {
  console.log(chalk.bold.yellow('  [DRY RUN MODE]') + chalk.gray(' No files will be written'));
  console.log();
}

/**
 * Format elapsed time
 */
export function formatElapsedTime(startTime: number): string {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  return `${elapsed}s`;
}
