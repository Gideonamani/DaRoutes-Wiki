import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';
import { WORKFLOW_STATUS_LABELS, type WorkflowStatus } from '@/lib/workflowStatus';

type RouteRow = Pick<Tables<'routes'>, 'id' | 'slug' | 'display_name' | 'status' | 'updated_at' | 'color'>;

type WorkflowEvent = {
  id: number;
  entity_type: string;
  entity_id: string;
  from_status: WorkflowStatus | null;
  to_status: WorkflowStatus;
  created_at: string;
};

const STATUS_BADGE_CLASSES: Record<WorkflowStatus, string> = {
  draft: 'bg-slate-200 text-slate-600',
  in_review: 'bg-amber-100 text-amber-700',
  published: 'bg-emerald-100 text-emerald-700'
};

export const metadata: Metadata = {
  title: 'Profile - DaRoutes Wiki',
  description: 'Your contributor profile and recent DaRoutes activity.'
};

function formatDate(value: string | null) {
  if (!value) return 'Pending';
  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

export default async function ProfilePage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const userId = session.user.id;

  const [{ data: profile }, { data: authoredRoutes }, { data: editedRoutes }, workflowResponse] = await Promise.all([
    supabase.from('profile').select('role, created_at').eq('user_id', userId).maybeSingle(),
    supabase
      .from('routes')
      .select('id, slug, display_name, status, updated_at, color')
      .eq('created_by', userId)
      .order('updated_at', { ascending: false })
      .limit(20),
    supabase
      .from('routes')
      .select('id, slug, display_name, status, updated_at, color')
      .eq('updated_by', userId)
      .order('updated_at', { ascending: false })
      .limit(20),
    supabase
      .from('workflow_events')
      .select('id, entity_type, entity_id, from_status, to_status, created_at')
      .eq('actor', userId)
      .order('created_at', { ascending: false })
      .limit(10)
  ]);

  const role = (profile?.role ?? 'viewer') as Tables<'profile'>['role'];
  const joinedAt = session.user.created_at ?? profile?.created_at ?? null;

  const authored = (authoredRoutes ?? []) as RouteRow[];
  const edited = (editedRoutes ?? []) as RouteRow[];

  const stats = authored.reduce(
    (acc, route) => {
      acc.total += 1;
      acc.byStatus[route.status as keyof typeof acc.byStatus] += 1;
      return acc;
    },
    {
      total: 0,
      byStatus: {
        draft: 0,
        in_review: 0,
        published: 0
      }
    }
  );

  const combinedMap = new Map<string, RouteRow>();
  [...authored, ...edited].forEach((route) => {
    const existing = combinedMap.get(route.id);
    if (!existing || new Date(route.updated_at) > new Date(existing.updated_at)) {
      combinedMap.set(route.id, route);
    }
  });
  const recentRoutes = Array.from(combinedMap.values()).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const workflowEvents: WorkflowEvent[] = Array.isArray(workflowResponse?.data)
    ? (workflowResponse.data as WorkflowEvent[])
    : [];

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-600">Signed in as {session.user.email}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Badge colorClassName="bg-slate-200 text-slate-700">Role: {role}</Badge>
          <Badge colorClassName="bg-slate-200 text-slate-700">Joined: {formatDate(joinedAt)}</Badge>
          <Link href="/dashboard" className="rounded bg-brand-dark px-4 py-2 font-semibold text-white">
            Open dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="space-y-2 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Route contributions</h2>
          <p className="text-3xl font-semibold text-slate-900">{stats.total}</p>
          <div className="space-y-1 text-sm text-slate-600">
            {(Object.keys(stats.byStatus) as WorkflowStatus[]).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span>{WORKFLOW_STATUS_LABELS[key]}</span>
                <span className="font-semibold">{stats.byStatus[key]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-3 p-5 md:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Recent edits</h2>
          <ul className="space-y-2 text-sm">
            {recentRoutes.slice(0, 6).map((route) => (
              <li key={route.id} className="flex items-center justify-between gap-3 rounded border border-slate-200 px-3 py-2">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: route.color ?? '#1e293b' }}
                  />
                  <div>
                    <Link
                      href={{ pathname: '/dashboard/routes/[id]', query: { id: route.id } }}
                      className="font-semibold text-slate-900 hover:underline"
                    >
                      {route.display_name}
                    </Link>
                    <p className="text-xs text-slate-500">Updated {formatDate(route.updated_at)}</p>
                  </div>
                </div>
                <Badge colorClassName={STATUS_BADGE_CLASSES[route.status as WorkflowStatus]}>
                  {WORKFLOW_STATUS_LABELS[route.status as WorkflowStatus]}
                </Badge>
              </li>
            ))}
            {!recentRoutes.length && (
              <li className="rounded border border-dashed border-slate-200 px-3 py-4 text-xs text-slate-500">
                No edits yet. Create or update a route from the dashboard.
              </li>
            )}
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Workflow history</h2>
          <ul className="space-y-2 text-sm">
            {workflowEvents.map((event) => (
              <li key={event.id} className="rounded border border-slate-200 px-3 py-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                  <span>{event.entity_type}</span>
                  <span>{formatDate(event.created_at)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  {(event.from_status ? WORKFLOW_STATUS_LABELS[event.from_status] : 'New') +
                    ' -> ' +
                    WORKFLOW_STATUS_LABELS[event.to_status]}
                </p>
                <p className="text-xs text-slate-500">ID: {event.entity_id}</p>
              </li>
            ))}
            {!workflowEvents.length && (
              <li className="rounded border border-dashed border-slate-200 px-3 py-4 text-xs text-slate-500">
                Workflow updates appear after you move drafts into review or publish changes.
              </li>
            )}
          </ul>
        </Card>

        <Card className="space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Next steps</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link href={{ pathname: '/dashboard/routes' }} className="text-brand-dark hover:underline">
                Review drafts needing publication
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/terminals' }} className="text-brand-dark hover:underline">
                Audit terminal amenities and accessibility info
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/explainer' }} className="text-brand-dark hover:underline">
                Share the explainer with new contributors
              </Link>
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
