import { parse } from 'valibot';

const singleFlowParser = <T extends Parameters<typeof parse>[0]>(parser: T) => {
	return (data: unknown) => {
		return parse(parser, data);
	};
};

export { singleFlowParser };
