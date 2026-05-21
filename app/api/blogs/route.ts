import { connectDB } from '@/lib/db';
import { Blog } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { slugify } from '@/lib/utils/helpers';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const limit = request.nextUrl.searchParams.get('limit');
    const published = request.nextUrl.searchParams.get('published');

    let query: any = {};
    if (published === 'true') {
      query.isPublished = true;
    }

    const blogs = limit
      ? await Blog.find(query).limit(parseInt(limit as string))
      : await Blog.find(query).sort({ createdAt: -1 });

    const total = await Blog.countDocuments(query);

    return NextResponse.json({ data: blogs, total });
  } catch (error) {
    console.error('Error fetching blogs:', error);
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

    body.slug = slugify(body.title);
    body.author = (session.user as any).name;

    const blog = new Blog(body);
    await blog.save();

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
