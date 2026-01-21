
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
    console.log('Testing query...');
    const { data, error } = await supabase
        .from('deals')
        .select(`
            *,
            initiator:profiles!initiator_id(full_name),
            recipient:profiles!recipient_id(full_name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Query Error:', error);
    } else {
        console.log('Query Success. Rows:', data?.length);
        if (data && data.length > 0) {
            console.log('First row:', JSON.stringify(data[0], null, 2));
        }
    }
}

testQuery();
