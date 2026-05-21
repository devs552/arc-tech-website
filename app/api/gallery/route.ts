import { connectDB } from '@/lib/db';
import { Gallery } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const limit = request.nextUrl.searchParams.get('limit');

    const images = limit
      ? await Gallery.find({}).limit(parseInt(limit as string))
      : await Gallery.find({});

    const total = await Gallery.countDocuments();

    return NextResponse.json({ data: images, total });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const image = new Gallery(body);
    await image.save();

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
