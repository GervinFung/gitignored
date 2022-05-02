import dotenv from 'dotenv';
import { parseAsEnv } from 'esbuild-env-parsing';

const mongodbConfig = (() => {
    const nodeEnv = parseAsEnv({
        env: process.env.NODE_ENV,
        name: 'node env',
    });

    dotenv.config({
        path: `${process.cwd()}/.env${nodeEnv === 'test' ? '.test' : ''}`,
    });

    const { env } = process;

    const isProductionOrStaging =
        nodeEnv === 'production' || nodeEnv === 'staging';

    return {
        dbName: parseAsEnv({
            env: env.MONGO_DB,
            name: 'MONGO_DB',
        }),
        address: parseAsEnv({
            env: env.MONGO_ADDRESS,
            name: 'MONGO_ADDRESS',
        }),
        port: parseAsEnv({
            env: env.MONGO_PORT,
            name: 'MONGO_PORT',
        }),
        collections: {
            tech: parseAsEnv({
                env: env.MONGO_COLLECTION_TECH,
                name: 'MONGO_COLLECTION_TECH',
            }),
            timeStamp: parseAsEnv({
                env: env.MONGO_COLLECTION_TIMESTAMP,
                name: 'MONGO_COLLECTION',
            }),
        },
        srv: !isProductionOrStaging ? '' : '+srv',
        auth: {
            user: parseAsEnv({
                env: env.MONGO_USER,
                name: 'MONGO_USER',
            }),
            password: parseAsEnv({
                env: env.MONGO_PASSWORD,
                name: 'MONGO_PASSWORD',
            }),
        },
        server: !isProductionOrStaging
            ? undefined
            : {
                  address: parseAsEnv({
                      env: env.MONGO_ADDRESS,
                      name: 'MONGO_ADDRESS',
                  }),
                  port: parseAsEnv({
                      env: env.MONGO_PORT,
                      name: 'MONGO_PORT',
                  }),
              },
    } as const;
})();

export default mongodbConfig;
