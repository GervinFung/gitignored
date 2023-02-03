import child from 'child_process';
import axios from 'axios';

const parse = <T>(t: T | undefined): T => {
    if (t === undefined) {
        throw new Error(`t of ${t} be undefined`);
    }
    return t;
};

const serverConfig = {
    port: 3000,
} as const;

const httpResponseJson = async ({
    param,
}: Readonly<{
    param: string;
}>) =>
    (await axios.get(`http://0.0.0.0:${serverConfig.port}/api/${param}`)).data;

class Server {
    private readonly port: number;

    private constructor() {
        this.port = serverConfig.port;
    }

    static create = () => new this();

    getPort = () => this.port;

    kill = () => {
        child.exec(`kill $(lsof -t -i:${this.port})`);
    };

    start = async () => {
        const server = child
            .exec(`make start arguments="-p ${this.port}"`)
            .on('spawn', () => console.log('spawned server'))
            .on('message', console.log)
            .on('error', console.error)
            .on('kill', () => {
                this.kill();
            });
        server.stdout?.setEncoding('utf-8');
        server.stderr?.setEncoding('utf-8');
        await new Promise<void>((resolve) => {
            server.stdout?.on('data', (data: string) => {
                console.log({
                    data,
                });
                if (data.includes('ready - started server')) {
                    resolve();
                }
            });
        });
    };
}

export { parse, httpResponseJson, serverConfig, Server };
