import { genEnvTypeDef } from 'gen-env-type-def';

genEnvTypeDef([
	{
		inDir: 'config',
		envType: 'process.env',
		outDir: '.',
	},
]);
