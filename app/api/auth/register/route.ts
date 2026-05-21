import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';

const VALID_ROLES = ['admin', 'editor', 'viewer', 'user'] as const;
type Role = (typeof VALID_ROLES)[number];

function isValidRole(role: unknown): role is Role {
  return typeof role === 'string' && VALID_ROLES.includes(role as Role);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email    = typeof body.email    === 'string' ? body.email.trim().toLowerCase() : '';
    const name     = typeof body.name     === 'string' ? body.name.trim()                : '';
    const password = typeof body.password === 'string' ? body.password                  : '';
    const role: Role = isValidRole(body.role) ? body.role : 'user';

    // ── Validation ────────────────────────────────────────────
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, and name are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // ── Database ──────────────────────────────────────────────
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const newUser = await User.create({ email, password, name, role });

    return NextResponse.json(
      {
        message: 'User created successfully.',
        user: {
          id:    newUser._id,
          email: newUser.email,
          name:  newUser.name,
          role:  newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Mongoose duplicate-key (race condition between findOne and create)
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: unknown }).code === 11000
    ) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}