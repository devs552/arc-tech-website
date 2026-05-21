import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get token from NextAuth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtectedRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/user');

  // Redirect if not authenticated
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(
      new URL('/auth/signin', request.url)
    );
  }

  // Redirect authenticated users away from auth pages
  if (
    token &&
    (pathname === '/auth/signin' ||
      pathname === '/auth/signup')
  ) {
    return NextResponse.redirect(
      new URL('/dashboard', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};