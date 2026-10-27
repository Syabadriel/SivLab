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
        // Items table column check
        { table: 'items', col: 'categoryId' },
        { table: 'items', col: 'category_id' },
        { table: 'items', col: 'locationId' },
        { table: 'items', col: 'location_id' },
        { table: 'items', col: 'purchaseDate' },
        { table: 'items', col: 'purchase_date' },
        { table: 'items', col: 'code' },
        { table: 'items', col: 'name' },
        { table: 'items', col: 'condition' },
        { table: 'items', col: 'status' },
        { table: 'items', col: 'price' },
        { table: 'items', col: 'supplier' },
        { table: 'items', col: 'responsible' },
        { table: 'items', col: 'brand' },
        { table: 'items', col: 'model' },
        { table: 'items', col: 'serial' },
        { table: 'items', col: 'warranty' },
        { table: 'items', col: 'invoice' },
        { table: 'items', col: 'description' },
        { table: 'items', col: 'history' },

        // Borrowings table
        { table: 'borrowings', col: 'id' },
        { table: 'borrowings', col: 'itemId' },
        { table: 'borrowings', col: 'item_id' },
        { table: 'borrowings', col: 'borrower' },
        { table: 'borrowings', col: 'borrowDate' },
        { table: 'borrowings', col: 'borrow_date' },

        // Maintenance table
        { table: 'maintenance', col: 'id' },
        { table: 'maintenance', col: 'itemId' },
        { table: 'maintenance', col: 'item_id' },
        { table: 'maintenance', col: 'type' },
        { table: 'maintenance', col: 'cost' }
    ];

    console.log('Testing column names:');
    for (const t of tests) {
        const res = await testColumn(t.table, t.col);
        console.log(`- ${t.table}.${t.col}: ${res.ok ? '✅ OK' : '❌ Error: ' + res.error}`);
    }
}

run();
