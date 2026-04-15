/**
 * Admin Stats API Route
 *
 * Returns statistics for the admin dashboard using local JSON files
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Load projects
    let projects = [];
    try {
      const projectsPath = path.join(process.cwd(), 'data', 'projects-data.json');
      const projectsContent = fs.readFileSync(projectsPath, 'utf-8');
      projects = JSON.parse(projectsContent);
    } catch (e) {
      projects = [];
    }

    // Load posts
    let posts = [];
    try {
      const postsPath = path.join(process.cwd(), 'data', 'posts-data.json');
      const postsContent = fs.readFileSync(postsPath, 'utf-8');
      posts = JSON.parse(postsContent);
    } catch (e) {
      posts = [];
    }

    // Load contacts
    let contacts = [];
    try {
      const contactsPath = path.join(process.cwd(), 'data', 'contacts-data.json');
      const contactsContent = fs.readFileSync(contactsPath, 'utf-8');
      contacts = JSON.parse(contactsContent);
    } catch (e) {
      contacts = [];
    }

    // Calculate stats
    const stats = {
      projects: {
        total: projects.length,
        published: projects.filter((p: any) => p.published).length,
        drafts: projects.filter((p: any) => !p.published).length,
      },
      posts: {
        total: posts.length,
        published: posts.filter((p: any) => p.published && p.published_at).length,
        drafts: posts.filter((p: any) => !p.published || !p.published_at).length,
      },
      contacts: {
        total: contacts.length,
        unread: contacts.filter((c: any) => !c.read).length,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({
      projects: { total: 0, published: 0, drafts: 0 },
      posts: { total: 0, published: 0, drafts: 0 },
      contacts: { total: 0, unread: 0 },
    }, { status: 200 });
  }
}
