const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://c--ed517550-c5ca-4116-8678-a72a97c601e8-prod.lovable.cloud', 'sb_publishable_w2f4AQQF06cFD_Tyz9EkLg_69IbsbCN');
async function run() {
  const { data, error } = await supabase.from('projects').insert({ name: 'Test Project', status: 'Planning', client_id: null }).select();
  console.log('Error:', error ? error.message : 'None', 'Data:', data);
}
run();
