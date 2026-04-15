import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read from data folder
    const filePath = path.join(process.cwd(), 'data', 'projects-data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const projects = JSON.parse(fileContent);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const projects = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'projects-data.json');
    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving projects:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
