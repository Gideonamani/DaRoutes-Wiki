import type { Metadata } from "next";
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { Card } from '@/components/Card';

const description = 'Track route content, manage stops, and keep the wiki fresh.';

export const metadata: Metadata = {
  title: 'Dashboard · DaRoutes Wiki',
  description,
  openGraph: {
    title: 'Dashboard · DaRoutes Wiki',
    description,
    url: '/dashboard',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'DaRoutes dashboard overview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard · DaRoutes Wiki',
    description,
    images: ['/opengraph-image']
  }
};

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient();

  const [{ count: routeCount }, { count: publishedCount }, { count: stopCount }] = await Promise.all([
    supabase.from('routes').select('id', { count: 'exact', head: true }),
    supabase.from('routes').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('stops').select('id', { count: 'exact', head: true })
  ]);

  return (
    <div className="space-y-6">
      <header className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">{description}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-slate-500">Total routes</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{routeCount ?? 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Published</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{publishedCount ?? 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Stops</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stopCount ?? 0}</p>
        </Card>
      </div>
    </div>
  );
}
