import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const identifier = pathname.split('/')[2];

  if (!identifier) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/product-seo/${identifier}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/product/:path*'],
};
