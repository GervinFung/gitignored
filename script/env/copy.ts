import ci from 'ci-info';
import childProcess from 'child_process';
import { parseAsString } from '../../src/common/util/parser';

const main = () => {
    const environment = parseAsString(process.argv.at(2)).replace(/-/g, '');
    console.log({ environment });
    if (!ci.isCI) {
        childProcess.execSync(`cp .env.${environment} .env`, {
            stdio: 'inherit',
        });
    }
};

main();
