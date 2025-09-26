import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/Card';

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
    <div className="space-y-8">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">DaRoutes explainer</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/dashboard/routes/new" className="rounded bg-brand-dark px-4 py-2 font-semibold text-white">
            Become an editor
          </Link>
          <Link href="/terminals" className="rounded border border-slate-200 px-4 py-2 font-semibold text-slate-700">
            Browse terminals
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {pillars.map((pillar) => (
          <Card key={pillar.title} className="space-y-3 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              {pillar.title}
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              {pillar.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Data exports
          </h2>
          <p className="text-sm text-slate-600">
            Every published route is available via JSON APIs. We also plan CSV and GTFS snapshots once the dataset is
            broader. Interested? <Link href="mailto:hello@daroutes.org" className="text-brand-dark underline">Email us</Link> to
            co-design the format.
          </p>
        </Card>
        <Card className="space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Community guidelines
          </h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Source everything - tickets, photos, field notes, or operator confirmations.</li>
            <li>Use neutral language and avoid speculation in published notes.</li>
            <li>Flag safety concerns or accessibility issues with context and evidence.</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
