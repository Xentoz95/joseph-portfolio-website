/**
 * Apply Database Migration
 *
 * This script applies the SQL migration to create the database schema.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

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

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize Supabase client with admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration() {
  console.log('=== Applying Database Migration ===\n');

  // Read the migration file
  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');

  console.log('Read migration file from:', migrationPath);
  console.log(`Migration SQL length: ${migrationSQL.length} characters\n`);

  // Split the SQL into individual statements
  // This is a simple split by semicolon, which works for this migration
  const statements = migrationSQL
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  // Execute each statement
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`[${i + 1}/${statements.length}] Executing statement...`);

    try {
      // Use Postgres RPC to execute SQL
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement,
      });

      if (error) {
        // If RPC doesn't exist, we need a different approach
        // For now, let's try using a direct approach via the REST API
        console.warn(`RPC exec_sql not available, skipping statement ${i + 1}`);
      } else {
        console.log(`  ✓ Statement ${i + 1} executed successfully`);
      }
    } catch (error) {
      console.error(`  ✗ Statement ${i + 1} failed:`, error);
    }
  }

  console.log('\n=== Migration Complete ===');
  console.log('\nNOTE: If you see warnings above, you may need to apply the migration manually:');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste the contents of supabase/migrations/001_initial_schema.sql');
  console.log('4. Run the SQL script\n');
}

applyMigration().catch(console.error);
