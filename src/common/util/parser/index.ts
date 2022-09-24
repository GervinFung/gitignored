const parseAsString = (u: unknown) => {
    if (typeof u === 'string') {
        return u;
    }
    throw new Error('expect u to be string, got ${u} instead');
};

const parseAsArray = <T>(u: unknown, map: (val: any) => T) =>
    (Array.isArray(u) ? u : []).map(map);

export { parseAsArray, parseAsString };
