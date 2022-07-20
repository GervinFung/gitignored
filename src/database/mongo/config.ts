import dotenv from 'dotenv';
import { parseAsEnv } from 'esbuild-env-parsing';

const mongodbConfig = () => {
    if (process.env.NODE_ENV === 'test') {
        dotenv.config({
            path: `${process.cwd()}/.env.test`,
        });
    }

    return {
        dbName: parseAsEnv({
            env: process.env.MONGO_DB,
            name: 'MONGO_DB',
        }),
        address: parseAsEnv({
            env: process.env.MONGO_ADDRESS,
            name: 'MONGO_ADDRESS',
        }),
        port: process.env.MONGO_PORT,
        collections: {
            tech: parseAsEnv({
                env: process.env.MONGO_COLLECTION_TECH,
                name: 'MONGO_COLLECTION_TECH',
            }),
            timeStamp: parseAsEnv({
                env: process.env.MONGO_COLLECTION_TIMESTAMP,
                name: 'MONGO_COLLECTION_TIMESTAMP',
            }),
        },
        srv: process.env.MONGO_SRV,
        auth: {
            user: parseAsEnv({
                env: process.env.MONGO_USER,
                name: 'MONGO_USER',
            }),
            password: parseAsEnv({
                env: process.env.MONGO_PASSWORD,
                name: 'MONGO_PASSWORD',
            }),
        },
    } as const;
};

export default mongodbConfig;
