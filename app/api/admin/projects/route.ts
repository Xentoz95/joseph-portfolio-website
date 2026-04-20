import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface ProjectImages {
  thumbnail: string | null;
  hero: string | null;
  gallery: string[];
  alt: string;
}

// Debug helper
function log(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Admin Projects API]', ...args);
  }
}

async function supabaseFetch(endpoint: string, options: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(`Missing env vars: URL=${!!SUPABASE_URL}, KEY=${!!SUPABASE_SERVICE_ROLE_KEY}`);
  }

  const url = `${SUPABASE_URL}${endpoint}`;
  log('Fetching:', url);

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      ...options.headers,
    },
  });

  log('Response status:', response.status);
  return response;
}

export async function GET() {
  try {
    log('GET /api/admin/projects');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Server misconfigured: Missing Supabase environment variables' },
        { status: 500 }
      );
    }

    const response = await supabaseFetch('/rest/v1/projects?select=*&order=created_at.desc');

    if (!response.ok) {
      const error = await response.text();
      log('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    log('Found projects:', data.length);
    return NextResponse.json(data || []);
  } catch (error: any) {
    log('Error fetching projects:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const project = await request.json();
    log('POST /api/admin/projects - Creating:', project.title);

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Server misconfigured: Missing Supabase environment variables' },
        { status: 500 }
      );
    }

    const images: ProjectImages = {
      thumbnail: project.thumbnail || null,
      hero: project.hero || null,
      gallery: project.gallery || [],
      alt: project.alt || project.title || '',
    };

    const insertData = {
      id: project.id || `proj-${Date.now()}`,
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

    log('Insert data:', JSON.stringify(insertData));

    const response = await supabaseFetch('/rest/v1/projects', {
      method: 'POST',
      body: JSON.stringify(insertData),
    });

    if (!response.ok) {
      const error = await response.text();
      log('Supabase POST error:', error);
      return NextResponse.json(
        { success: false, error: error },
        { status: response.status }
      );
    }

    log('Project created successfully');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    log('Error creating project:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const project = await request.json();

    if (!project.id) {
      return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });
    }

    log('PUT /api/admin/projects - Updating:', project.id);

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
      log('Supabase PUT error:', error);
      return NextResponse.json({ success: false, error: error }, { status: response.status });
    }

    log('Project updated successfully');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    log('Error updating project:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });
    }

    log('DELETE /api/admin/projects - Deleting:', id);

    const response = await supabaseFetch(
      `/rest/v1/projects?id=eq.${id}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const error = await response.text();
      log('Supabase DELETE error:', error);
      return NextResponse.json({ success: false, error: error }, { status: response.status });
    }

    log('Project deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    log('Error deleting project:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
