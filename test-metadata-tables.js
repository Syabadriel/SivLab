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
    const tests = [
        // Categories
        { table: 'categories', col: 'id' },
        { table: 'categories', col: 'name' },
        { table: 'categories', col: 'icon' },
        { table: 'categories', col: 'description' },

        // Locations
        { table: 'locations', col: 'id' },
        { table: 'locations', col: 'name' },
        { table: 'locations', col: 'description' },

        // Notifications
        { table: 'notifications', col: 'id' },
        { table: 'notifications', col: 'title' },
        { table: 'notifications', col: 'message' },
        { table: 'notifications', col: 'text' },
        { table: 'notifications', col: 'type' },
        { table: 'notifications', col: 'created_at' },
        { table: 'notifications', col: 'date' },
        { table: 'notifications', col: 'is_read' },
        { table: 'notifications', col: 'read' },
    ];

    console.log('Testing column names:');
    for (const t of tests) {
        const res = await testColumn(t.table, t.col);
        console.log(`- ${t.table}.${t.col}: ${res.ok ? '✅ OK' : '❌ Error: ' + res.error}`);
    }
}

run();
