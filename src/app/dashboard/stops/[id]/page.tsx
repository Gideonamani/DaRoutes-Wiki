import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';

interface StopEditorPageProps {
    params: { id: string };
}

export async function generateMetadata({ params }: StopEditorPageProps): Promise<Metadata> {
    const supabase = getSupabaseServerClient();
    const { data: stop } = await supabase
        .from('stops')
        .select('name')
        .eq('id', params.id)
        .maybeSingle();

    if (!stop) {
        return {
            title: 'Stop not found · DaRoutes Wiki',
        };
    }

    return {
        title: `Edit ${stop.name} · DaRoutes Wiki`,
    };
}

export default async function StopEditorPage({ params }: StopEditorPageProps) {
    const supabase = getSupabaseServerClient();
    const { data: stop } = await supabase
        .from('stops')
        .select('name')
        .eq('id', params.id)
        .maybeSingle();

    if (!stop) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <Link href="/dashboard/profile" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6">
                <ArrowLeft size={16} /> Back to Profile
            </Link>

            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Construction size={32} className="text-slate-400" />
                </div>
                <h1 className="text-xl font-semibold text-slate-900 mb-2">
                    Editing {stop.name}
                </h1>
                <p className="text-slate-500 max-w-md mx-auto">
                    The stop editor is currently under development. Please check back later or contact an administrator for assistance.
                </p>
            </div>
        </div>
    );
}
