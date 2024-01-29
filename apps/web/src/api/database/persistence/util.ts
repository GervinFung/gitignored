import { AsyncOperation } from '@poolofdeath20/util';

import type { PostgrestError } from '@supabase/supabase-js';

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
