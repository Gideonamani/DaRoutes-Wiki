import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';

type StopRecord = Tables<'stops'> & {
  route_links?: {
    seq: number;
    route?: Pick<Tables<'routes'>, 'id' | 'slug' | 'display_name' | 'status' | 'color'> | null;
  }[] | null;
};

interface StopPageProps {
  params: { slug: string };
}

const STATUS_LABELS: Record<'draft' | 'in_review' | 'published', string> = {
  draft: 'Draft',
  in_review: 'In review',
  published: 'Published'
};

export async function generateMetadata({ params }: StopPageProps): Promise<Metadata> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from('stops')
    .select('name, ward, status')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!data) {
    return {
      title: 'Stop not found - DaRoutes Wiki',
      description: 'The requested stop could not be located.'
    } satisfies Metadata;
  }

  const stop = data as Pick<StopRecord, 'name' | 'ward' | 'status'>;
  const title = ${stop.name} stop - DaRoutes Wiki;
  const description = stop.ward
    ? Routes and details for  in .
    : Routes and details for .;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: /stops/,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  } satisfies Metadata;
}

export default async function StopPage({ params }: StopPageProps) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('stops')
    .select(
      
      id,
      slug,
      name,
      ward,
      status,
      name_aliases,
      lat,
      lng,
      created_at,
      updated_at,
      route_links:route_stops (seq, route:routes (id, slug, display_name, status, color))
    
    )
    .eq('slug', params.slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();

  const stop = data as StopRecord;
  const isPublished = stop.status === 'published';
  const aliases = stop.name_aliases ?? [];
  const linkedRoutes = (stop.route_links ?? []).filter(
    (link) => link?.route && link.route.status === 'published'
  );
  const formatter = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="space-y-8">
      <Card className="space-y-4 p-6">
        {!isPublished && (
          <p className="rounded-md bg-amber-100 px-3 py-2 text-xs font-semibold uppercase text-amber-700">
            {STATUS_LABELS[stop.status]} stop - visible to contributors only
          </p>
        )}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{stop.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{stop.ward ?? 'Ward pending'}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Updated</span>
            <time dateTime={stop.updated_at}>{formatter.format(new Date(stop.updated_at))}</time>
          </div>
        </div>
        {aliases.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {aliases.map((alias) => (
              <Badge key={alias}>{alias}</Badge>
            ))}
          </div>
        )}
      </Card>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Coordinates
          </h2>
          {stop.lat && stop.lng ? (
            <div className="space-y-1 text-sm text-slate-700">
              <p>
                Latitude: <span className="font-semibold">{stop.lat.toFixed(6)}</span>
              </p>
              <p>
                Longitude: <span className="font-semibold">{stop.lng.toFixed(6)}</span>
              </p>
              <p className="text-xs text-slate-500">Share with operators or add to GTFS as needed.</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Coordinate details pending verification.</p>
          )}
        </Card>

        <Card className="space-y-3 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Published routes
          </h2>
          <ul className="space-y-2 text-sm">
            {linkedRoutes.map((link) => (
              <li key={${link.route?.id}-} className="flex items-center gap-3">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: link.route?.color ?? '#1e293b' }}
                />
                <Link href={/route/} className="text-brand-dark hover:underline">
                  {link.route?.display_name}
                </Link>
                <span className="text-xs text-slate-500">Stop #{link.seq}</span>
              </li>
            ))}
            {!linkedRoutes.length && (
              <li className="text-xs text-slate-500">No published routes linked yet.</li>
            )}
          </ul>
        </Card>
      </section>
    </div>
  );
}
