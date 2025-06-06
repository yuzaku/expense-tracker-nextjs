import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

console.log("Middleware running");

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
