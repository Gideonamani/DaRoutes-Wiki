import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';
import { RouteEditor } from '@/components/RouteEditor';
import type { AttachmentDraft, StopFormValue } from '@/components/RouteEditor.types';

type RouteStopRecord = Tables<'route_stops'> & { stop?: Tables<'stops'> | null };
type FareRecord = Tables<'fares'>;
type AttachmentRecord = Tables<'attachments'>;

type RouteRecord = Tables<'routes'>;

interface RouteEditorPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: RouteEditorPageProps): Promise<Metadata> {
  const supabase = getSupabaseServerClient();
  const { data: route } = await supabase
    .from('routes')
    .select('display_name, slug')
    .eq('id', params.id)
    .maybeSingle();

  if (!route) {
    return {
      title: 'Route not found · DaRoutes Wiki',
      description: 'The requested route could not be located.',
      openGraph: {
        title: 'Route not found · DaRoutes Wiki',
        description: 'The requested route could not be located.',
        url: `/dashboard/routes/${params.id}`,
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
        description: 'The requested route could not be located.',
        images: ['/opengraph-image']
      }
    } satisfies Metadata;
  }

  const title = `Edit ${route.display_name} · DaRoutes Wiki`;
  const description = `Update stops, fares, and media for ${route.display_name}.`;
  const imageUrl = route.slug ? `/route/${route.slug}/opengraph-image` : '/opengraph-image';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/dashboard/routes/${params.id}`,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${route.display_name} route preview`
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

export default async function RouteEditorPage({ params }: RouteEditorPageProps) {
  const supabase = getSupabaseServerClient();
  const { data: route, error } = await supabase.from('routes').select('*').eq('id', params.id).maybeSingle();

  if (error) throw error;
  if (!route) notFound();

  const routeRecord = route as RouteRecord;

  const { data: routeStops } = await supabase
    .from('route_stops')
    .select('seq, stop:stops (id, name, lat, lng, ward, name_aliases)')
    .eq('route_id', routeRecord.id)
    .order('seq');

  const routeStopsData = (routeStops ?? []) as unknown as RouteStopRecord[];
  const initialStops: StopFormValue[] = routeStopsData.map((entry) => ({
    id: `${entry.stop?.id}-${entry.seq}`,
    local_id: `${entry.stop?.id}-${entry.seq}`,
    stop_id: entry.stop?.id ?? undefined,
    name: entry.stop?.name ?? '',
    lat: entry.stop?.lat ?? 0,
    lng: entry.stop?.lng ?? 0,
    ward: entry.stop?.ward ?? null,
    name_aliases: entry.stop?.name_aliases ?? []
  }));

  const { data: fares } = await supabase
    .from('fares')
    .select('id, from_stop_id, to_stop_id, passenger_type, price_tzs, note')
    .eq('route_id', routeRecord.id);

  const faresData = (fares ?? []) as unknown as FareRecord[];
  const initialFares = faresData.map((fare) => ({
    id: fare.id,
    from_stop_ref: fare.from_stop_id ?? '',
    to_stop_ref: fare.to_stop_id ?? '',
    passenger_type: fare.passenger_type,
    price_tzs: fare.price_tzs,
    note: fare.note
  }));

  const { data: attachments } = await supabase
    .from('attachments')
    .select('id, file_path, kind, caption')
    .eq('route_id', routeRecord.id);

  const attachmentsData = (attachments ?? []) as unknown as AttachmentRecord[];
  const initialAttachments: AttachmentDraft[] = attachmentsData.map((attachment) => ({
    id: attachment.id,
    file_path: attachment.file_path,
    kind: attachment.kind,
    caption: attachment.caption,
    status: 'persisted'
  }));

  const { data: operators } = await supabase.from('operators').select('id,name').order('name');
  const { data: terminals } = await supabase
    .from('terminals')
    .select('id,name,slug,status')
    .order('name');

  return (
    <div className="space-y-6">
      <RouteEditor
        mode="edit"
        route={routeRecord}
        operators={operators ?? []}
        terminals={terminals ?? []}
        initialStops={initialStops}
        initialFares={initialFares}
        initialAttachments={initialAttachments}
      />
    </div>
  );
}
