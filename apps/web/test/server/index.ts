import child from 'child_process';

export default class Server {
	private constructor(private readonly port: number) {}

	static readonly of = (port: number) => {
		return new this(port);
	};

	readonly getPort = () => {
		return this.port;
	};

	readonly kill = () => {
		child.execSync('make kill-server', {
			encoding: 'utf-8',
		});
	};

	readonly start = async () => {
		const server = child
			.exec(`make start arguments="-p ${this.port}"`)
			.on('spawn', () => {
				return console.log('spawned server');
			})
			.on('message', console.log)
			.on('error', console.error)
			.on('kill', this.kill);

		server.stdout?.setEncoding('utf-8');
		server.stderr?.setEncoding('utf-8');

		await new Promise<void>((resolve) => {
			server.stdout?.on('data', (data: string) => {
				if (data.includes(`${this.port}`)) {
					resolve();
				}
			});
		});
	};
}
