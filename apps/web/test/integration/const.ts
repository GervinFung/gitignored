import type { ResultOfAsync } from '../../src/api/routes/internal/util';

const narrowToSucceed = <T>(data: Awaited<ResultOfAsync<T>>) => {
	if (data.hadSucceed) {
		return data;
	}

	throw new Error(`Type narrowing failed: ${data.reason}`);
};

export { narrowToSucceed };
