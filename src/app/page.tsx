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
    <HomepageClient routes={publishedRoutes}>
      {/* Hero Section */}
      <section className="rounded-lg bg-white p-6 shadow-sm mx-4 md:mx-6">
        <h1 className="text-2xl font-semibold" style={{ color: PALETTE.text }}>
          DaRoutes Wiki
        </h1>
        <p className="mt-2 text-sm" style={{ color: PALETTE.textMuted }}>
          {description}
        </p>
      </section>

      {/* Manage Link (if logged in) */}
      {session && (
        <div className="px-4 md:px-6 mt-4 flex justify-end">
          <Link
            href="/dashboard/routes"
            className="text-sm font-semibold hover:underline"
            style={{ color: PALETTE.primary }}
          >
            Manage routes
          </Link>
        </div>
      )}

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
