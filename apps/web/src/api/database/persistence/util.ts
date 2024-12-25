import { AsyncOperation } from '@poolofdeath20/util';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class DatabaseOperation {
	static readonly succeed = AsyncOperation.succeed;

	static readonly failed = (error: string | Error) => {
		return AsyncOperation.failed(error);
	};
}

export default DatabaseOperation;
