import { connectDB } from '@/lib/db';
import { HiringPost } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const active = request.nextUrl.searchParams.get('active');

    let query: any = {};
    if (active === 'true') {
      query.isActive = true;
    }

    const posts = await HiringPost.find(query).sort({ createdAt: -1 });
    const total = await HiringPost.countDocuments(query);

    return NextResponse.json({ data: posts, total });
  } catch (error) {
    console.error('Error fetching hiring posts:', error);
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

    const post = new HiringPost(body);
    await post.save();

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating hiring post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
