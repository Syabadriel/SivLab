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

async function fetchSchema() {
    const url = `${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`;
    console.log('Fetching schema from', url);
    try {
        const res = await fetch(url, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch schema: ${res.statusText}`);
        }
        const data = await res.json();

        // Save to a file for review
        fs.writeFileSync('schema-api.json', JSON.stringify(data, null, 2));

        console.log('Schema successfully written to schema-api.json');
        if (data.definitions) {
            console.log('Tables defined in OpenAPI:');
            Object.keys(data.definitions).forEach(table => {
                const columns = Object.keys(data.definitions[table].properties || {});
                console.log(`- ${table}: [${columns.join(', ')}]`);
            });
        }
    } catch (err) {
        console.error('Error fetching schema:', err);
    }
}

fetchSchema();
