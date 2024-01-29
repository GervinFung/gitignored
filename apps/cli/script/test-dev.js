import child from 'child_process';

const main = async () => {
    const port = 8081;

    try {
        await new Promise((resolve) => {
            const children = child.exec(
                `cd ../../apps/web && make start arguments="-p ${port}"`
            );

            children.stdout.on('data', () => {
                resolve();
            });

            children.stderr.on('data', (error) => {
                console.error(error);
            });
        });

        child.execSync('make mid-test-dev', { stdio: 'inherit' });

        child.execSync(`kill $(lsof -t -i:${port})`);
    } catch (_) {
        child.execSync(`kill $(lsof -t -i:${port})`);
    }
};

main();
