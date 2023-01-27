import child from 'child_process';

const run = (command) => {
    console.log(command);
    child.execSync(command, { stdio: 'inherit' });
};

// ref: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04
const install = ({ mongoVersion }) => {
    run(
        `wget -qO - https://www.mongodb.org/static/pgp/server-${mongoVersion}.asc | sudo apt-key add -`
    );
    run(
        `echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME)/mongodb-org/${mongoVersion} multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-${mongoVersion}.list`
    );
    run(
        `sudo apt-get update -o Dir::Etc::sourcelist="sources.list.d/mongodb-org-${mongoVersion}.list" -o Dir::Etc::sourceparts="-" -o APT::Get::List-Cleanup="0"`
    );
    run('sudo apt-get install -y mongodb-org');
};

const main = () => {
    const image = process.env['ImageOS'];
    const defaultVersion = image == 'ubuntu22' ? '6.0' : '5.0';
    console.log({
        image,
        defaultVersion,
    });
    const mongoVersion = parseFloat(
        process.env['INPUT_MONGODB-VERSION'] || defaultVersion
    ).toFixed(1);

    install({ mongoVersion });

    run('sudo systemctl start mongod');
    run('mongod version');
};

main();
