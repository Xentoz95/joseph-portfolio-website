/**
 * Check Database Connection and Tables
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

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkDatabase() {
  console.log('=== Checking Database Connection ===\n');

  // Try to query the projects table
  console.log('Checking if projects table exists...');
  const { data, error } = await supabase
    .from('projects')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Error querying projects table:', error.message);
    console.error('\nThe projects table does not exist yet.');
    console.error('\nTo create the table, apply the migration manually:');
    console.error('1. Go to https://njcggtsozmjhvladuznw.supabase.co');
    console.error('2. Navigate to SQL Editor');
    console.error('3. Copy and paste the contents of supabase/migrations/001_initial_schema.sql');
    console.error('4. Run the SQL script');
    return;
  }

  console.log('✓ Projects table exists!');
  console.log(`Found ${data.length} existing projects`);

  // Check if we can insert
  console.log('\nChecking insert permissions...');
  const testInsert = {
    title: 'Test Project',
    description: 'Test description',
    slug: `test-${Date.now()}`,
    tags: ['test'],
    images: { thumbnail: null, hero: null, gallery: [], alt: '' },
    category: 'web',
    featured: false,
  };

  const { error: insertError } = await supabase
    .from('projects')
    .insert(testInsert);

  if (insertError) {
    console.error('Insert test failed:', insertError.message);
  } else {
    console.log('✓ Insert permissions work!');
    // Clean up test
    await supabase.from('projects').delete().eq('slug', testInsert.slug);
    console.log('✓ Cleaned up test record');
  }
}

checkDatabase().catch(console.error);
