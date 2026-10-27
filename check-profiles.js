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

async function testColumn(table, column) {
    const { data, error } = await supabase.from(table).select(column).limit(1);
    if (error) {
        return { ok: false, error: error.message };
    }
    return { ok: true };
}

async function run() {
    console.log('Checking profiles table presence...');
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (error) {
        console.error('Error selecting from profiles:', error.message);
    } else {
        console.log('Profiles table exists. Rows:', data.length);
        if (data.length > 0) {
            console.log('Columns in profiles:', Object.keys(data[0]));
        }
    }

    // Let's test a few standard columns on profiles
    const cols = ['id', 'name', 'role', 'email', 'full_name', 'username'];
    for (const c of cols) {
        const res = await testColumn('profiles', c);
        console.log(`- profiles.${c}: ${res.ok ? '✅ OK' : '❌'}`);
    }
}

run();
