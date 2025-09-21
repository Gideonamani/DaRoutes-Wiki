'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

const Schema = z.object({
  email: z.string().email()
});

type FormValues = z.infer<typeof Schema>;

export default function LoginPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(Schema)
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setMessage(null);
    const redirectTo =
      `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/callback?next=/dashboard`;
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: redirectTo
      }
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Magic link sent! Check your inbox.');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:
          `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/callback?next=/dashboard`
      }
    });
    if (error) {
      setMessage(error.message);
    }
  };

  if (supabase.auth.getSession) {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard');
    });
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-lg font-semibold text-slate-900">Sign in</h1>
      <p className="mt-1 text-sm text-slate-500">
        Use a magic link or Google OAuth to access the dashboard.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Email
          <input
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
            placeholder="you@example.com"
          />
          {formState.errors.email && (
            <span className="mt-1 block text-xs text-red-600">
              {formState.errors.email.message}
            </span>
          )}
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-brand-dark px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? 'Sending link…' : 'Send magic link'}
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full rounded border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
        >
          Continue with Google
        </button>
      </div>

      {message && <p className="mt-3 text-sm text-emerald-600">{message}</p>}
    </div>
  );
}
