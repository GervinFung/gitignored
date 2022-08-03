import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';

type DeepReadonly<T> = T extends (infer R)[]
    ? ReadonlyArray<DeepReadonly<R>>
    : T extends object
    ? DeepReadonlyObject<T>
    : T;

type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

type Response<T> = string | DeepReadonly<T>;

type EndPointFunc<T> = (
    req: GatsbyFunctionRequest,
    res: GatsbyFunctionResponse<Response<T>>
) => Promise<void>;

export type { EndPointFunc };
