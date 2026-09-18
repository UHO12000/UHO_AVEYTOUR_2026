const SUPABASE_URL = "https://abiifkmehunqwwfyyjos.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_S7F1uo8kbpSJmnfNi-bc5w_zhLAxxcN";

export const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);