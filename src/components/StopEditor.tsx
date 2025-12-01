'use client';

import { useState, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';
import type { Tables } from '@/lib/types';
import { WORKFLOW_STATUS_OPTIONS } from '@/lib/workflowStatus';
import { Save, Info, Map as MapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapEditor = dynamic(() => import('./MapEditor').then((mod) => mod.MapEditor), {
    ssr: false,
    loading: () => <div className="h-64 w-full rounded-lg border border-slate-200 bg-slate-50 animate-pulse" />
});

const StopSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    ward: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['draft', 'in_review', 'published']),
    lat: z.number({ invalid_type_error: 'Latitude is required' }),
    lng: z.number({ invalid_type_error: 'Longitude is required' }),
    name_aliases: z.string().optional() // We'll handle comma-separated string for input
});

type StopFormValues = z.infer<typeof StopSchema>;

interface StopEditorProps {
    stop: Tables<'stops'>;
    userId: string;
}

export function StopEditor({ stop, userId }: StopEditorProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const supabase = getSupabaseBrowserClient();

    // Check permissions: Creator or Draft
    const canEdit = stop.created_by === userId || stop.status === 'draft';

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty }
    } = useForm<StopFormValues>({
        resolver: zodResolver(StopSchema),
        defaultValues: {
            name: stop.name,
            ward: stop.ward ?? '',
            description: stop.description ?? '',
            status: stop.status,
            lat: stop.lat,
            lng: stop.lng,
            name_aliases: stop.name_aliases?.join(', ') ?? ''
        }
    });

    const currentLat = watch('lat');
    const currentLng = watch('lng');

    const onSubmit: SubmitHandler<StopFormValues> = async (values) => {
        setError(null);
        setSuccess(null);

        if (!canEdit) {
            setError('You do not have permission to edit this stop.');
            return;
        }

        startTransition(async () => {
            try {
                const aliases = values.name_aliases
                    ? values.name_aliases.split(',').map((s) => s.trim()).filter(Boolean)
                    : [];

                const { error: updateError } = await supabase
                    .from('stops')
                    .update({
                        name: values.name,
                        ward: values.ward || null,
                        description: values.description || null,
                        status: values.status,
                        lat: values.lat,
                        lng: values.lng,
                        name_aliases: aliases,
                        updated_at: new Date().toISOString(),
                        updated_by: userId
                    })
                    .eq('id', stop.id);

                if (updateError) throw updateError;

                setSuccess('Stop updated successfully.');
                router.refresh();
            } catch (err) {
                console.error(err);
                setError('Failed to update stop. Please try again.');
            }
        });
    };

    const handleMapClick = (coords: { lat: number; lng: number }) => {
        if (!canEdit) return;
        setValue('lat', Number(coords.lat.toFixed(6)), { shouldDirty: true });
        setValue('lng', Number(coords.lng.toFixed(6)), { shouldDirty: true });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Stop: {stop.name}</h1>
                    <p className="text-sm text-slate-500">
                        ID: {stop.slug} • Created {new Date(stop.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {isDirty && (
                        <span className="text-sm text-amber-600">Unsaved changes</span>
                    )}
                    <button
                        type="submit"
                        disabled={isPending || !canEdit}
                        className="inline-flex items-center gap-2 rounded-md bg-brand-dark px-4 py-2 text-sm font-semibold text-white hover:bg-brand disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {!canEdit && (
                <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 shrink-0 text-amber-600" />
                        <p>
                            You can only view this stop. To edit, you must be the original creator or the stop must be in <strong>Draft</strong> status.
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-600 border border-emerald-200">
                    {success}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Basic Info */}
                    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">Basic Information</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700">Name</label>
                                <input
                                    {...register('name')}
                                    disabled={!canEdit}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand disabled:bg-slate-100"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Ward</label>
                                <input
                                    {...register('ward')}
                                    disabled={!canEdit}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand disabled:bg-slate-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Status</label>
                                <select
                                    {...register('status')}
                                    disabled={!canEdit}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand disabled:bg-slate-100"
                                >
                                    {WORKFLOW_STATUS_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700">Aliases (comma separated)</label>
                                <input
                                    {...register('name_aliases')}
                                    disabled={!canEdit}
                                    placeholder="e.g. Posta Mpya, Old Post Office"
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand disabled:bg-slate-100"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    {...register('description')}
                                    disabled={!canEdit}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand disabled:bg-slate-100"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Location */}
                    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">Location</h2>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <MapIcon className="h-4 w-4" />
                                <span>Click map to set location</span>
                            </div>
                        </div>

                        <div className="mb-4 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Latitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    {...register('lat', { valueAsNumber: true })}
                                    disabled={!canEdit}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand disabled:bg-slate-100"
                                />
                                {errors.lat && <p className="mt-1 text-xs text-red-600">{errors.lat.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Longitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    {...register('lng', { valueAsNumber: true })}
                                    disabled={!canEdit}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand disabled:bg-slate-100"
                                />
                                {errors.lng && <p className="mt-1 text-xs text-red-600">{errors.lng.message}</p>}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-slate-200">
                            <MapEditor
                                stops={[{
                                    local_id: stop.id,
                                    stop_id: stop.id,
                                    name: watch('name'),
                                    lat: currentLat || 0,
                                    lng: currentLng || 0
                                }]}
                                color="#2563eb"
                                interactive={canEdit}
                                onMapAdd={handleMapClick}
                            />
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    {/* Metadata / Sidebar */}
                    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold uppercase text-slate-500">Metadata</h3>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-slate-500">Created By</dt>
                                <dd className="font-medium text-slate-900 truncate" title={stop.created_by ?? 'Unknown'}>
                                    {stop.created_by ?? 'Unknown'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Created At</dt>
                                <dd className="font-medium text-slate-900">
                                    {new Date(stop.created_at).toLocaleString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Last Updated</dt>
                                <dd className="font-medium text-slate-900">
                                    {new Date(stop.updated_at).toLocaleString()}
                                </dd>
                            </div>
                        </dl>
                    </section>
                </div>
            </div>
        </form>
    );
}
