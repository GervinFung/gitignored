import fs from 'fs';

import toml from 'toml';

const readEnv = () => {
    return fs
        .readFileSync('.env', {
            encoding: 'utf-8',
        })
        .split('\n')
        .filter(Boolean)
        .reduce((prev, keyValuePair) => {
            const [key, value] = keyValuePair.split('=');

            if (!key) {
                throw new Error('key is undefined');
            }

            return {
                ...prev,
                [key]: value,
            };
        }, {});
};

const readConfig = () => {
    const { package: pkg } = toml.parse(
        fs.readFileSync('Cargo.toml', {
            encoding: 'utf-8',
        })
    );

    return {
        name: pkg.name,
        version: pkg.version,
        author: pkg.authors[0],
        about: pkg.description,
    };
};

const main = () => {
    const env = readEnv();

    const api = env.API;

    const fileName = env.FILE_NAME;

    const cache = env.CACHE;

    const { name, version, author, about } = readConfig();

    console.log({
        api,
        fileName,
        cache,
        name,
        version,
        author,
        about,
    });

    const target = `${process.cwd()}/src/env.rs`;

    fs.writeFile(
        target,
        `use crate::types::Str;

#[derive(Debug)]
pub struct Env;

impl Env {
    pub const API: Str = "${api}";
    pub const FILE_NAME: Str = "${fileName}";
    pub const CACHE: Str = "${cache}";
    pub const VERSION: Str = "${version}";
    pub const NAME: Str = "${name}";
    pub const AUTHOR: Str = "${author}";
    pub const ABOUT: Str = "${about}";
}`,
        (err) =>
            err
                ? console.error(err)
                : console.log(`generated ${target} from .env`)
    );
};

main();
