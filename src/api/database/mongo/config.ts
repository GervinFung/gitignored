import { parseAsStringEnv } from '../../util';

const mongodbConfig = () =>
    ({
        srv: process.env.MONGO_SRV,
        port: process.env.MONGO_PORT,
        dbName: parseAsStringEnv({
            env: process.env.MONGO_DB,
            name: 'MONGO_DB',
        }),
        address: parseAsStringEnv({
            env: process.env.MONGO_ADDRESS,
            name: 'MONGO_ADDRESS',
        }),
        collections: {
            tech: parseAsStringEnv({
                env: process.env.MONGO_COLLECTION_TECH,
                name: 'MONGO_COLLECTION_TECH',
            }),
            updateTime: parseAsStringEnv({
                env: process.env.MONGO_COLLECTION_UPDATE_TIME,
                name: 'MONGO_COLLECTION_UPDATE_TIME',
            }),
        },
        auth: {
            user: parseAsStringEnv({
                env: process.env.MONGO_USER,
                name: 'MONGO_USER',
            }),
            password: parseAsStringEnv({
                env: process.env.MONGO_PASSWORD,
                name: 'MONGO_PASSWORD',
            }),
        },
    } as const);

export default mongodbConfig;
