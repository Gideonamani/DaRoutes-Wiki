import { NextResponse } from 'next/server';
import { getSupabaseRouteHandlerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';

type RouteSummaryRecord = Tables<'routes'> & {
  start_stop?: { name?: string | null } | null;
  end_stop?: { name?: string | null } | null;
};

export const revalidate = 60;

export async function GET() {
  const supabase = getSupabaseRouteHandlerClient();

  const { data, error } = await supabase
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
      updated_at,
      start_stop:stops!routes_start_stop_id_fkey (name),
      end_stop:stops!routes_end_stop_id_fkey (name)
    `
    )
    .eq('status', 'published')
    .order('display_name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const routes = (data ?? []) as unknown as RouteSummaryRecord[];
  const payload = routes.map((route) => ({
    slug: route.slug,
    name: route.display_name,
    color: route.color,
    corridors: route.corridors,
    est_buses: route.est_buses,
    hours: route.hours,
    start: route.start_stop?.name ?? null,
    end: route.end_stop?.name ?? null,
    updated_at: route.updated_at
  }));

  return NextResponse.json({ routes: payload });
}
