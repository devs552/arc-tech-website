import { connectDB } from '@/lib/db';
import { Portfolio } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const limit = request.nextUrl.searchParams.get('limit');

    const items = limit
      ? await Portfolio.find({}).limit(parseInt(limit as string))
      : await Portfolio.find({});

    const total = await Portfolio.countDocuments();

    return NextResponse.json({ data: items, total });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
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

    const item = new Portfolio(body);
    await item.save();

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
