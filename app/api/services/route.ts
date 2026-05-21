import { connectDB } from '@/lib/db';
import { Service } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const limit = request.nextUrl.searchParams.get('limit');
    const query = limit ? {} : {};
    
    const services = limit
      ? await Service.find(query).limit(parseInt(limit as string))
      : await Service.find(query);

    const total = await Service.countDocuments();

    return NextResponse.json({ data: services, total });
  } catch (error) {
    console.error('Error fetching services:', error);
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

    const service = new Service(body);
    await service.save();

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
