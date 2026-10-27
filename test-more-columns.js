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
        // Items
        { table: 'items', col: 'responsible' },
        { table: 'items', col: 'responsible_person' },
        { table: 'items', col: 'responsible_id' },
        { table: 'items', col: 'user_id' },
        { table: 'items', col: 'serial' },
        { table: 'items', col: 'serial_number' },
        { table: 'items', col: 'serial_no' },
        { table: 'items', col: 'invoice' },
        { table: 'items', col: 'invoice_number' },
        { table: 'items', col: 'invoice_no' },
        { table: 'items', col: 'history' },

        // Borrowings
        { table: 'borrowings', col: 'borrower' },
        { table: 'borrowings', col: 'borrower_name' },
        { table: 'borrowings', col: 'borrower_id' },
        { table: 'borrowings', col: 'purpose' },
        { table: 'borrowings', col: 'return_date' },
        { table: 'borrowings', col: 'status' },
        { table: 'borrowings', col: 'code' },
        { table: 'borrowings', col: 'item_code' },

        // Maintenance
        { table: 'maintenance', col: 'date' },
        { table: 'maintenance', col: 'maintenance_date' },
        { table: 'maintenance', col: 'description' },
        { table: 'maintenance', col: 'status' },
    ];

    console.log('Testing column names:');
    for (const t of tests) {
        const res = await testColumn(t.table, t.col);
        console.log(`- ${t.table}.${t.col}: ${res.ok ? '✅ OK' : '❌ Error: ' + res.error}`);
    }
}

run();
