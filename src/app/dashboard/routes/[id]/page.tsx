import { notFound } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';
import { RouteEditor } from '@/components/RouteEditor';
import type { AttachmentDraft, StopFormValue } from '@/components/RouteEditor.types';

interface RouteEditorPageProps {
  params: { id: string };
}

export default async function RouteEditorPage({ params }: RouteEditorPageProps) {
  const supabase = getSupabaseServerClient();
  const { data: route, error } = await supabase.from('routes').select('*').eq('id', params.id).maybeSingle();

  if (error) throw error;
  if (!route) notFound();

  const { data: routeStops } = await supabase
    .from('route_stops')
    .select('seq, stop:stops (id, name, lat, lng, ward, name_aliases)')
    .eq('route_id', route.id)
    .order('seq');

  const initialStops: StopFormValue[] =
    routeStops?.map((entry) => ({
      id: `${entry.stop?.id}-${entry.seq}`,
      local_id: `${entry.stop?.id}-${entry.seq}`,
      stop_id: entry.stop?.id ?? undefined,
      name: entry.stop?.name ?? '',
      lat: entry.stop?.lat ?? 0,
      lng: entry.stop?.lng ?? 0,
      ward: entry.stop?.ward ?? null,
      name_aliases: entry.stop?.name_aliases ?? []
    })) ?? [];

  const { data: fares } = await supabase
    .from('fares')
    .select('id, from_stop_id, to_stop_id, passenger_type, price_tzs, note')
    .eq('route_id', route.id);

  const initialFares =
    fares?.map((fare) => ({
      id: fare.id,
      from_stop_ref: fare.from_stop_id ?? '',
      to_stop_ref: fare.to_stop_id ?? '',
      passenger_type: fare.passenger_type,
      price_tzs: fare.price_tzs,
      note: fare.note
    })) ?? [];

  const { data: attachments } = await supabase
    .from('attachments')
    .select('id, file_path, kind, caption')
    .eq('route_id', route.id);

  const initialAttachments: AttachmentDraft[] =
    attachments?.map((attachment) => ({
      id: attachment.id,
      file_path: attachment.file_path,
      kind: attachment.kind,
      caption: attachment.caption,
      status: 'persisted'
    })) ?? [];

  const { data: operators } = await supabase.from('operators').select('id,name').order('name');

  return (
    <div className="space-y-6">
      <RouteEditor
        mode="edit"
        route={route as Tables<'routes'>}
        operators={operators ?? []}
        initialStops={initialStops}
        initialFares={initialFares}
        initialAttachments={initialAttachments}
      />
    </div>
  );
}