const child = require('child_process');

exports.onPostBuild = () => {
    const { stdout, stderr } = child.exec(
        'make clean-up',
        (error, stderr, stdout) => {
            if (stdout) {
                console.log(`serve stdout: ${stdout}`);
            }
            if (stderr) {
                console.error(`serve stderr: ${stderr}`);
            }
            if (error !== null) {
                console.log(`serve error: ${error}`);
            }
        }
    );
    stdout?.on('data', (data) => console.log(data));
    stderr?.on('data', (data) => console.log(data));
};
