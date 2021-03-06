import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import webpack from 'webpack';
import { CreateWebpackConfig } from '../config/CreateWebpackConfig';
import { ProjectConfig } from '../config/project.config.default';
import { ServerConfig } from '../config/server.config.default';

/**
 * Create production ready files.
 */
export class Build {
	private projectConfig: ProjectConfig;
	private serverConfig: ServerConfig;
	private cwd: string;

	constructor(
		projectConfig: ProjectConfig,
		serverConfig: ServerConfig,
		cwd: string
	) {
		this.projectConfig = projectConfig;
		this.serverConfig = serverConfig;
		this.cwd = cwd;
	}

	/**
	 * Build the files.
	 */
	public build(): Promise<{
		status: 'error' | 'warn' | 'success';
		log: string;
	}> {
		return new Promise((resolve, reject) => {
			const config = new CreateWebpackConfig(
				this.projectConfig,
				this.serverConfig,
				this.cwd,
				false
			);
			const compiler = webpack(
				config.getWebpackConfig() as webpack.Configuration
			);
			compiler.run((err, stats) => {
				const raw = stats.toJson('verbose');
				const messages = formatWebpackMessages(raw);
				if (!messages.errors.length && !messages.warnings.length) {
					// All good
					resolve({
						status: 'success',
						log: stats.toString({
							colors: true,
							assets: true,
							chunks: false,
							entrypoints: true,
							hash: false,
							version: false,
							modules: false,
							builtAt: false,
							timings: false,
						}),
					});
				}
				if (messages.errors.length) {
					reject(messages.errors.join('\n'));
				}
				resolve({ status: 'warn', log: messages.warnings.join('\n') });
			});
		});
	}
}
