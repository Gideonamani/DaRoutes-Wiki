import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';

type TerminalRecord = Tables<'terminals'> & {
  route_links?: {
    role: 'origin' | 'terminus' | 'through';
    route?: Pick<Tables<'routes'>, 'id' | 'slug' | 'display_name' | 'status' | 'color'> | null;
  }[] | null;
};

interface TerminalPageProps {
  params: { slug: string };
}

const STATUS_LABELS: Record<'draft' | 'in_review' | 'published', string> = {
  draft: 'Draft',
  in_review: 'In review',
  published: 'Published'
};

export async function generateMetadata({ params }: TerminalPageProps): Promise<Metadata> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from('terminals')
    .select('name, description, status')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!data) {
    return {
      title: 'Terminal not found - DaRoutes Wiki',
      description: 'The requested terminal could not be located.'
    } satisfies Metadata;
  }

  const terminal = data as Pick<TerminalRecord, 'name' | 'description' | 'status'>;
  const title = ${terminal.name} - DaRoutes Wiki;
  const description = terminal.description ?? Details and linked routes for .;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: /terminals/,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  } satisfies Metadata;
}

export default async function TerminalPage({ params }: TerminalPageProps) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('terminals')
    .select(
      
      id,
      slug,
      name,
      description,
      ward,
      status,
      amenities,
      lat,
      lng,
      created_at,
      updated_at,
      route_links:route_terminals (role, route:routes (id, slug, display_name, status, color))
    
    )
    .eq('slug', params.slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();

  const terminal = data as TerminalRecord;
  const amenities = Array.isArray(terminal.amenities)
    ? (terminal.amenities as string[])
    : [];

  const linkedRoutes = (terminal.route_links ?? []).filter(
    (link) => link?.route && link.route.status === 'published'
  );

  const routesByRole: Record<'origin' | 'terminus' | 'through', typeof linkedRoutes> = {
    origin: linkedRoutes.filter((link) => link.role === 'origin'),
    terminus: linkedRoutes.filter((link) => link.role === 'terminus'),
    through: linkedRoutes.filter((link) => link.role === 'through')
  };

  const formatter = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const isPublished = terminal.status === 'published';

  return (
    <div className="space-y-8">
      <Card className="space-y-4 p-6">
        {!isPublished && (
          <p className="rounded-md bg-amber-100 px-3 py-2 text-xs font-semibold uppercase text-amber-700">
            {STATUS_LABELS[terminal.status]} terminal - visible to contributors only
          </p>
        )}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{terminal.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{terminal.ward ?? 'Ward pending'}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Updated</span>
            <time dateTime={terminal.updated_at}>{formatter.format(new Date(terminal.updated_at))}</time>
          </div>
        </div>
        {terminal.description && <p className="text-sm text-slate-600">{terminal.description}</p>}
        <div className="flex flex-wrap gap-2">
          <Badge colorClassName="bg-slate-200 text-slate-700">
            {linkedRoutes.length} published route{linkedRoutes.length === 1 ? '' : 's'}
          </Badge>
          {amenities.map((amenity) => (
            <Badge key={amenity}>{amenity}</Badge>
          ))}
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Location
          </h2>
          {terminal.lat && terminal.lng ? (
            <div className="space-y-1 text-sm text-slate-700">
              <p>
                Latitude: <span className="font-semibold">{terminal.lat.toFixed(6)}</span>
              </p>
              <p>
                Longitude: <span className="font-semibold">{terminal.lng.toFixed(6)}</span>
              </p>
              <p className="text-xs text-slate-500">Use these coordinates to plot maps or gather GTFS data.</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Coordinates not captured yet.</p>
          )}
        </Card>

        <Card className="space-y-3 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Linked routes
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {(['origin', 'terminus', 'through'] as const).map((role) => (
              <div key={role}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {role === 'through' ? 'Pass-through' : role === 'origin' ? 'Origin' : 'Terminus'}
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {routesByRole[role].map((link) => (
                    <li key={link.route?.id}>
                      <Link
                        href={/route/}
                        className="flex items-center gap-2 text-brand-dark hover:underline"
                      >
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: link.route?.color ?? '#1e293b' }}
                        />
                        {link.route?.display_name}
                      </Link>
                    </li>
                  ))}
                  {!routesByRole[role].length && (
                    <li className="text-xs text-slate-500">No routes linked.</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
