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

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-brand-dark">
          DaRoutes
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <Link href="/route/kivukoni-to-udsm" className="hover:text-slate-900">
            Sample Route
          </Link>
          <Link href="/dashboard" className="hover:text-slate-900">
            Dashboard
          </Link>
          {session ? (
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Sign out ({profile?.role ?? 'editor'})
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
        </nav>
      </div>
    </header>
  );
}
