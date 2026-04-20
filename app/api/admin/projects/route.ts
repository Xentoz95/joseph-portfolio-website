import { NextResponse } from 'next/server';
import type { ProjectImages } from '@/types/database';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function supabaseFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${SUPABASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      ...options.headers,
    },
  });
  return response;
}

export async function GET() {
  try {
    const response = await supabaseFetch('/rest/v1/projects?select=*&order=created_at.desc');
    const data = await response.json();
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const project = await request.json();

    const images: ProjectImages = {
      thumbnail: project.thumbnail || null,
      hero: project.hero || null,
      gallery: project.gallery || [],
      alt: project.alt || project.title || '',
    };

    const insertData = {
      id: project.id,
      title: project.title,
      description: project.description,
      slug: project.slug || project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      tags: project.tags || [],
      images,
      demo_url: project.liveUrl || null,
      repo_url: project.githubUrl || null,
      featured: project.featured || false,
      category: project.category || 'web',
      published_at: project.published ? new Date().toISOString() : null,
    };

    const response = await supabaseFetch('/rest/v1/projects', {
      method: 'POST',
      body: JSON.stringify(insertData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error creating project:', error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const project = await request.json();

    if (!project.id) {
      return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });
    }

    const images: ProjectImages = {
      thumbnail: project.thumbnail || null,
      hero: project.hero || null,
      gallery: project.gallery || [],
      alt: project.alt || project.title || '',
    };

    const updateData = {
      title: project.title,
      description: project.description,
      slug: project.slug,
      tags: project.tags || [],
      images,
      demo_url: project.liveUrl || null,
      repo_url: project.githubUrl || null,
      featured: project.featured || false,
      category: project.category,
      published_at: project.published ? (project.published_at || new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    };

    const response = await supabaseFetch(
      `/rest/v1/projects?id=eq.${project.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Error updating project:', error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });
    }

    const response = await supabaseFetch(
      `/rest/v1/projects?id=eq.${id}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Error deleting project:', error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
