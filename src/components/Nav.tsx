import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient, getSupabaseServerActionClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';

async function signOut() {
  'use server';
  const supabase = getSupabaseServerActionClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export default async function Nav() {
  const supabase = getSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  let profile: Tables<'profile'> | null = null;
  if (session?.user?.id) {
    const { data } = await supabase
      .from('profile')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();
    profile = data ?? null;
  }

  const roleLabel = profile?.role ?? 'viewer';
  const primaryLinks = [
    { href: '/', label: 'Routes' },
    { href: '/terminals', label: 'Terminals' },
    { href: '/stops', label: 'Stops' },
    { href: '/explainer', label: 'Explainer' }
  ];
  const contributorLinks = session
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/profile', label: 'Profile' }
      ]
    : [];

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-brand-dark">
          DaRoutes
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-end gap-4 text-sm font-medium text-slate-600">
          <div className="flex flex-wrap items-center gap-4">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-slate-900">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {contributorLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-slate-900">
                {link.label}
              </Link>
            ))}
            {session ? (
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Sign out ({roleLabel})
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-brand-dark px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
