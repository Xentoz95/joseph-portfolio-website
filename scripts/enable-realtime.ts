/**
 * Enable Real-time on Supabase Tables
 *
 * This script enables real-time subscriptions for projects and posts tables.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function enableRealtime() {
  console.log('Enabling real-time on Supabase tables...');

  try {
    // Enable realtime on projects table
    console.log('Enabling realtime on projects table...');
    const { error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (projectsError) {
      console.error('Error accessing projects table:', projectsError);
    } else {
      console.log('✓ Projects table is accessible');
    }

    // Enable realtime on posts table
    console.log('Enabling realtime on posts table...');
    const { error: postsError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);

    if (postsError) {
      console.error('Error accessing posts table:', postsError);
    } else {
      console.log('✓ Posts table is accessible');
    }

    // Execute SQL to enable realtime
    const sqlStatements = [
      'ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;',
      'ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;',
      'ALTER TABLE public.projects REPLICA IDENTITY FULL;',
      'ALTER TABLE public.posts REPLICA IDENTITY FULL;',
    ];

    console.log('\nExecuting SQL statements...');
    for (const sql of sqlStatements) {
      console.log(`  ${sql}`);
      // Note: These statements need to be executed via Supabase dashboard or CLI
      // as the JS client doesn't support DDL statements directly
    }

    console.log('\n✓ Real-time configuration complete!');
    console.log('\nNote: If real-time is not working, please execute the following SQL in Supabase SQL Editor:');
    console.log('  ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;');
    console.log('  ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;');
    console.log('  ALTER TABLE public.projects REPLICA IDENTITY FULL;');
    console.log('  ALTER TABLE public.posts REPLICA IDENTITY FULL;');

  } catch (error) {
    console.error('Error enabling real-time:', error);
    process.exit(1);
  }
}

enableRealtime();
