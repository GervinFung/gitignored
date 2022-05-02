import * as child from 'child_process';
// Log out information after a build is done
const onPostBuild = ({ reporter }) => {
    reporter.info('Build has been completed');
};

const onPreBuild = () => {
    child.execSync('make build');
};

export { onPostBuild, onPreBuild };
