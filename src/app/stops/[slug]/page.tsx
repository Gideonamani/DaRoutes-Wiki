import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, Star, Share2, Accessibility, CheckCircle } from 'lucide-react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { LiveArrivals } from '@/components/LiveArrivals';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';
import { WORKFLOW_STATUS_LABELS } from '@/lib/workflowStatus';
import { PALETTE } from '@/lib/designTokens';

type StopRecord = Pick<
  Tables<'stops'>,
  'id' | 'slug' | 'name' | 'ward' | 'status' | 'name_aliases' | 'lat' | 'lng' | 'created_at' | 'updated_at' | 'description'
> & {
  route_links?: {
    seq: number;
    route?: Pick<Tables<'routes'>, 'id' | 'slug' | 'display_name' | 'status' | 'color'> | null;
  }[] | null;
};

interface StopPageProps {
  params: { slug: string };
}

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
  const title = `${stop.name} stop - DaRoutes Wiki`;
  const description = stop.ward
    ? `Routes and details for ${stop.name} in ${stop.ward}.`
    : `Routes and details for ${stop.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/stops/${params.slug}`,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  } satisfies Metadata;
}

// Mock busy hours data - in production this would come from analytics
const BUSY_HOURS = [
  { label: 'Morning Peak', window: '06:30–09:00', level: 4 },
  { label: 'Midday', window: '12:00–14:00', level: 2 },
  { label: 'Evening Peak', window: '16:30–19:00', level: 5 },
];

// Mock accessibility data
const ACCESSIBILITY = {
  curbRamp: true,
  tactilePaving: false,
  seating: true,
  lighting: true,
};

function BusyBar({ label, window, level }: { label: string; window: string; level: number }) {
  const caps = 5;
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-36">
        <div className="text-sm font-medium" style={{ color: PALETTE.text }}>{label}</div>
        <div className="text-xs" style={{ color: PALETTE.textMuted }}>{window}</div>
      </div>
      <div className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${(level / caps) * 100}%`, backgroundColor: PALETTE.primary }} />
      </div>
      <div className="w-8 text-right text-xs" style={{ color: PALETTE.textMuted }}>{level}/{caps}</div>
    </div>
  );
}

export default async function StopPage({ params }: StopPageProps) {
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
      description,
      name_aliases,
      lat,
      lng,
      created_at,
      updated_at,
      route_links:route_stops (seq, route:routes (id, slug, display_name, status, color))
    `
    )
    .eq('slug', params.slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();

  const stop = data as unknown as StopRecord;
  const isPublished = stop.status === 'published';
  const aliases = stop.name_aliases ?? [];
  const linkedRoutes = (stop.route_links ?? []).filter(
    (link) => link?.route && link.route.status === 'published'
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: PALETTE.bg }}>
      {/* Header */}
      <div className="px-4 md:px-6 py-4 flex items-center gap-3 bg-white border-b">
        <Link href="/" className="p-2 rounded-md hover:bg-gray-100" aria-label="Back">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div className="text-xs" style={{ color: PALETTE.textMuted }}>Stop</div>
          <h1 className="text-xl md:text-2xl font-semibold" style={{ color: PALETTE.text }}>
            {stop.name}
          </h1>
          <div className="text-sm flex items-center gap-2" style={{ color: PALETTE.textMuted }}>
            <MapPin size={14} /> {stop.lat?.toFixed(4)}, {stop.lng?.toFixed(4)}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-md border bg-white text-sm inline-flex items-center gap-1">
            <Star size={16} /> Save
          </button>
          <button className="px-3 py-1.5 rounded-md border bg-white text-sm inline-flex items-center gap-1">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {!isPublished && (
            <Card className="p-4 bg-amber-50 border-amber-200">
              <p className="text-xs font-semibold uppercase text-amber-700">
                {WORKFLOW_STATUS_LABELS[stop.status]} stop - visible to contributors only
              </p>
            </Card>
          )}

          <Card className="border border-gray-100 p-4">
            <div className="text-sm flex items-center gap-3" style={{ color: PALETTE.textMuted }}>
              <span>{stop.description || `Bus stop in ${stop.ward || 'Dar es Salaam'}`}</span>
            </div>
          </Card>

          <Card className="border border-gray-100 p-4 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <Clock size={16} /> Busy hours
            </div>
            <div className="space-y-3">
              {BUSY_HOURS.map((b) => (
                <BusyBar key={b.label} label={b.label} window={b.window} level={b.level} />
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card className="border border-gray-100 p-4">
            <div className="font-semibold mb-2">Routes serving this stop</div>
            <div className="flex flex-wrap gap-2">
              {linkedRoutes.map((link) => {
                const route = link.route;
                if (!route) return null;
                return (
                  <Link
                    key={route.id}
                    href={`/route/${route.slug}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm bg-white hover:bg-teal-50"
                  >
                    <span className="inline-flex items-center justify-center h-6 w-8 rounded-md text-white text-xs font-semibold" style={{ background: route.color }}>
                      {link.seq}
                    </span>
                    <span style={{ color: PALETTE.text }}>{route.display_name}</span>
                  </Link>
                );
              })}
              {!linkedRoutes.length && <p className="text-sm" style={{ color: PALETTE.textMuted }}>No routes linked yet.</p>}
            </div>
          </Card>

          <Card className="border border-gray-100 p-4">
            <LiveArrivals />
          </Card>

          <Card className="border border-gray-100 p-4 space-y-3 text-sm">
            <div className="font-semibold flex items-center gap-2">
              <Accessibility size={16} /> Accessibility
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className={ACCESSIBILITY.curbRamp ? 'text-emerald-600' : 'text-gray-300'} /> Curb ramp
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className={ACCESSIBILITY.seating ? 'text-emerald-600' : 'text-gray-300'} /> Seating
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className={ACCESSIBILITY.lighting ? 'text-emerald-600' : 'text-gray-300'} /> Lighting
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className={ACCESSIBILITY.tactilePaving ? 'text-emerald-600' : 'text-gray-300'} /> Tactile paving
              </div>
            </div>
            <div className="text-xs" style={{ color: PALETTE.textMuted }}>Community-sourced. Accuracy improves as riders contribute.</div>
          </Card>

          {aliases.length > 0 && (
            <Card className="border border-gray-100 p-4">
              <div className="font-semibold mb-2">Also known as</div>
              <div className="flex flex-wrap gap-2">
                {aliases.map((alias) => (
                  <Badge key={alias}>{alias}</Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
