import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'contacts-data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const contacts = JSON.parse(fileContent);

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error reading contacts:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contacts = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'contacts-data.json');
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving contacts:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
