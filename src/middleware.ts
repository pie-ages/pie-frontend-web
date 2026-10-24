import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/pending'];
const ADMIN_PATHS = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (!request.cookies.get('pie_session')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (request.cookies.get('pie_role')?.value !== 'ADMIN') {
      return NextResponse.redirect(new URL('/products', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|pie.svg).*)'],
};
