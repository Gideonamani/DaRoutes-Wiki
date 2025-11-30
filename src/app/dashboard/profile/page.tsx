import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Bus, MapPin, Calendar, Edit, Plus, User } from 'lucide-react';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { MapPreview } from '@/components/MapPreview';
import { PALETTE } from '@/lib/designTokens';
import type { Tables } from '@/lib/types';

export const metadata: Metadata = {
    title: 'My Profile · DaRoutes Wiki',
    description: 'Manage your contributions and view your activity.',
};

type RouteRecord = Tables<'routes'> & {
    start_stop?: { name?: string | null } | null;
    end_stop?: { name?: string | null } | null;
};

export default async function ProfilePage() {
    const supabase = getSupabaseServerClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) {
        redirect('/login');
    }

    // Fetch user profile for role
    const { data: profile } = await supabase
        .from('profile')
        .select('role, created_at')
        .eq('user_id', session.user.id)
        .single();

    // Fetch user's routes
    const { data: routes } = await supabase
        .from('routes')
        .select(`
      *,
      start_stop:stops!routes_start_stop_id_fkey (name),
      end_stop:stops!routes_end_stop_id_fkey (name)
    `)
        .eq('created_by', session.user.id)
        .order('updated_at', { ascending: false });

    // Fetch user's stops
    const { data: stops } = await supabase
        .from('stops')
        .select('*')
        .eq('created_by', session.user.id)
        .order('updated_at', { ascending: false });

    const userRoutes = (routes ?? []) as RouteRecord[];
    const userStops = stops ?? [];

    const stats = [
        { label: 'Routes Created', value: userRoutes.length, icon: Bus },
        { label: 'Stops Added', value: userStops.length, icon: MapPin },
        { label: 'Member Since', value: new Date(profile?.created_at || session.user.created_at || Date.now()).getFullYear(), icon: Calendar },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <User size={40} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {session.user.email?.split('@')[0] || 'Contributor'}
                        </h1>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                            <span>{session.user.email}</span>
                            <span>•</span>
                            <span className="capitalize">{profile?.role || 'Viewer'}</span>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/routes/new"
                        className="flex items-center gap-2 rounded-md bg-brand-dark px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark/90"
                    >
                        <Plus size={16} /> New Route
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-teal-50 text-brand-dark">
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contributions Tabs/Sections */}
            <div className="space-y-6">
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Bus size={20} /> My Routes
                    </h2>
                    {userRoutes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userRoutes.map((route) => (
                                <Card
                                    key={route.id}
                                    className="hover:shadow-md transition-shadow cursor-pointer border border-gray-100 group"
                                >
                                    <Link href={`/dashboard/routes/${route.id}`}>
                                        <div className="flex items-center justify-between p-4 border-b bg-slate-50 group-hover:bg-white transition-colors">
                                            <div>
                                                <h3 className="font-semibold text-base text-slate-900">
                                                    {route.display_name}
                                                </h3>
                                                <div className="flex gap-2 mt-1">
                                                    <Badge colorClassName={
                                                        route.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                                                            route.status === 'in_review' ? 'bg-amber-100 text-amber-800' :
                                                                'bg-slate-100 text-slate-600'
                                                    }>
                                                        {route.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <div
                                                    className="h-4 w-4 rounded-sm"
                                                    style={{ backgroundColor: route.color }}
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="overflow-hidden rounded-md mb-3 h-24 relative">
                                                <MapPreview color={route.color} secondary={PALETTE.success} />
                                            </div>
                                            <div className="text-xs text-slate-500 flex justify-between items-center">
                                                <span>Updated {new Date(route.updated_at).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1 text-brand-dark font-medium">
                                                    <Edit size={12} /> Edit
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                            <p className="text-slate-500 text-sm">You haven't created any routes yet.</p>
                            <Link href="/dashboard/routes/new" className="text-brand-dark font-medium text-sm hover:underline mt-2 inline-block">
                                Create your first route
                            </Link>
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <MapPin size={20} /> My Stops
                    </h2>
                    {userStops.length > 0 ? (
                        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">Name</th>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">Ward</th>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">Status</th>
                                            <th className="px-6 py-3 font-medium text-right whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {userStops.map((stop) => (
                                            <tr key={stop.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-3 font-medium text-slate-900 whitespace-nowrap">{stop.name}</td>
                                                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{stop.ward || '-'}</td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <Badge colorClassName={
                                                        stop.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                                                            stop.status === 'in_review' ? 'bg-amber-100 text-amber-800' :
                                                                'bg-slate-100 text-slate-600'
                                                    }>
                                                        {stop.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-3 text-right whitespace-nowrap">
                                                    <Link href={`/dashboard/stops/${stop.id}`} className="text-brand-dark hover:underline">
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                            <p className="text-slate-500 text-sm">You haven't added any stops yet.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
