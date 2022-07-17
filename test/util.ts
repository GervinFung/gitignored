const parse = <T>(t: T | undefined): T => {
    if (t === undefined) {
        throw new Error(`t of ${t} be undefined`);
    }
    return t;
};

export { parse };
