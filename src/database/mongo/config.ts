import dotenv from 'dotenv';
import { parseAsStringEnv } from 'esbuild-env-parsing';

const mongodbConfig = () => {
    if (process.env.NODE_ENV === 'test') {
        dotenv.config({
            path: `${process.cwd()}/.env.test`,
        });
    }

    return {
        dbName: parseAsStringEnv({
            env: process.env.MONGO_DB,
            name: 'MONGO_DB',
        }),
        address: parseAsStringEnv({
            env: process.env.MONGO_ADDRESS,
            name: 'MONGO_ADDRESS',
        }),
        port: process.env.MONGO_PORT,
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
        srv: process.env.MONGO_SRV,
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
    } as const;
};

export default mongodbConfig;
