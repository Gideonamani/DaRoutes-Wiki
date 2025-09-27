import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';

type StopRecord = Pick<
  Tables<'stops'>,
  'id' | 'slug' | 'name' | 'ward' | 'status' | 'name_aliases' | 'lat' | 'lng' | 'updated_at'
> & {
  route_links?: {
    seq: number;
    route?: Pick<Tables<'routes'>, 'id' | 'slug' | 'display_name' | 'status' | 'color'> | null;
  }[] | null;
};

const description = 'Browse documented bus stops and see which published routes serve each location.';

export const metadata: Metadata = {
  title: 'Stops - DaRoutes Wiki',
  description,
  openGraph: {
    title: 'Stops - DaRoutes Wiki',
    description,
    url: '/stops',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stops - DaRoutes Wiki',
    description
  }
};

export default async function StopsPage() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('stops')
    .select(
      `
      id,
      slug,
      name,
      ward,
      status,
      name_aliases,
      lat,
      lng,
      updated_at,
      route_links:route_stops (seq, route:routes (id, slug, display_name, status, color))
    `
    )
    .eq('status', 'published')
    .order('name');

  if (error) throw error;

  const stops = (data ?? []) as unknown as StopRecord[];

  return (
    <div className="space-y-8">
      <header className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Stops</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {stops.map((stop) => {
          const aliases = stop.name_aliases ?? [];
          const linkedRoutes = (stop.route_links ?? []).filter(
            (link) => link?.route && link.route.status === 'published'
          );

          return (
            <Card key={stop.id} className="flex h-full flex-col justify-between p-5">
              <div>
                <Link
                  href={{ pathname: '/stops/[slug]', query: { slug: stop.slug } }}
                  className="text-lg font-semibold text-slate-900"
                >
                  {stop.name}
                </Link>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                  {stop.ward ?? 'Ward pending'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {aliases.slice(0, 3).map((alias) => (
                    <Badge key={alias} colorClassName="bg-slate-200 text-slate-600">
                      {alias}
                    </Badge>
                  ))}
                  {aliases.length > 3 && (
                    <Badge colorClassName="bg-slate-100 text-slate-600">
                      +{aliases.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                  <span>Routes</span>
                  <Badge colorClassName="bg-slate-200 text-slate-700">
                    {linkedRoutes.length}
                  </Badge>
                </div>
                <ul className="space-y-1 text-sm">
                  {linkedRoutes.slice(0, 4).map((link) => {
                    const route = link.route;
                    if (!route) return null;
                    return (
                      <li key={route.id} className="flex items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: route.color ?? '#1e293b' }}
                        />
                        <Link
                          href={{ pathname: '/route/[slug]', query: { slug: route.slug } }}
                          className="text-brand-dark hover:underline"
                        >
                          {route.display_name}
                        </Link>
                        <span className="text-xs text-slate-400">Stop #{link.seq}</span>
                      </li>
                    );
                  })}
                  {linkedRoutes.length > 4 && (
                    <li className="text-xs text-slate-500">+{linkedRoutes.length - 4} more routes</li>
                  )}
                  {!linkedRoutes.length && <li className="text-xs text-slate-500">No published routes linked.</li>}
                </ul>
                {stop.lat && stop.lng && (
                  <p className="text-xs text-slate-500">
                    {stop.lat.toFixed(5)}, {stop.lng.toFixed(5)}
                  </p>
                )}
              </div>
            </Card>
          );
        })}
        {!stops.length && (
          <Card className="p-6 text-sm text-slate-500">
            No stops published yet. Contributors can document stops from the dashboard.
          </Card>
        )}
      </section>
    </div>
  );
}
