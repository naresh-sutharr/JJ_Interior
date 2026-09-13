const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('business_profile').select('*').limit(1);
  console.log("Business Profile:", data, "Error:", error?.message);
  
  const { data: clients, error: clientErr } = await supabase.from('clients').select('id').limit(1);
  console.log("Clients:", clients, "Error:", clientErr?.message);
}

test();
