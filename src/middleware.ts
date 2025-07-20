// FILE: src/middleware.ts
// Middleware disabled - all routes are public for now
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pass through all requests without any restrictions
  return NextResponse.next();
}

// Export as default as well for compatibility
export default middleware;

export const config = {
  matcher: []
};
