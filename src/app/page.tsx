import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';
import { WORKFLOW_STATUS_LABELS, type WorkflowStatus } from '@/lib/workflowStatus';

type RouteSummaryRecord = Tables<'routes'> & {
  start_stop?: { name?: string | null } | null;
  end_stop?: { name?: string | null } | null;
};

const description = 'Discover Dar es Salaam bus and BRT routes curated by local operators and volunteers.';

const STATUS_BADGE_CLASSES: Record<WorkflowStatus, string> = {
  draft: 'bg-slate-200 text-slate-600',
  in_review: 'bg-amber-100 text-amber-700',
  published: 'bg-emerald-100 text-emerald-700'
};

export const metadata: Metadata = {
  title: 'DaRoutes Wiki',
  description,
  openGraph: {
    title: 'DaRoutes Wiki',
    description,
    url: '/',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'DaRoutes Wiki logo and tagline'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DaRoutes Wiki',
    description,
    images: ['/opengraph-image']
  }
};

function formatUpdated(value: string | null) {
  if (!value) return 'Pending review';
  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

export default async function HomePage() {
  const supabase = getSupabaseServerClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  const { data: publishedData } = await supabase
    .from('routes')
    .select(
      `
      id,
      slug,
      display_name,
      color,
      corridors,
      est_buses,
      hours,
      status,
      updated_at,
      start_stop:stops!routes_start_stop_id_fkey (name),
      end_stop:stops!routes_end_stop_id_fkey (name)
    `
    )
    .eq('status', 'published')
    .order('display_name');

  const publishedRoutes = (publishedData ?? []) as unknown as RouteSummaryRecord[];

  let inProgressRoutes: RouteSummaryRecord[] = [];
  if (session) {
    const { data: draftData } = await supabase
      .from('routes')
      .select(
        `
        id,
        slug,
        display_name,
        color,
        corridors,
        est_buses,
        hours,
        status,
        updated_at
      `
      )
      .neq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(12);

    inProgressRoutes = (draftData ?? []) as unknown as RouteSummaryRecord[];
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">DaRoutes Wiki</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Published routes</h2>
          <Link href={{ pathname: '/dashboard/routes' }} className="text-sm font-semibold text-brand-dark">
            Manage routes
          </Link>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {publishedRoutes.map((route) => (
            <Card key={route.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={{ pathname: '/route/[slug]', query: { slug: route.slug } }}
                    className="text-lg font-semibold text-slate-900"
                  >
                    {route.display_name}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {route.start_stop?.name ?? 'TBD'} - {route.end_stop?.name ?? 'TBD'}
                  </p>
                </div>
                <span
                  className="h-8 w-8 rounded-full border border-slate-200"
                  style={{ backgroundColor: route.color }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(route.corridors ?? []).map((corridor: string) => (
                  <Badge key={corridor}>{corridor}</Badge>
                ))}
                {route.est_buses && (
                  <Badge colorClassName="bg-emerald-100 text-emerald-800">
                    {route.est_buses} buses
                  </Badge>
                )}
                {route.hours && <Badge colorClassName="bg-slate-200 text-slate-700">{route.hours}</Badge>}
              </div>
            </Card>
          ))}
          {!publishedRoutes.length && (
            <Card className="p-6 text-sm text-slate-500">
              No routes published yet. Head to the dashboard to create one.
            </Card>
          )}
        </div>
      </section>

      {session && inProgressRoutes.length > 0 && (
        <section className="space-y-4">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Routes in progress</h2>
            <Link href={{ pathname: '/dashboard/routes' }} className="text-sm font-semibold text-brand-dark">
              Open dashboard
            </Link>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {inProgressRoutes.map((route) => (
              <Card key={route.id} className="flex flex-col justify-between p-4">
                <div>
                  <Link
                    href={{ pathname: '/dashboard/routes/[id]', query: { id: route.id } }}
                    className="text-lg font-semibold text-slate-900"
                  >
                    {route.display_name}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">Updated {formatUpdated(route.updated_at ?? null)}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge colorClassName={STATUS_BADGE_CLASSES[route.status as WorkflowStatus]}>
                    {WORKFLOW_STATUS_LABELS[route.status as WorkflowStatus]}
                  </Badge>
                  {(route.corridors ?? []).map((corridor: string) => (
                    <Badge key={corridor}>{corridor}</Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-slate-900">Terminals directory</h2>
          <p className="mt-2 text-sm text-slate-600">See where routes begin and end, plus amenities for riders.</p>
          <Link
            href={{ pathname: '/terminals' }}
            className="mt-4 inline-flex items-center text-sm font-semibold text-brand-dark hover:underline"
          >
            Browse terminals
          </Link>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-slate-900">Get involved</h2>
          <p className="mt-2 text-sm text-slate-600">Learn how DaRoutes works and how to contribute reliable data.</p>
          <Link
            href={{ pathname: '/explainer' }}
            className="mt-4 inline-flex items-center text-sm font-semibold text-brand-dark hover:underline"
          >
            Read the explainer
          </Link>
        </Card>
      </section>
    </div>
  );
}
