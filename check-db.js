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

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://oypeawvuoexinymechbp.supabase.co';
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_95xjuE_-YOvOSjSP8QtxcA_dIfawUQS';

console.log('Connecting to:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

const tablesToCheck = ['items', 'inventory', 'borrowings', 'maintenance', 'categories', 'locations', 'users', 'notifications'];

async function check() {
    for (const table of tablesToCheck) {
        console.log(`\nChecking table: "${table}"...`);
        try {
            const { data, error } = await supabase.from(table).select('*').limit(1);
            if (error) {
                console.log(`❌ Table "${table}" error: ${error.message} (${error.code})`);
            } else {
                console.log(`✅ Table "${table}" access OK. Rows returned: ${data.length}`);
                if (data.length > 0) {
                    console.log(`Columns found:`, Object.keys(data[0]));
                    console.log(`Example row:`, data[0]);
                } else {
                    console.log(`(Table is empty, schema cannot be inferred directly from rows)`);
                }
            }
        } catch (err) {
            console.log(`❌ Exception checking "${table}":`, err.message);
        }
    }
}

check();
