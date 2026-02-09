/**
 * Apply SQL Migration via Supabase REST API
 *
 * This script attempts to apply the SQL migration using the REST API.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');

    envContent.split('\n').forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.warn('Could not load .env.local file:', error);
  }
}

loadEnvFile();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function applySQL() {
  console.log('=== Applying SQL Migration via REST API ===\n');

  // Read the migration file
  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');

  console.log('Migration file read successfully');
  console.log(`SQL length: ${migrationSQL.length} characters\n`);

  // Try to execute via pgsql endpoint (this may not work without proper setup)
  const endpoint = `${SUPABASE_URL}/rest/v1/rpc/exec_sql`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({
        query: migrationSQL,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Migration applied successfully:', data);
    } else {
      const error = await response.text();
      console.error('Failed to apply migration:', response.status, error);
      console.log('\nThe RPC function exec_sql may not exist.');
    }
  } catch (error) {
    console.error('Error applying migration:', error);
  }

  console.log('\n=== Manual Setup Required ===');
  console.log('If the migration failed, please apply it manually:');
  console.log(`\n1. Go to ${SUPABASE_URL}`);
  console.log('2. Navigate to SQL Editor');
  console.log('3. Create a new query');
  console.log('4. Copy and paste the contents of:');
  console.log(`   ${migrationPath}`);
  console.log('5. Run the query\n');
}

applySQL().catch(console.error);
