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
    console.log('Inserting test category...');
    const { data: catData, error: catErr } = await supabase.from('categories').insert({
        id: 'test-cat',
        name: 'Test Category',
        icon: 'Package',
        description: 'Test'
    }).select();

    if (catErr) {
        console.error('Category error:', catErr.message);
    } else {
        console.log('Category inserted:', catData);
    }

    console.log('Inserting test location...');
    const { data: locData, error: locErr } = await supabase.from('locations').insert({
        id: 'test-loc',
        name: 'Test Location',
        description: 'Test'
    }).select();

    if (locErr) {
        console.error('Location error:', locErr.message);
    } else {
        console.log('Location inserted:', locData);
    }

    console.log('Inserting test item...');
    const { data: itemData, error: itemErr } = await supabase.from('items').insert({
        code: 'TEST-001',
        name: 'Test Item',
        category_id: 'test-cat',
        location_id: 'test-loc',
        condition: 'Baik',
        status: 'Tersedia',
        purchase_date: '2026-08-20',
        price: 150000,
        supplier: 'Test Supplier',
        responsible_id: null,
        serial: 'SN-TEST-001',
        invoice: 'INV-TEST-001',
        brand: 'TestBrand',
        model: 'TestModel',
        warranty: '1 Tahun',
        description: 'Test Description'
    }).select();

    if (itemErr) {
        console.error('Item error:', itemErr.message);
    } else {
        console.log('Item inserted:', itemData);
    }

    // Clean up
    if (itemData && itemData.length > 0) {
        await supabase.from('items').delete().eq('id', itemData[0].id);
    }
    await supabase.from('locations').delete().eq('id', 'test-loc');
    await supabase.from('categories').delete().eq('id', 'test-cat');
}

run();
