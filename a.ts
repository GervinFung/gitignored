const packageName = 'eslint';

const output = `
Legend: production dependency, optional only, dev only

@gitignored/web /home/gervin/Documents/programming/node/web/dynamic/gitignored/apps/web

devDependencies:
@typescript-eslint/eslint-plugin 7.16.1
└── eslint 8.57.0 peer
@typescript-eslint/parser 7.16.1
└── eslint 8.57.0 peer
eslint 8.57.0
eslint-plugin-jsx-a11y 6.9.0
└── eslint 8.57.0 peer
eslint-plugin-react 7.35.0
└── eslint 8.57.0 peer
`;

const parse = (output: string, packageName: string) => {
	const lines = output.split('\n');

	const kind = lines.at(0) === 'devDependencies:' ? '-D' : '';

	const expression = new RegExp(
		`^${packageName} ${Array.from({ length: 3 }, () => '\\d+').join('\\.')}$`
	);

	const package = lines.find((line) => {
		return line.match(expression);
	});

	if (!package) {
		throw new Error(`Package ${packageName} not found`);
	}

	const packageWithVersion = package.replace(' ', '@^');

	return packageWithVersion;
};

console.log(parse(output, packageName));
