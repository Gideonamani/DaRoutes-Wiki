import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function validateSchema() {
    console.log('Validating database schema...');

    // List of tables expected from supabase.sql
    const expectedTables = [
        'profile',
        'operators',
        'stops',
        'terminals',
        'routes',
        'route_stops',
        'route_terminals',
        'fares',
        'route_variants',
        'attachments',
        'content_revisions',
        'workflow_events',
        'audit_log'
    ];

    let missingTables: string[] = [];

    // Check for existence of each table
    // Note: We can't easily check table structure via the JS client without admin rights or specific RPCs.
    // For MVP, we'll check if we can select from them (even if empty).
    for (const table of expectedTables) {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });

        if (error) {
            // If the error is "relation does not exist", the table is missing.
            // Other errors (like 401 Unauthorized) might mean RLS is blocking us, but the table exists.
            if (error.message.includes('relation') && error.message.includes('does not exist')) {
                missingTables.push(table);
            } else if (error.code === '42P01') { // Postgres code for undefined table
                missingTables.push(table);
            } else {
                console.log(`✓ Table '${table}' exists (access check: ${error.message || 'OK'})`);
            }
        } else {
            console.log(`✓ Table '${table}' exists`);
        }
    }

    if (missingTables.length > 0) {
        console.error('\n❌ Validation Failed! The following tables are missing:');
        missingTables.forEach(t => console.error(` - ${t}`));
        console.error('\nPlease run the SQL in "supabase.sql" in your Supabase SQL Editor.');
        process.exit(1);
    } else {
        console.log('\n✅ Schema Validation Passed: All expected tables appear to exist.');
    }
}

validateSchema().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
