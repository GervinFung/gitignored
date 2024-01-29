import type { AsyncResult, Result } from '@poolofdeath20/util';

type ResultOfAsync<T> = ReturnType<Result<T>['toJson']>;

const result = <T>(operation: () => Promise<AsyncResult<T>>) => {
	return async () => {
		try {
			const result = await operation();

			if (result.hadFailed()) {
				console.error(result.reason());
			}

			return result.toJson();
		} catch (error) {
			return {
				hadSucceed: false,
				reason:
					error instanceof Error
						? error
						: new Error(JSON.stringify(error), { cause: error }),
			} as const;
		}
	};
};

export type { ResultOfAsync };

export { result };
