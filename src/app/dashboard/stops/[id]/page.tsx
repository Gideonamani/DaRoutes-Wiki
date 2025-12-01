import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';
import { StopEditor } from '@/components/StopEditor';

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

    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
        return (
            <div className="p-8 text-center">
                <p>You must be signed in to edit stops.</p>
                <Link href="/login" className="text-brand-dark hover:underline">
                    Sign in
                </Link>
            </div>
        );
    }

    const { data: stop } = await supabase
        .from('stops')
        .select('*')
        .eq('id', params.id)
        .maybeSingle();

    if (!stop) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <Link href="/dashboard/profile" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6">
                <ArrowLeft size={16} /> Back to Profile
            </Link>

            <StopEditor stop={stop} userId={session.user.id} />
        </div>
    );
}
