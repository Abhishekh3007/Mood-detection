import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Lightweight query builder stub that supports chaining for select/gte/order/insert/select
class QueryStub {
	async exec() {
		return { data: [], error: null };
	}
	select() { return this; }
	gte() { return this; }
	order() { return this.exec(); }
	insert() { return this; }
	single() { return this.exec(); }
}

const makeStub = () => ({
	from: (_table: string) => new QueryStub(),
	auth: {
		signInWithPassword: async () => ({ data: null, error: null }),
		signUp: async () => ({ data: null, error: null }),
		admin: { createUser: async () => ({ data: null, error: null }) }
	},
	channel: () => ({
		on: () => ({ subscribe: async () => ({}) }),
		subscribe: async () => ({})
	})
});

let supabaseClient: any;
try {
	if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('SUPABASE_URL or KEY missing');
	supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (err) {
	// If creation fails (invalid URL or missing env), export a stub and log a warning.
	// This allows the dev server to start in degraded mode for local testing without secrets.
	// eslint-disable-next-line no-console
	console.warn('[supabase] warning - creating stub client because SUPABASE env is not set or invalid');
	supabaseClient = makeStub();
}

export const supabase = supabaseClient;
export default supabase;
