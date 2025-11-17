import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Home page just redirects to organize
  redirect('/organize');
}
