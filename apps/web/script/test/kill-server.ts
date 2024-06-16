import child from 'child_process';

import { Defined } from '@poolofdeath20/util';

const main = () => {
	child
		.execSync('ps -ef | grep next', {
			encoding: 'utf-8',
		})
		.split('\n')
		.filter((process) => {
			return process.includes('node ');
		})
		.map((process) => {
			return Defined.parse(process.split(' ').filter(Boolean).at(1))
				.map(parseInt)
				.orThrow('Could not parse process id');
		})
		.forEach((pid) => {
			child.execSync(`kill ${pid}`);
		});
};

main();
