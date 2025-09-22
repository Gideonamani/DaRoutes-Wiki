import type { Metadata } from "next";
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/Badge';
import { MapEditor } from '@/components/MapEditor';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';

type RouteRecord = Tables<'routes'>;
type RouteStopRecord = Tables<'route_stops'> & { stop?: Tables<'stops'> | null };
type FareRecord = Tables<'fares'>;
type AttachmentRecord = Tables<'attachments'>;
type OperatorRecord = Tables<'operators'>;

interface RoutePageProps {
  params: { slug: string };
}

const FALLBACK_DESCRIPTION = 'Explore Dar es Salaam bus and BRT journeys with detailed stops, fares, and operator insights.';

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const supabase = getSupabaseServerClient();

  const { data: routeData } = await supabase
    .from('routes')
    .select('display_name, corridors, est_buses, hours, notes')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!routeData) {
    return {
      title: 'Route not found · DaRoutes Wiki',
      description: 'The requested published route could not be located.',
      openGraph: {
        title: 'Route not found · DaRoutes Wiki',
        description: 'The requested published route could not be located.',
        url: `/route/${params.slug}`,
        type: 'website',
        images: [
          {
            url: '/opengraph-image',
            width: 1200,
            height: 630,
            alt: 'DaRoutes route missing'
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Route not found · DaRoutes Wiki',
        description: 'The requested published route could not be located.',
        images: ['/opengraph-image']
      }
    } satisfies Metadata;
  }

  const route = routeData as RouteRecord;
  const title = `${route.display_name} · DaRoutes Wiki`;
  const corridorList = (route.corridors ?? []).join(', ');
  const description =
    route.notes?.slice(0, 180) ??
    (corridorList
      ? `Discover the ${route.display_name} service with corridors ${corridorList}.`
      : FALLBACK_DESCRIPTION);

  const imageUrl = `/route/${params.slug}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/route/${params.slug}`,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${route.display_name} route map preview`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    }
  } satisfies Metadata;
}

export default async function RoutePage({ params }: RoutePageProps) {
  const supabase = getSupabaseServerClient();

  const { data: routeData } = await supabase
    .from('routes')
    .select('id, slug, display_name, color, corridors, est_buses, hours, notes, operator_ids')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!routeData) {
    notFound();
  }

  const route = routeData as RouteRecord;

  const { data: routeStops } = await supabase
    .from('route_stops')
    .select('seq, stop:stops (id, name, lat, lng, ward)')
    .eq('route_id', route.id)
    .order('seq');

  const routeStopsData = (routeStops ?? []) as unknown as RouteStopRecord[];
  const stops = routeStopsData.map((entry) => ({
    local_id: `${entry.stop?.id}-${entry.seq}`,
    stop_id: entry.stop?.id ?? undefined,
    name: entry.stop?.name ?? '',
    lat: entry.stop?.lat ?? 0,
    lng: entry.stop?.lng ?? 0,
    ward: entry.stop?.ward ?? null
  }));

  const { data: fares } = await supabase
    .from('fares')
    .select('id, from_stop_id, to_stop_id, passenger_type, price_tzs, note')
    .eq('route_id', route.id)
    .order('passenger_type');

  const faresData = (fares ?? []) as unknown as FareRecord[];
  const groupedFares = faresData.reduce<Record<string, FareRecord[]>>((acc, fare) => {
    if (!acc[fare.passenger_type]) acc[fare.passenger_type] = [];
    acc[fare.passenger_type].push(fare);
    return acc;
  }, {});

  const { data: attachments } = await supabase
    .from('attachments')
    .select('id, file_path, kind, caption')
    .eq('route_id', route.id);

  const attachmentsData = (attachments ?? []) as unknown as AttachmentRecord[];

  let operators: OperatorRecord[] = [];
  if (route.operator_ids.length > 0) {
    const { data: operatorData } = await supabase
      .from('operators')
      .select('id,name,notes')
      .in('id', route.operator_ids);
    operators = (operatorData ?? []) as unknown as OperatorRecord[];
  }

  return (
    <article className="space-y-6">
      <header className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span
            className="h-12 w-12 rounded-full border border-slate-200"
            style={{ backgroundColor: route.color }}
          />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{route.display_name}</h1>
            <div className="mt-1 flex flex-wrap gap-2">
              {(route.corridors ?? []).map((corridor: string) => (
                <Badge key={corridor}>{corridor}</Badge>
              ))}
              {route.est_buses && (
                <Badge colorClassName="bg-emerald-100 text-emerald-700">
                  {route.est_buses} buses
                </Badge>
              )}
              {route.hours && <Badge colorClassName="bg-slate-200 text-slate-700">{route.hours}</Badge>}
            </div>
          </div>
        </div>
        {route.notes && <p className="mt-3 text-sm text-slate-600">{route.notes}</p>}
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Route map</h2>
        <p className="text-sm text-slate-500">
          Polyline generated from ordered stops. Tiles provided by MapLibre OSM demo style.
        </p>
        <div className="mt-4">
          <MapEditor stops={stops} color={route.color} interactive={false} />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Stops</h2>
        <table className="mt-3 w-full table-auto text-sm">
          <thead className="text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="py-2">#</th>
              <th>Stop</th>
              <th>Ward</th>
              <th>Coordinates</th>
            </tr>
          </thead>
          <tbody>
            {stops.map((stop, index) => (
              <tr key={stop.local_id} className="border-t border-slate-100">
                <td className="py-2 text-xs text-slate-500">{index + 1}</td>
                <td className="py-2 font-medium text-slate-800">{stop.name}</td>
                <td className="py-2 text-slate-600">{stop.ward ?? '-'}</td>
                <td className="py-2 text-xs text-slate-500">
                  {stop.lat.toFixed(5)}, {stop.lng.toFixed(5)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Fares</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {Object.entries(groupedFares).map(([segment, entries]) => (
            <div key={segment} className="rounded border border-slate-200 p-3">
              <h3 className="text-sm font-semibold text-slate-700 uppercase">{segment}</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {entries?.map((entry) => {
                  const from = stops.find((stop) => stop.stop_id === entry.from_stop_id)?.name ?? 'Start';
                  const to = stops.find((stop) => stop.stop_id === entry.to_stop_id)?.name ?? 'End';
                  return (
                    <li key={entry.id} className="flex items-center justify-between">
                      <span>
                        {from} &rarr; {to}
                      </span>
                      <span className="font-semibold text-slate-900">
                        TZS {Number(entry.price_tzs).toLocaleString()}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {!Object.keys(groupedFares).length && (
            <p className="text-sm text-slate-500">No fares documented yet.</p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Operators</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {operators.map((operator) => (
            <li key={operator.id}>
              <strong className="text-slate-800">{operator.name}</strong>
              {operator.notes && <span className="ml-2 text-slate-500">{operator.notes}</span>}
            </li>
          ))}
          {!operators.length && <li className="text-sm text-slate-500">No operators listed.</li>}
        </ul>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Ticket gallery</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {attachmentsData.map((attachment) => (
            <figure key={attachment.id} className="space-y-2">
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET}/${attachment.file_path}`}
                alt={attachment.caption ?? attachment.kind}
                width={400}
                height={300}
                className="h-40 w-full rounded object-cover"
              />
              {attachment.caption && (
                <figcaption className="text-xs text-slate-500">{attachment.caption}</figcaption>
              )}
            </figure>
          ))}
          {!attachmentsData.length && (
            <p className="text-sm text-slate-500">No ticket imagery uploaded yet.</p>
          )}
        </div>
      </section>
    </article>
  );
}
