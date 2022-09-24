import type { NextApiRequest, NextApiResponse } from 'next';
import type { DeepReadonly } from '../../common/type';

type Response<T> = string | DeepReadonly<T>;

type EndPointFunc<T> = (
    req: NextApiRequest,
    res: NextApiResponse<Response<T>>
) => Promise<void>;

const parseAsStringEnv = ({
    env,
    name,
}: Readonly<{
    env: unknown;
    name: string;
}>) => {
    if (typeof env === 'string') {
        return env;
    }
    throw new TypeError(
        `Expect process.env.${name} to be string, got typeof "${typeof env}" with value of "${env}" instead`
    );
};

export { parseAsStringEnv };
export type { EndPointFunc, Response };
