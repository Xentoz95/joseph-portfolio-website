import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'posts-data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const posts = JSON.parse(fileContent);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error reading posts:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const posts = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'posts-data.json');
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving posts:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
