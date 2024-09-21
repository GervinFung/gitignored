import type { PostgrestError } from '@supabase/supabase-js';

import { AsyncOperation } from '@poolofdeath20/util';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class DatabaseOperation {
	static readonly succeed = AsyncOperation.succeed;

	static readonly failed = (error: string | PostgrestError | Error) => {
		return AsyncOperation.failed(
			typeof error === 'string'
				? error
				: error instanceof Error
					? error
					: `${error.code + error.message}\n${error.details}\n${
							error.hint
						}`
		);
	};
}

export default DatabaseOperation;
