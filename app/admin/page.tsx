import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to dashboard
  redirect('/admin/dashboard');
  
  // This won't be rendered, but Next.js expects a component to be returned
  return null;
} 