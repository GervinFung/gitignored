import * as child from 'child_process';

const onPreBuild = () => {
    child.execSync('make build');
};

export { onPreBuild };
