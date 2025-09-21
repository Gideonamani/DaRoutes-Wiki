import { NextResponse } from 'next/server';
import { getSupabaseRouteHandlerClient } from '@/lib/supabaseServer';
import { stopsToFeatureCollection, stopsToLineString } from '@/lib/geo';
import type { Tables } from '@/lib/types';

type RouteRecord = Tables<'routes'>;
type RouteStopRecord = Tables<'route_stops'> & { stop?: Tables<'stops'> | null };
type FareRecord = Tables<'fares'>;
type AttachmentRecord = Tables<'attachments'>;
type OperatorRecord = Tables<'operators'>;

interface Params {
  params: { slug: string };
}

export const revalidate = 120;

export async function GET(_: Request, { params }: Params) {
  const supabase = getSupabaseRouteHandlerClient();

  const { data: routeData, error } = await supabase
    .from('routes')
    .select(
      `
      id,
      slug,
      display_name,
      color,
      corridors,
      operator_ids,
      est_buses,
      hours,
      notes,
      updated_at
    `
    )
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!routeData) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const route = routeData as RouteRecord;

  const { data: routeStops } = await supabase
    .from('route_stops')
    .select(
      `
      seq,
      stop:stops (id, name, lat, lng, ward, name_aliases)
    `
    )
    .eq('route_id', route.id)
    .order('seq', { ascending: true });

  const routeStopsData = (routeStops ?? []) as unknown as RouteStopRecord[];
  const stops = routeStopsData.map((entry) => ({
    local_id: `${entry.stop?.id ?? ''}-${entry.seq}`,
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
    .eq('route_id', route.id)
    .order('passenger_type');

  const { data: attachments } = await supabase
    .from('attachments')
    .select('id, file_path, kind, caption')
    .eq('route_id', route.id)
    .order('created_at', { ascending: false });

  const faresData = (fares ?? []) as unknown as FareRecord[];
  const attachmentsData = (attachments ?? []) as unknown as AttachmentRecord[];

  let operators: OperatorRecord[] = [];
  if (route.operator_ids.length > 0) {
    const { data: operatorData } = await supabase
      .from('operators')
      .select('id,name,notes')
      .in('id', route.operator_ids);
    operators = (operatorData ?? []) as unknown as OperatorRecord[];
  }

  const stopsCollection = stopsToFeatureCollection(stops);
  const lineFeature = stopsToLineString(stops);

  return NextResponse.json({
    metadata: {
      slug: route.slug,
      display_name: route.display_name,
      color: route.color,
      corridors: route.corridors,
      est_buses: route.est_buses,
      hours: route.hours,
      notes: route.notes,
      updated_at: route.updated_at,
      operators
    },
    stops: {
      features: stopsCollection.features,
      line: lineFeature
    },
    fares: faresData,
    attachments: attachmentsData
  });
}