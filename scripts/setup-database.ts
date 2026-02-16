/**
 * Database Setup Script
 *
 * Executes the setup-database.sql file against Supabase.
 * Run with: npx tsx scripts/setup-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
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
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  // Read the SQL file
  const sqlPath = join(process.cwd(), 'setup-database.sql');
  const sql = readFileSync(sqlPath, 'utf-8');

  // Split SQL into individual statements (rough split by semicolons, handling functions)
  // For better results, we'll execute in chunks

  console.log('📄 Executing SQL statements...\n');

  try {
    // Execute the entire SQL using rpc
    // Since we can't execute raw SQL directly via the JS client,
    // we'll use the REST API with the service role key

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      // Try alternative approach - execute statements one by one
      console.log('⚠️  Direct SQL execution not available.');
      console.log('   Please run the SQL manually in Supabase SQL Editor.\n');
      console.log('📋 Instructions:');
      console.log('   1. Go to: https://supabase.com/dashboard/project/njcggtsozmjhvladuznw/sql/new');
      console.log('   2. Copy the contents of setup-database.sql');
      console.log('   3. Paste and click "Run"\n');

      // Try to at least verify if tables exist
      await verifyDatabase();
      return;
    }

    console.log('✅ SQL executed successfully!\n');
    await verifyDatabase();

  } catch (error) {
    console.log('⚠️  Could not execute SQL automatically.');
    console.log('   Please run the SQL manually in Supabase SQL Editor.\n');
    console.log('📋 Instructions:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/njcggtsozmjhvladuznw/sql/new');
    console.log('   2. Copy the contents of setup-database.sql');
    console.log('   3. Paste and click "Run"\n');

    // Try to verify current state
    await verifyDatabase();
  }
}

async function verifyDatabase() {
  console.log('🔍 Verifying database state...\n');

  try {
    // Check projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, slug, featured')
      .limit(10);

    if (projectsError) {
      console.log('❌ Projects table error:', projectsError.message);
      console.log('   → Table may not exist yet. Please run setup-database.sql in Supabase.\n');
    } else {
      console.log(`✅ Projects table exists (${projects?.length || 0} records)`);
      if (projects && projects.length > 0) {
        projects.forEach(p => {
          console.log(`   - ${p.title} (${p.featured ? 'Featured' : 'Regular'})`);
        });
      }
      console.log('');
    }

    // Check posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, slug, published')
      .limit(10);

    if (postsError) {
      console.log('❌ Posts table error:', postsError.message);
      console.log('   → Table may not exist yet. Please run setup-database.sql in Supabase.\n');
    } else {
      console.log(`✅ Posts table exists (${posts?.length || 0} records)`);
      if (posts && posts.length > 0) {
        posts.forEach(p => {
          console.log(`   - ${p.title} (${p.published ? 'Published' : 'Draft'})`);
        });
      }
      console.log('');
    }

    // Check contacts
    const { error: contactsError } = await supabase
      .from('contacts')
      .select('id')
      .limit(1);

    if (contactsError) {
      console.log('❌ Contacts table error:', contactsError.message);
      console.log('   → Table may not exist yet. Please run setup-database.sql in Supabase.\n');
    } else {
      console.log('✅ Contacts table exists\n');
    }

    // Summary
    if (!projectsError && !postsError && !contactsError) {
      console.log('🎉 Database is fully set up and ready!\n');
    } else {
      console.log('⚠️  Database setup incomplete. Please run setup-database.sql in Supabase.\n');
    }

  } catch (error) {
    console.error('Error verifying database:', error);
  }
}

setupDatabase();
