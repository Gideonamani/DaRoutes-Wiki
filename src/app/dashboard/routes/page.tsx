import type { Metadata } from "next";
import Link from 'next/link';
import { Suspense } from 'react';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { Badge } from '@/components/Badge';

const STATUS_LABELS: Record<'draft' | 'in_review' | 'published', string> = {
  draft: 'Draft',
  in_review: 'In review',
  published: 'Published'
};

const STATUS_BADGE_CLASSES: Record<'draft' | 'in_review' | 'published', string> = {
  draft: 'bg-slate-200 text-slate-600',
  in_review: 'bg-amber-100 text-amber-700',
  published: 'bg-emerald-100 text-emerald-700'
};

interface RoutesPageProps {
  searchParams?: { q?: string };
}

const description = 'Search, filter, and edit route records before publishing.';

export const metadata: Metadata = {
  title: 'Routes · DaRoutes Wiki',
  description,
  openGraph: {
    title: 'Routes · DaRoutes Wiki',
    description,
    url: '/dashboard/routes',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Manage DaRoutes route library'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Routes · DaRoutes Wiki',
    description,
    images: ['/opengraph-image']
  }
};

async function RoutesTable({ query }: { query?: string }) {
  const supabase = getSupabaseServerClient();

  let request = supabase
    .from('routes')
    .select('id, display_name, slug, color, status, updated_at, corridors')
    .order('updated_at', { ascending: false });

  if (query) {
    request = request.ilike('display_name', `%${query}%`);
  }

  const { data: routes } = await request;

  return (
    <div className="mt-6 space-y-3">
      {routes?.map((route) => (
        <Link
          key={route.id}
          href={`/dashboard/routes/${route.id}`}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-brand"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">{route.display_name}</p>
            <p className="text-xs text-slate-500">Slug: {route.slug}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {route.corridors?.map((corridor: string) => (
                <Badge key={corridor}>{corridor}</Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="h-8 w-8 rounded-full border border-slate-200"
              style={{ backgroundColor: route.color }}
            />
            <Badge
              colorClassName={
                STATUS_BADGE_CLASSES[route.status as 'draft' | 'in_review' | 'published']
              }
            >
              {STATUS_LABELS[route.status as 'draft' | 'in_review' | 'published']}
            </Badge>
          </div>
        </Link>
      ))}
      {!routes?.length && (
        <p className="rounded border border-dashed border-slate-300 p-6 text-sm text-slate-500">
          No routes found. Create one to get started.
        </p>
      )}
    </div>
  );
}

export default function RoutesPage({ searchParams }: RoutesPageProps) {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Routes</h1>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <Link
          href="/dashboard/routes/new"
          className="rounded bg-brand-dark px-4 py-2 text-sm font-semibold text-white"
        >
          New route
        </Link>
      </header>

      <form className="flex items-center gap-2">
        <input
          type="search"
          name="q"
          defaultValue={searchParams?.q ?? ''}
          placeholder="Search routes"
          className="w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
        />
        <button
          type="submit"
          className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
        >
          Search
        </button>
      </form>

      <Suspense key={searchParams?.q ?? 'all'} fallback={<p>Loading routes.</p>}>
        <RoutesTable query={searchParams?.q} />
      </Suspense>
    </div>
  );
}

