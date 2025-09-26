import type { Metadata } from 'next';
import Link from 'next/link';
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

const description = 'Explore published bus terminals in Dar es Salaam and discover the routes that serve them.';

export const metadata: Metadata = {
  title: 'Terminals - DaRoutes Wiki',
  description,
  openGraph: {
    title: 'Terminals - DaRoutes Wiki',
    description,
    url: '/terminals',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terminals - DaRoutes Wiki',
    description
  }
};

export default async function TerminalsPage() {
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
      updated_at,
      route_links:route_terminals (role, route:routes (id, slug, display_name, status, color))
    
    )
    .eq('status', 'published')
    .order('name');

  if (error) {
    throw error;
  }

  const terminals = (data ?? []) as unknown as TerminalRecord[];

  return (
    <div className="space-y-8">
      <header className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Terminals</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {terminals.map((terminal) => {
          const amenities = Array.isArray(terminal.amenities)
            ? (terminal.amenities as string[])
            : [];
          const linkedRoutes = (terminal.route_links ?? []).filter(
            (link) => link?.route && link.route.status === 'published'
          );

          return (
            <Card key={terminal.id} className="flex h-full flex-col justify-between p-5">
              <div>
                <Link
                  href={/terminals/}
                  className="text-lg font-semibold text-slate-900"
                >
                  {terminal.name}
                </Link>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                  {terminal.ward ?? 'Ward pending'}
                </p>
                {terminal.description && (
                  <p className="mt-2 text-sm text-slate-600">
                    {terminal.description}
                  </p>
                )}
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge colorClassName="bg-slate-200 text-slate-700">
                    {linkedRoutes.length} route{linkedRoutes.length === 1 ? '' : 's'}
                  </Badge>
                  {amenities.slice(0, 4).map((amenity) => (
                    <Badge key={amenity}>{amenity}</Badge>
                  ))}
                  {amenities.length > 4 && (
                    <Badge colorClassName="bg-slate-100 text-slate-600">
                      +{amenities.length - 4} more
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  {linkedRoutes.slice(0, 3).map((link) => (
                    <Link
                      key={link.route?.id}
                      href={/route/}
                      className="flex items-center gap-2 text-sm text-brand-dark hover:underline"
                    >
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: link.route?.color ?? '#1e293b' }}
                      />
                      {link.route?.display_name}
                      <span className="text-xs uppercase text-slate-400">{link.role}</span>
                    </Link>
                  ))}
                  {linkedRoutes.length > 3 && (
                    <p className="text-xs text-slate-500">+{linkedRoutes.length - 3} more routes</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {!terminals.length && (
          <Card className="p-6 text-sm text-slate-500">
            No terminals published yet. Editors can add terminals from the dashboard.
          </Card>
        )}
      </section>
    </div>
  );
}
