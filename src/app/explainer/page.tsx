import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, MapPin, Database, Shield } from 'lucide-react';
import { Card } from '@/components/Card';
import { PALETTE } from '@/lib/designTokens';

const description = 'Why DaRoutes exists, what data we publish, and how you can contribute to Dar es Salaam transport knowledge.';

export const metadata: Metadata = {
  title: 'DaRoutes Explainer - DaRoutes Wiki',
  description,
  openGraph: {
    title: 'DaRoutes Explainer - DaRoutes Wiki',
    description,
    url: '/explainer',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DaRoutes Explainer - DaRoutes Wiki',
    description
  }
};

const pillars = [
  {
    title: 'What we document',
    items: [
      'Daladala, BRT, and feeder routes with official and community knowledge',
      'Stops, terminals, fares, and operator notes',
      'Historical context and service changes when available'
    ]
  },
  {
    title: 'Why it matters',
    items: [
      'Give commuters dependable trip planning information',
      'Support planners and researchers with open data',
      'Highlight service gaps and celebrate community initiatives'
    ]
  },
  {
    title: 'How editing works',
    items: [
      'Editors draft routes, link stops, and upload ticket references',
      'Drafts move to in-review status for moderators to double-check',
      'Publish once data is verified - nothing goes live without a second set of eyes'
    ]
  }
];

export default function ExplainerPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: PALETTE.bg }}>
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: PALETTE.primary }}>
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        {/* Hero */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold" style={{ color: PALETTE.text }}>
            DaRoutes Explainer
          </h1>
          <p className="mt-2 text-sm" style={{ color: PALETTE.textMuted }}>
            {description}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              href="/dashboard/routes/new"
              className="rounded px-4 py-2 font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: PALETTE.primary }}
            >
              Become an editor
            </Link>
            <Link
              href="/terminals"
              className="rounded border px-4 py-2 font-semibold hover:bg-gray-50 transition-colors"
              style={{ color: PALETTE.text, borderColor: PALETTE.textMuted }}
            >
              Browse terminals
            </Link>
          </div>
        </section>

        {/* Pillars */}
        <section className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="space-y-3 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: PALETTE.textMuted }}>
                {pillar.title}
              </h2>
              <ul className="space-y-2 text-sm" style={{ color: PALETTE.textMuted }}>
                {pillar.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: PALETTE.primary }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-xl font-semibold mb-4" style={{ color: PALETTE.text }}>
            How It Works
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${PALETTE.primary}20` }}>
                  <MapPin size={20} style={{ color: PALETTE.primary }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: PALETTE.text }}>
                    Discover Routes
                  </h3>
                  <p className="text-sm" style={{ color: PALETTE.textMuted }}>
                    Browse published routes, stops, and terminals. View maps, fares, and operating hours.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${PALETTE.primary}20` }}>
                  <Users size={20} style={{ color: PALETTE.primary }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: PALETTE.text }}>
                    Contribute Data
                  </h3>
                  <p className="text-sm" style={{ color: PALETTE.textMuted }}>
                    Log in to add new routes, update stop information, or upload route paths (KML/CSV).
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${PALETTE.primary}20` }}>
                  <Database size={20} style={{ color: PALETTE.primary }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: PALETTE.text }}>
                    Open Data
                  </h3>
                  <p className="text-sm" style={{ color: PALETTE.textMuted }}>
                    All data is publicly accessible via JSON API endpoints for apps and research.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${PALETTE.primary}20` }}>
                  <Shield size={20} style={{ color: PALETTE.primary }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: PALETTE.text }}>
                    Quality Control
                  </h3>
                  <p className="text-sm" style={{ color: PALETTE.textMuted }}>
                    Editors and admins review submissions to ensure accuracy and transparency.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Additional Info */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-3 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: PALETTE.textMuted }}>
              Data exports
            </h2>
            <p className="text-sm" style={{ color: PALETTE.textMuted }}>
              Every published route is available via JSON APIs. We also plan CSV and GTFS snapshots once the dataset is
              broader. Interested? <Link href="mailto:hello@daroutes.org" className="underline" style={{ color: PALETTE.primary }}>Email us</Link> to
              co-design the format.
            </p>
          </Card>
          <Card className="space-y-3 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: PALETTE.textMuted }}>
              Community guidelines
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: PALETTE.textMuted }}>
              <li>Source everything - tickets, photos, field notes, or operator confirmations.</li>
              <li>Use neutral language and avoid speculation in published notes.</li>
              <li>Flag safety concerns or accessibility issues with context and evidence.</li>
            </ul>
          </Card>
        </section>
      </main>
    </div>
  );
}
