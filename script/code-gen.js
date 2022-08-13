import dotenv from 'dotenv';
import * as fs from 'fs';

const castAsString = (string) => {
    if (typeof string === 'string') {
        return string;
    }
    throw new Error(`${string} is not a string, its ${typeof string} instead`);
};

const main = () => {
    dotenv.config();
    const api = castAsString(process.env.API);
    const fileName = castAsString(process.env.FILE_NAME);
    console.log({
        api,
        fileName,
    });
    fs.writeFile(
        `${process.cwd()}/src/env.rs`,
        `use crate::util::Str;

#[derive(Debug)]
pub struct Env;

impl Env {
    pub const API: Str = "${api}";
    pub const FILE_NAME: Str = "${fileName}";
}`,
        (err) =>
            err
                ? console.error(err)
                : console.log('generated rust file from .env')
    );
};

main();
