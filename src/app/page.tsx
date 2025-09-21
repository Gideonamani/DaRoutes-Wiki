import Link from 'next/link';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export default async function HomePage() {
  const supabase = getSupabaseServerClient();
  const { data: routes } = await supabase
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
      start_stop:stops!routes_start_stop_id_fkey (name),
      end_stop:stops!routes_end_stop_id_fkey (name)
    `
    )
    .eq('is_published', true)
    .order('display_name');

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Daroutes Wiki</h1>
        <p className="mt-2 text-sm text-slate-600">
          Discover Dar es Salaam bus and BRT routes curated by local operators and volunteers.
        </p>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Published routes</h2>
          <Link href="/dashboard/routes" className="text-sm font-semibold text-brand-dark">
            Manage routes
          </Link>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {(routes ?? []).map((route) => (
            <Card key={route.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/route/${route.slug}`} className="text-lg font-semibold text-slate-900">
                    {route.display_name}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {route.start_stop?.name ?? 'TBD'} – {route.end_stop?.name ?? 'TBD'}
                  </p>
                </div>
                <span
                  className="h-8 w-8 rounded-full border border-slate-200"
                  style={{ backgroundColor: route.color }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {route.corridors?.map((corridor: string) => (
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
          {!routes?.length && (
            <Card className="p-6 text-sm text-slate-500">
              No routes published yet. Head to the dashboard to create one.
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
