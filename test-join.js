import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Testing items join profiles...');
    const { data: itemData, error: itemErr } = await supabase
        .from('items')
        .select('*, profiles:responsible_id(full_name)')
        .limit(1);

    if (itemErr) {
        console.error('Items join profiles error:', itemErr.message);
    } else {
        console.log('Items join profiles success:', itemData);
    }

    console.log('Testing borrowings join profiles...');
    const { data: borrowData, error: borrowErr } = await supabase
        .from('borrowings')
        .select('*, items(code, name), profiles:borrower_id(full_name)')
        .limit(1);

    if (borrowErr) {
        console.error('Borrowings join profiles error:', borrowErr.message);
    } else {
        console.log('Borrowings join profiles success:', borrowData);
    }
}

run();
