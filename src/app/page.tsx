import type { Metadata } from 'next';
import Link from 'next/link';
import { Bus, Clock, CreditCard } from 'lucide-react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { MapPreview } from '@/components/MapPreview';
import { HomepageClient } from '@/components/HomepageClient';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';
import { PALETTE } from '@/lib/designTokens';

type RouteSummaryRecord = Tables<'routes'> & {
  start_stop?: { name?: string | null } | null;
  end_stop?: { name?: string | null } | null;
};

const description = 'Discover Dar es Salaam bus and BRT routes curated by local operators and volunteers.';

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

  return (
    <HomepageClient>
      {/* Hero Section */}
      <section className="rounded-lg bg-white p-6 shadow-sm mx-4 md:mx-6">
        <h1 className="text-2xl font-semibold" style={{ color: PALETTE.text }}>
          DaRoutes Wiki
        </h1>
        <p className="mt-2 text-sm" style={{ color: PALETTE.textMuted }}>
          {description}
        </p>
      </section>

      {/* Published Routes Grid */}
      <section className="px-4 md:px-6 mt-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: PALETTE.text }}>
            Published routes
          </h2>
          {session && (
            <Link
              href="/dashboard/routes"
              className="text-sm font-semibold hover:underline"
              style={{ color: PALETTE.primary }}
            >
              Manage routes
            </Link>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedRoutes.map((route) => (
            <Card
              key={route.id}
              className="hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            >
              <Link href={`/route/${route.slug}`}>
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <h2 className="font-semibold text-lg" style={{ color: PALETTE.text }}>
                      {route.display_name}
                    </h2>
                    <p className="text-sm" style={{ color: PALETTE.textMuted }}>
                      {route.start_stop?.name ?? 'TBD'} - {route.end_stop?.name ?? 'TBD'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="h-4 w-4 rounded-sm"
                      style={{ backgroundColor: route.color }}
                    />
                    <div
                      className="h-4 w-4 rounded-sm"
                      style={{ backgroundColor: PALETTE.success }}
                    />
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {/* Map Preview */}
                  <div className="overflow-hidden rounded-md">
                    <MapPreview color={route.color} secondary={PALETTE.success} />
                  </div>
                  {/* Route metadata */}
                  <div className="flex justify-between text-sm mt-2" style={{ color: PALETTE.textMuted }}>
                    <span className="flex items-center gap-1">
                      <Bus size={14} /> Route
                    </span>
                    {route.hours && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {route.hours}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <CreditCard size={14} /> TZS
                    </span>
                  </div>
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(route.corridors ?? []).map((corridor: string) => (
                      <Badge key={corridor}>{corridor}</Badge>
                    ))}
                    {route.est_buses && (
                      <Badge colorClassName="bg-emerald-100 text-emerald-800">
                        {route.est_buses} buses
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            </Card>
          ))}
          {!publishedRoutes.length && (
            <Card className="p-6 text-sm text-slate-500 col-span-full">
              No routes published yet. Head to the dashboard to create one.
            </Card>
          )}
        </div>
      </section>

      {/* Info Cards */}
      <section className="grid gap-4 md:grid-cols-2 px-4 md:px-6 mt-8">
        <Card className="p-5">
          <h2 className="text-lg font-semibold" style={{ color: PALETTE.text }}>
            Terminals directory
          </h2>
          <p className="mt-2 text-sm" style={{ color: PALETTE.textMuted }}>
            See where routes begin and end, plus amenities for riders.
          </p>
          <Link
            href="/terminals"
            className="mt-4 inline-flex items-center text-sm font-semibold hover:underline"
            style={{ color: PALETTE.primary }}
          >
            Browse terminals
          </Link>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-semibold" style={{ color: PALETTE.text }}>
            Get involved
          </h2>
          <p className="mt-2 text-sm" style={{ color: PALETTE.textMuted }}>
            Learn how DaRoutes works and how to contribute reliable data.
          </p>
          <Link
            href="/explainer"
            className="mt-4 inline-flex items-center text-sm font-semibold hover:underline"
            style={{ color: PALETTE.primary }}
          >
            Read the explainer
          </Link>
        </Card>
      </section>
    </HomepageClient>
  );
}
