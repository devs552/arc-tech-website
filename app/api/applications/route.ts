import { connectDB } from '@/lib/db';
import { JobApplication } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const limit = request.nextUrl.searchParams.get('limit');

    const applications = limit
      ? await JobApplication.find({}).limit(parseInt(limit as string)).sort({ createdAt: -1 })
      : await JobApplication.find({}).sort({ createdAt: -1 });

    const total = await JobApplication.countDocuments();

    return NextResponse.json({ data: applications, total });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const application = new JobApplication(body);
    await application.save();

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
