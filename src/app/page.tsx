import { redirect } from 'next/navigation';

// Root page just redirects to /my
// OAuth callback is handled by route.ts (Route Handler) instead
export default async function HomePage() {
  redirect('/my');
}
