import { GitIgnoreFiles, GitIgnoreSelectedTechs } from '../../../common/type';
import fs from 'fs';
import child from 'child_process';

const gitignore = (() => {
    const repo = 'gitignore';
    const directory = `./${repo}`;
    return {
        repo,
        directory,
    };
})();

const getAllGitIgnoreFiles = (dir: string): GitIgnoreFiles =>
    fs.readdirSync(dir).flatMap((file) => {
        const path = `${dir}/${file}`;
        if (fs.statSync(path).isDirectory()) {
            return getAllGitIgnoreFiles(path);
        }
        const extension = path.split('.').pop();
        return extension ? (extension === 'gitignore' ? [path] : []) : [];
    });

const readAllGitIgnoreFileContent = async (file: GitIgnoreFiles[0]) =>
    new Promise<GitIgnoreSelectedTechs[0]['content']>((res, rej) => {
        let content = '';
        fs.createReadStream(file)
            .on('data', (data) => {
                content = data.toString();
            })
            .on('end', () => {
                res(content);
            })
            .on('error', rej);
    });

const getAllGitIgnoreNamesAndContents = (): ReadonlyArray<
    Promise<GitIgnoreSelectedTechs[0]>
> =>
    getAllGitIgnoreFiles(gitignore.repo).map(async (file) => {
        const content = await readAllGitIgnoreFileContent(file);
        const name = file.split('/').pop();
        if (!name) {
            throw new Error(`name is undefined for file ${file}`);
        }
        return {
            name: name.replace('.gitignore', ''),
            content,
        };
    });

const childExec = (command: string, callback: () => void) => {
    const { stdout, stderr } = child.exec(command, (error, stderr, stdout) => {
        if (stdout) {
            console.log(`serve stdout: ${stdout}`);
        }
        if (stderr) {
            console.error(`serve stderr: ${stderr}`);
        }
        if (error !== null) {
            console.log(`serve error: ${error}`);
        }
        callback();
    });
    stdout?.on('data', (data) => console.log(data));
    stderr?.on('data', (data) => console.log(data));
};

const promisifiedGitIgnoreNamesAndContents = () =>
    new Promise<GitIgnoreSelectedTechs>((res) => {
        const { repo, directory } = gitignore;
        childExec(
            `git clone --depth=1 --branch=main https://github.com/github/${repo}.git && rm -rf ${directory}/.git`,
            async () => {
                const namesAndContents: GitIgnoreSelectedTechs =
                    await Promise.all(
                        await getAllGitIgnoreNamesAndContents().reduce(
                            async (prev, curr) =>
                                (await prev).concat(await curr),
                            Promise.resolve([] as GitIgnoreSelectedTechs)
                        )
                    );
                childExec(`rm -rf ${directory}`, () => {
                    console.log(`removed ${repo}`);
                    res(namesAndContents);
                });
            }
        );
    });

export default promisifiedGitIgnoreNamesAndContents;
