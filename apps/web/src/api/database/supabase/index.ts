import type { Database } from './type';

import { createClient } from '@supabase/supabase-js';

type Supabase = ReturnType<typeof supabase>;

const supabase = () => {
	return createClient<Database>(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY
	);
};

export type { Supabase };

export { supabase };
