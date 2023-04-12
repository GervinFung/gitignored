import child from 'child_process';

const main = () => {
    const ubuntus = [
        { name: 'focal', version: 20, mongoVersion: 5 },
        { name: 'jammy', version: 22, mongoVersion: 6 },
    ] as const;

    const run = (command: string) => {
        console.log(command);
        child.execSync(command, { stdio: 'inherit' });
    };
    const image = process.env['ImageOS'];
    const ubuntu =
        ubuntus.find((ubuntu) => image === `ubuntu${ubuntu.version}`) ??
        ubuntus[1];

    console.log({ ubuntu, image });

    // ref: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04
    const install = () => {
        const mongoVersion = parseFloat(
            process.env['INPUT_MONGODB-VERSION'] ||
                ubuntu.mongoVersion.toString()
        ).toFixed(1);
        run(`sudo apt-get install gnupg`);
        run(
            `wget -qO - https://www.mongodb.org/static/pgp/server-${mongoVersion}.asc | sudo apt-key add -`
        );
        run(
            `echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu ${ubuntu.name}/mongodb-org/${mongoVersion} multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-${mongoVersion}.list`
        );
        run('sudo apt-get update');
        run('sudo apt-get install -y mongodb-org');
    };

    install();

    run('sudo systemctl start mongod');
};

main();
