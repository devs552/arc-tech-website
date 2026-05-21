import { connectDB } from '@/lib/db';
import { ContactSubmission } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const submissions = await ContactSubmission.find({}).sort({ createdAt: -1 });
    const total = await ContactSubmission.countDocuments();

    return NextResponse.json({ data: submissions, total });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const submission = new ContactSubmission(body);
    await submission.save();

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Error creating contact submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
