import { connectDB } from '@/lib/db';
import { TeamMember } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const limit = request.nextUrl.searchParams.get('limit');

    const members = limit
      ? await TeamMember.find({}).limit(parseInt(limit as string))
      : await TeamMember.find({});

    const total = await TeamMember.countDocuments();

    return NextResponse.json({ data: members, total });
  } catch (error) {
    console.error('Error fetching team:', error);
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

    const member = new TeamMember(body);
    await member.save();

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
