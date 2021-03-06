import archiver from 'archiver';
import boxen from 'boxen';
import chalk from 'chalk';
import { ProgressData } from 'cpy';
import figlet from 'figlet';
import figures from 'figures';
import findUp from 'find-up';
import gradient from 'gradient-string';
import logSymbols from 'log-symbols';
import path from 'path';
import PrettyError from 'pretty-error';
import { WpackioError } from '../errors/WpackioError';
import { ArchiveResolve } from '../scripts/Pack';

let isYarnCache: boolean | null = null;

export const wpackLogo = gradient.instagram.multiline(
	figlet.textSync('wpack.io', {
		font: 'Big',
		horizontalLayout: 'full',
		verticalLayout: 'full',
	})
);

export const watchSymbol = '👀';
export const watchEllipsis = chalk.dim(figures.ellipsis);

export const bulletSymbol = chalk.magenta(figures.pointer);

export const wpackLogoSmall = gradient.instagram('wpack.io');

export const wpackLink = `${chalk.blue.underline('https://wpack.io')}`;

export const wpackIntro = `\n${boxen(wpackLogo, {
	borderStyle: 'round',
	borderColor: 'magenta',
	float: 'center',
	align: 'center',
	padding: 1,
	dimBorder: true,
})}\n`;

export function isYarn(): boolean {
	const cwd = process.cwd();
	if (isYarnCache !== null) {
		return isYarnCache;
	}
	try {
		isYarnCache = findUp.sync('yarn.lock', { cwd }) != null;

		return isYarnCache;
	} catch (_) {
		isYarnCache = false;

		return isYarnCache;
	}
}

export const contextHelp: string = `Path to context or project root directory. Defaults to current working directory. It is recommended to use absolute path, else it is calculated from current working directory. The path you mention here should be what the URL 'localhost/wp-content/<themes|plugins>/<slug>/' map to. In most cases, you should leave it, because calling the program from npm or yarn script should automatically set it.`;
export function printIntro(): void {
	console.log(wpackIntro);
}

/**
 * Resolve `cwd`, a.k.a, current working directory or context from user input.
 * It takes into account the `--context [path]` option from CLI and uses process
 * cwd, if not provided.
 *
 * @param options Options as received from CLI
 */
export function resolveCWD(
	options: { context?: string | undefined } | undefined
): string {
	let cwd = process.cwd();
	// If user has provided cwd, then use that instead
	if (options && options.context) {
		const { context } = options;
		if (path.isAbsolute(options.context)) {
			cwd = context;
		} else {
			cwd = path.resolve(cwd, context);
		}
	}

	return cwd;
}

export function serverInfo(url: string, uiUrl: string | boolean): void {
	const msg = `${wpackLogoSmall} server is running ${chalk.redBright('hot')}.
You can now view it in your browser.

    ${bulletSymbol} ${chalk.bold(
		'Network address:'
	)} visit ${chalk.blue.underline(url)}.
    ${bulletSymbol} ${chalk.bold('BrowserSync UI:')} ${
		typeof uiUrl === 'string'
			? chalk.blue.underline(uiUrl)
			: chalk.red('N/A')
	}.
    ${bulletSymbol} ${chalk.bold('Force Compile:')} press ${chalk.yellow('r')}.
    ${bulletSymbol} ${chalk.bold('Stop Server:')} press ${chalk.yellow(
		'Ctrl'
	)} + ${chalk.yellow('c')} OR ${chalk.yellow('q')}.
    ${bulletSymbol} ${chalk.bold('Enqueue Assets:')} visit ${wpackLink}.

No files are written on disk during ${chalk.cyan('development')} mode.

To create production build, run ${chalk.yellow(
		isYarn() ? 'yarn build' : 'npm run build'
	)}.`;
	console.log(
		boxen(msg, {
			padding: 1,
			borderColor: 'cyan',
			align: 'left',
			float: 'left',
			borderStyle: 'round',
		})
	);
}

export function endServeInfo(): void {
	console.log('\n');
	const msg = `${wpackLogoSmall} server has been ${chalk.redBright(
		'stopped'
	)}.

    ${bulletSymbol} To create production build, run ${chalk.yellow(
		isYarn() ? 'yarn build' : 'npm run build'
	)}.
    ${bulletSymbol} For more info, visit: ${wpackLink}.

Thank you for using ${wpackLink}.
To spread the ${chalk.red(figures.heart)} please tweet.`;

	console.log(
		boxen(msg, {
			padding: 1,
			borderColor: 'cyan',
			align: 'left',
			float: 'left',
			borderStyle: 'round',
		})
	);
}

export function endBuildInfo(localUrl: string): void {
	console.log('\n');
	const msg = `${wpackLogoSmall} production build was ${chalk.green(
		'successful'
	)}.

All files were written to disk and you can visit your local server.

If your filesize is too large, remember you can use advanced
dynamic import and multiple entry-points easily with ${wpackLogoSmall}.

    ${bulletSymbol} Local Server: ${chalk.blue.underline(localUrl)}.
    ${bulletSymbol} For more info, visit: ${wpackLink}.

To spread the ${chalk.red(figures.heart)} please tweet.`;

	console.log(
		boxen(msg, {
			padding: 1,
			borderColor: 'cyan',
			align: 'left',
			float: 'left',
			borderStyle: 'round',
		})
	);
}

export function endBootstrapInfo(): void {
	console.log('\n');
	const msg = `${wpackLogoSmall} was ${chalk.green(
		'successfully'
	)} integrated within your project.

If this is your first run edit your ${chalk.bold.magenta('wpackio.project.js')}
file and put entrypoints. You will find examples within the file itself.

You should keep ${chalk.bold.yellow('wpackio.server.js')} outside your VCS
tracking as it will most likely differ for different users.

You can run ${chalk.dim('bootstrap')} command again and it will just
create the ${chalk.bold.yellow('wpackio.server.js')} file if not present.

    ${bulletSymbol} Start Development: ${chalk.yellow(
		isYarn() ? 'yarn start' : 'npm start'
	)}.
    ${bulletSymbol} Production Build: ${chalk.yellow(
		isYarn() ? 'yarn build' : 'npm run build'
	)}.
    ${bulletSymbol} Create local server config: ${chalk.yellow(
		isYarn() ? 'yarn bootstrap' : 'npm run bootstrap'
	)}.
    ${bulletSymbol} Create distributable zip: ${chalk.yellow(
		isYarn() ? 'yarn archive' : 'npm run archive'
	)}.
    ${bulletSymbol} For more info, visit: ${wpackLink}.

To enqueue the assets within your plugin or theme, make sure you have
the ${chalk.yellow('wpackio/enqueue')} from packagist.org/composer
and follow the intructions from documentation.

To spread the ${chalk.red(figures.heart)} please tweet.`;

	console.log(
		boxen(msg, {
			padding: 1,
			borderColor: 'cyan',
			align: 'left',
			float: 'left',
			borderStyle: 'round',
		})
	);
}

export function prettyPrintError(
	e: Error | WpackioError,
	errorMsg: string
): void {
	const errorPrefix = `  ${chalk.dim.red(figures.pointer)}  `;
	console.log(chalk.dim('='.repeat(errorMsg.length + 2)));
	console.log(`${logSymbols.error} ${errorMsg}`);
	console.log(chalk.dim('='.repeat(errorMsg.length + 2)));
	console.log('');
	if (e instanceof WpackioError) {
		console.log(chalk.bgRed.black(' please review the following errors '));
		console.log('');
		console.error(
			errorPrefix +
				e.message
					.split('\n')
					.reduce((acc, line) => `${acc}\n${errorPrefix}${line}`)
		);
	} else {
		const pe = new PrettyError();
		console.error(pe.render(e));
	}
	console.log('\n\n\n');
}

export function getProgressBar(done: number): string {
	if (isNaN(done) || done === Infinity || done === -Infinity) {
		// tslint:disable-next-line:no-parameter-reassignment
		done = 0;
	}
	const pbDoneLength = Math.floor((done / 100) * 20);

	let gFunc = gradient('red', 'red');
	if (pbDoneLength >= 5) {
		gFunc = gradient('red', 'red', 'yellow');
	}
	if (pbDoneLength >= 10) {
		gFunc = gradient('red', 'red', 'yellow', 'yellow');
	}
	if (pbDoneLength >= 15) {
		gFunc = gradient('red', 'red', 'yellow', 'yellow', 'green');
	}

	const pbDone = gFunc('='.repeat(pbDoneLength));
	const pbDoing = chalk.gray('-'.repeat(20 - pbDoneLength));
	return `[${pbDone}${pbDoing}] ${chalk.yellow(done.toString())}%`;
}

export function getFileCopyProgress(progress?: ProgressData): string {
	let done = 0;
	let totalFiles = 0;
	let filesDone = 0;
	let size = 0;
	if (progress) {
		done = Math.round(
			(progress.completedFiles / progress.totalFiles) * 100
		);
		totalFiles = progress.totalFiles;
		filesDone = progress.completedFiles;
		size = progress.completedSize;
	}

	return `copying files ${getProgressBar(done)} ${chalk.magenta(
		filesDone.toString()
	)}${chalk.dim('/')}${chalk.cyan(totalFiles.toString())} Files ${chalk.blue(
		(size / 1024).toFixed(2)
	)} KB`;
}

export function getZipProgress(data?: archiver.ProgressData): string {
	let entriesTotal = 0;
	let entriesProcessed = 0;
	let bytesTotal = 0;
	let bytesProcessed = 0;
	if (data) {
		entriesTotal = data.entries.total;
		entriesProcessed = data.entries.processed;
		bytesTotal = data.fs.totalBytes;
		bytesProcessed = data.fs.processedBytes;
	}
	const done = Math.round((entriesProcessed / entriesTotal) * 100);
	return `creating zip ${getProgressBar(done)} ${chalk.magenta(
		entriesProcessed.toString()
	)}${chalk.dim('/')}${chalk.cyan(
		entriesTotal.toString()
	)} Files ${chalk.blue((bytesProcessed / 1024).toFixed(2))}${chalk.dim(
		'/'
	)}${chalk.cyan((bytesTotal / 1024).toFixed(2))} KB`;
}

export function endPackInfo(results: ArchiveResolve): void {
	console.log('\n');
	const msg = `${wpackLogoSmall} package and archive was ${chalk.green(
		'successful'
	)}.

We have created ${chalk.magenta('.zip')} archive file for you
to distribute directly or work through CI/CD server.

    ${bulletSymbol} Zip Location: ${chalk.blue(results.relPath)}.
    ${bulletSymbol} File Size: ${chalk.blue(
		(results.size / 1024).toFixed(2)
	)} KB.
    ${bulletSymbol} For more info, visit: ${wpackLink}.

To spread the ${chalk.red(figures.heart)} please tweet.`;

	console.log(
		boxen(msg, {
			padding: 1,
			borderColor: 'cyan',
			align: 'left',
			float: 'left',
			borderStyle: 'round',
		})
	);
}
