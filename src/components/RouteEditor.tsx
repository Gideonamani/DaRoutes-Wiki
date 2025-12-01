'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';

import {

  useFieldArray,

  useForm,

  type SubmitHandler

} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import { useRouter } from 'next/navigation';

import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';

import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

import { DEFAULT_ROUTE_COLORS } from '@/lib/colors';

import dynamic from 'next/dynamic';

const MapEditor = dynamic(() => import('./MapEditor').then((mod) => mod.MapEditor), {
  ssr: false,
  loading: () => <div className="h-80 w-full rounded-lg border border-slate-200 bg-slate-50 animate-pulse" />
});

import { StopPicker } from './StopPicker';

import { FaresEditor } from './FaresEditor';

import { Upload } from './Upload';

const RouteSplitBadgeDesigner = dynamic(
  () => import('./RouteSplitBadgeDesigner').then((mod) => mod.RouteSplitBadgeDesigner),
  { ssr: false }
);
import type { Tables } from '@/lib/types';
import { WORKFLOW_STATUS_OPTIONS } from '@/lib/workflowStatus';
import type { AttachmentDraft, RouteFormValues, StopFormValue } from './RouteEditor.types';
import { Eye, Save, Upload as UploadIcon, Info, Trash2, Map as MapIcon } from 'lucide-react';
import { parseRouteFile } from '@/lib/routeFileParsers';
import { PathPreview } from '@/components/PathPreview';
const slugify = (value: string) =>

  value

    .toLowerCase()

    .trim()

    .replace(/[^a-z0-9]+/g, '-')

    .replace(/(^-|-$)/g, '') || 'stop';

const generateStopSlug = (name: string) => {
  const base = slugify(name);
  const randomSegment =
    typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${base}-${randomSegment}`;
};
const StopSchema = z.object({

  id: z.string(),

  local_id: z.string().min(1),

  stop_id: z.string().uuid().optional(),

  name: z.string().min(1),

  lat: z.number(),

  lng: z.number(),

  ward: z.string().nullable().optional(),

  name_aliases: z.array(z.string())

});

const FareSchema = z.object({

  id: z.string().uuid().optional(),

  from_stop_ref: z.string().min(1),

  to_stop_ref: z.string().min(1),

  passenger_type: z.string().min(1),

  price_tzs: z.number().min(0),

  note: z.string().nullable().optional()

});

const RouteSchema = z.object({

  display_name: z.string().min(2),

  slug: z

    .string()

    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens only'),

  color: z.string().regex(/^#?[0-9a-fA-F]{6}$/),

  corridors: z.array(z.string()),

  operator_ids: z.array(z.string()),

  est_buses: z.number().nullable(),

  hours: z.string().nullable(),

  notes: z.string().nullable(),

  status: z.enum(['draft', 'in_review', 'published']),

  origin_terminal_id: z.string().uuid().nullable(),

  destination_terminal_id: z.string().uuid().nullable(),

  review_notes: z.string().nullable(),

  stops: z.array(StopSchema).min(2, 'Need at least two stops'),

  fares: z.array(FareSchema)

});

type RouteEditorProps = {

  mode: 'create' | 'edit';

  route: Tables<'routes'> | null;

  operators: Pick<Tables<'operators'>, 'id' | 'name'>[];

  terminals: Pick<Tables<'terminals'>, 'id' | 'name' | 'slug' | 'status'>[];

  initialStops: StopFormValue[];

  initialFares: {

    id?: string;

    from_stop_ref: string;

    to_stop_ref: string;

    passenger_type: string;

    price_tzs: number;

    note?: string | null;

  }[];

  initialAttachments: AttachmentDraft[];

};

export function RouteEditor({

  mode,

  route,

  operators,

  terminals,

  initialStops,

  initialFares,

  initialAttachments

}: RouteEditorProps) {

  const router = useRouter();

  const supabase = useMemo(getSupabaseBrowserClient, []);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [attachments, setAttachments] = useState<AttachmentDraft[]>(initialAttachments);
  const [previewMode, setPreviewMode] = useState(false);
  const [routePath, setRoutePath] = useState<Array<{ lat: number; lon: number }>>([]);
  const [uploadError, setUploadError] = useState<string>('');

  const onUploadRoutePath = async (file: File) => {
    setUploadError('');
    if (!file) return;
    const { points, error } = await parseRouteFile(file);
    if (error) {
      setUploadError(error);
      setRoutePath([]);
    } else {
      setRoutePath(points);
    }
  };

  const clearPath = () => {
    setRoutePath([]);
    setUploadError('');
  };

  const [isPending, startTransition] = useTransition();

  const formDefaults: RouteFormValues = useMemo(

    () => ({

      display_name: route?.display_name ?? '',

      slug: route?.slug ?? '',

      color: route?.color ?? '#0ea5e9',

      corridors: route?.corridors ?? [],

      operator_ids: route?.operator_ids ?? [],

      est_buses: route?.est_buses ?? null,

      hours: route?.hours ?? null,

      notes: route?.notes ?? null,

      status: (route?.status as RouteFormValues['status']) ?? 'draft',

      origin_terminal_id: route?.origin_terminal_id ?? null,

      destination_terminal_id: route?.destination_terminal_id ?? null,

      review_notes: route?.review_notes ?? null,

      stops: initialStops,

      fares: initialFares

    }),

    [initialFares, initialStops, route]

  );

  const terminalOptions = useMemo(

    () => [...terminals].sort((a, b) => a.name.localeCompare(b.name)),

    [terminals]

  );

  const formMethods = useForm<RouteFormValues>({

    resolver: zodResolver(RouteSchema),

    mode: 'onBlur',

    defaultValues: formDefaults

  });

  const [initialLeftName, initialRightName] = useMemo<[string, string]>(() => {

    const source = formDefaults.display_name?.trim() ?? '';

    if (!source) return ['Side A', 'Side B'];

    const parts = source

      .split(/[-/]/)

      .map((segment) => segment.trim())

      .filter(Boolean);

    if (parts.length >= 2) {

      return [parts[0], parts[1]];

    }

    if (parts.length === 1) {

      return [parts[0], ''];

    }

    return ['Side A', 'Side B'];

  }, [formDefaults.display_name]);

  const {

    control,

    register,

    handleSubmit,

    watch,

    setValue,

    getValues,

    formState: { errors, isSubmitting }

  } = formMethods;

  const stopFieldArray = useFieldArray({ control, name: 'stops' });

  const fareFieldArray = useFieldArray({ control, name: 'fares' });

  const stops = watch('stops');

  const handleDragEnd = useCallback(

    (result: DropResult) => {

      if (!result.destination) return;

      stopFieldArray.move(result.source.index, result.destination.index);

    },

    [stopFieldArray]

  );

  const handleAddExistingStop = useCallback(

    (stop: Pick<Tables<'stops'>, 'id' | 'name' | 'lat' | 'lng' | 'ward' | 'name_aliases'>) => {

      const alreadyAdded = getValues('stops').some((entry) => entry.stop_id === stop.id);

      if (alreadyAdded) return;

      stopFieldArray.append({

        id: crypto.randomUUID(),

        local_id: crypto.randomUUID(),

        stop_id: stop.id,

        name: stop.name,

        lat: stop.lat,

        lng: stop.lng,

        ward: stop.ward,

        name_aliases: stop.name_aliases ?? []

      });

    },

    [getValues, stopFieldArray]

  );

  const handleCreateStop = useCallback(

    (stop: { name: string; lat: number; lng: number; ward?: string | null; name_aliases: string[] }) => {

      stopFieldArray.append({

        id: crypto.randomUUID(),

        local_id: crypto.randomUUID(),

        name: stop.name,

        stop_id: undefined,

        lat: stop.lat,

        lng: stop.lng,

        ward: stop.ward ?? null,

        name_aliases: stop.name_aliases

      });

    },

    [stopFieldArray]

  );

  const handleRemoveStop = useCallback(

    (index: number) => {

      const stop = getValues(`stops.${index}`);

      stopFieldArray.remove(index);

      const updatedFares = getValues('fares').filter(

        (fare) =>

          fare.from_stop_ref !== (stop.stop_id ?? stop.local_id) &&

          fare.to_stop_ref !== (stop.stop_id ?? stop.local_id)

      );

      setValue('fares', updatedFares);

    },

    [getValues, setValue, stopFieldArray]

  );

  const handleMapAdd = useCallback(

    ({ lat, lng }: { lat: number; lng: number }) => {

      const name = window.prompt('Stop name');

      if (!name) return;

      handleCreateStop({ name, lat, lng, name_aliases: [] });

    },

    [handleCreateStop]

  );

  const corridorInput = watch('corridors').join(', ');

  const handleCorridorsChange = (value: string) => {

    const parts = value

      .split(',')

      .map((corridor) => corridor.trim())

      .filter(Boolean);

    setValue('corridors', parts);

  };

  const selectedColor = watch('color');



  const onSubmit: SubmitHandler<RouteFormValues> = async (values) => {

    setStatusMessage(null);

    const newStops = values.stops.filter((stop) => !stop.stop_id);

    const stopIdMap = new Map<string, string>();

    if (newStops.length) {

      const { data, error } = await supabase

        .from('stops')

        .insert(

          newStops.map((stop) => ({

            slug: generateStopSlug(stop.name),

            name: stop.name,

            description: null,

            lat: stop.lat,

            lng: stop.lng,

            ward: stop.ward,

            name_aliases: stop.name_aliases,

            status: 'draft'

          }))

        )

        .select('id,name');

      if (error) {

        setStatusMessage(`Failed to save new stops: ${error.message}`);

        return;

      }

      data?.forEach((row, index) => {

        stopIdMap.set(newStops[index].local_id, row.id);

      });

    }

    values.stops.forEach((stop) => {

      if (stop.stop_id) {

        stopIdMap.set(stop.local_id, stop.stop_id!);

      }

    });

    const orderedStops = values.stops.map((stop) => ({

      ...stop,

      stop_id: stop.stop_id ?? stopIdMap.get(stop.local_id)

    }));

    if (orderedStops.some((stop) => !stop.stop_id)) {

      setStatusMessage('One or more stops could not be resolved to database IDs.');

      return;

    }

    const startStopId = orderedStops[0]?.stop_id ?? null;

    const endStopId = orderedStops[orderedStops.length - 1]?.stop_id ?? null;

    const originTerminalId = values.origin_terminal_id && values.origin_terminal_id.length > 0 ? values.origin_terminal_id : null;

    const destinationTerminalId = values.destination_terminal_id && values.destination_terminal_id.length > 0 ? values.destination_terminal_id : null;

    const reviewNotes = values.review_notes?.trim() ? values.review_notes.trim() : null;

    const payload = {

      display_name: values.display_name,

      slug: values.slug,

      color: values.color.startsWith('#') ? values.color : `#${values.color}`,

      corridors: values.corridors,

      operator_ids: values.operator_ids,

      est_buses: values.est_buses,

      hours: values.hours,

      notes: values.notes,

      status: values.status,

      origin_terminal_id: originTerminalId,

      destination_terminal_id: destinationTerminalId,

      review_notes: reviewNotes,

      start_stop_id: startStopId,

      end_stop_id: endStopId

    };

    let routeId = route?.id ?? null;

    if (routeId) {

      const { error } = await supabase.from('routes').update(payload).eq('id', routeId);

      if (error) {

        setStatusMessage(`Failed to update route: ${error.message}`);

        return;

      }

    } else {

      const { data, error } = await supabase

        .from('routes')

        .insert(payload)

        .select('id')

        .single();

      if (error || !data) {

        setStatusMessage(`Failed to create route: ${error?.message ?? 'unknown error'}`);

        return;

      }

      routeId = data.id;

    }

    if (!routeId) {

      setStatusMessage('Route ID missing after save.');

      return;

    }

    await supabase.from('route_stops').delete().eq('route_id', routeId);

    const routeStopsPayload = orderedStops.map((stop, index) => ({

      route_id: routeId!,

      stop_id: stop.stop_id!,

      seq: index + 1

    }));

    if (routeStopsPayload.length) {

      const { error } = await supabase.from('route_stops').insert(routeStopsPayload);

      if (error) {

        setStatusMessage(`Failed to sync route stops: ${error.message}`);

        return;

      }

    }

    await supabase

      .from('route_terminals')

      .delete()

      .eq('route_id', routeId)

      .in('role', ['origin', 'terminus']);

    const terminalLinkCandidates = [

      originTerminalId

        ? { route_id: routeId!, terminal_id: originTerminalId, role: 'origin' as const, notes: null }

        : null,

      destinationTerminalId

        ? { route_id: routeId!, terminal_id: destinationTerminalId, role: 'terminus' as const, notes: null }

        : null

    ];

    const terminalLinks = terminalLinkCandidates.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

    if (terminalLinks.length) {

      const { error } = await supabase.from('route_terminals').insert(terminalLinks);

      if (error) {

        setStatusMessage(`Failed to sync terminals: ${error.message}`);

        return;

      }

    }

    await supabase.from('fares').delete().eq('route_id', routeId);

    if (values.fares.length) {

      const faresPayload = values.fares.map((fare) => ({

        route_id: routeId!,

        passenger_type: fare.passenger_type,

        price_tzs: fare.price_tzs,

        note: fare.note,

        from_stop_id: stopIdMap.get(fare.from_stop_ref) ?? fare.from_stop_ref,

        to_stop_id: stopIdMap.get(fare.to_stop_ref) ?? fare.to_stop_ref

      }));

      const { error } = await supabase.from('fares').insert(faresPayload);

      if (error) {

        setStatusMessage(`Failed to sync fares: ${error.message}`);

        return;

      }

    }

    const toDelete = attachments

      .filter((attachment) => attachment.markedForDeletion && attachment.id)

      .map((attachment) => attachment.id!);

    if (toDelete.length) {

      await supabase.from('attachments').delete().in('id', toDelete);

    }

    const toInsert = attachments.filter(

      (attachment) => attachment.status === 'new' && !attachment.markedForDeletion

    );

    if (toInsert.length) {

      const { error } = await supabase

        .from('attachments')

        .insert(

          toInsert.map((attachment) => ({

            route_id: routeId!,

            file_path: attachment.file_path,

            kind: attachment.kind,

            caption: attachment.caption

          }))

        );

      if (error) {

        setStatusMessage(`Failed to save attachments: ${error.message}`);

        return;

      }

    }

    const toUpdate = attachments.filter(

      (attachment) => attachment.status === 'persisted' && !attachment.markedForDeletion && attachment.id

    );

    for (const attachment of toUpdate) {

      await supabase

        .from('attachments')

        .update({ caption: attachment.caption, kind: attachment.kind })

        .eq('id', attachment.id);

    }

    setStatusMessage('Saved!');

    startTransition(() => {

      router.refresh();

      router.push(`/dashboard/routes/${routeId}`);

    });

  };

  const isBusy = isSubmitting || isPending;

  const watchedValues = watch();
  const pathMeta = useMemo(() => ({ count: routePath.length }), [routePath]);

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white px-6 py-4 border-b rounded-lg border-slate-200">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            Preview Route
          </h1>
          <button
            type="button"
            className="px-4 py-2 border rounded-md hover:bg-slate-50 flex items-center gap-2 text-sm font-medium"
            onClick={() => setPreviewMode(false)}
          >
            <Eye size={16} /> Back to Editor
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-xl font-semibold text-brand-dark">
            {watchedValues.slug || '00'} - {watchedValues.display_name || 'Route Name'}
          </h2>
          <p className="text-sm text-slate-600">
            Via {watchedValues.corridors?.join(', ') || 'main roads'}
          </p>
          <p className="text-sm text-slate-700">
            Operating Hours: {watchedValues.hours || 'N/A'}
          </p>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2 text-slate-800">Stops on this route:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              {watchedValues.stops?.map((s, i) => (
                <li key={i}>
                  {s.name || `Stop ${i + 1}`} ({s.lat?.toFixed(4) || 'lat'}, {s.lng?.toFixed(4) || 'lon'})
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <MapIcon size={16} /> Route path preview
              {pathMeta.count ? <span className="ml-1">• {pathMeta.count} points</span> : null}
            </div>
            <PathPreview points={routePath} />
            {uploadError ? <div className="mt-2 text-xs text-rose-600">{uploadError}</div> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white px-6 py-4 border-b rounded-lg border-slate-200">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          {mode === 'create' ? 'New Route' : 'Edit Route'}
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-4 py-2 border rounded-md hover:bg-slate-50 flex items-center gap-2 text-sm font-medium"
            onClick={() => setPreviewMode(true)}
          >
            <Eye size={16} /> Preview
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isBusy}
            className="px-4 py-2 bg-brand-dark text-white rounded-md hover:bg-brand-dark/90 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            <Save size={16} /> {isBusy ? 'Saving...' : 'Save Route'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Route Details</h2>
            <p className="text-sm text-slate-500 mb-6">
              Manage metadata, stops, fares, and attachments.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Display name
                <input
                  type="text"
                  {...register('display_name')}
                  className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                />
                {errors.display_name && (
                  <span className="mt-1 block text-xs text-red-600">
                    {(errors.display_name as { message?: string })?.message}
                  </span>
                )}
              </label>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Slug
                <input
                  type="text"
                  {...register('slug')}
                  className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                  placeholder="kivukoni-to-udsm"
                />
                {errors.slug && (
                  <span className="mt-1 block text-xs text-red-600">
                    {(errors.slug as { message?: string })?.message}
                  </span>
                )}
              </label>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Color
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="color"
                    {...register('color')}
                    className="h-10 w-16 rounded border border-slate-300"
                  />
                  <div className="flex items-center gap-1">
                    {DEFAULT_ROUTE_COLORS.map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        style={{ backgroundColor: preset }}
                        onClick={() => setValue('color', preset)}
                        className="h-6 w-6 rounded-full border border-white shadow"
                      />
                    ))}
                  </div>
                </div>
              </label>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Corridors
                <input
                  type="text"
                  value={corridorInput}
                  onChange={(event) => handleCorridorsChange(event.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                  placeholder="BRT, UDSM"
                />
              </label>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Operators
                <select
                  multiple
                  {...register('operator_ids')}
                  className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                >
                  {operators.map((operator) => (
                    <option key={operator.id} value={operator.id}>
                      {operator.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Status
                <select
                  {...register('status')}
                  className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                >
                  {WORKFLOW_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Origin
                <select
                  {...register('origin_terminal_id')}
                  className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                >
                  <option value="">Select terminal</option>
                  {terminalOptions.map((terminal) => (
                    <option key={terminal.id} value={terminal.id}>
                      {terminal.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Destination
                <select
                  {...register('destination_terminal_id')}
                  className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                >
                  <option value="">Select terminal</option>
                  {terminalOptions.map((terminal) => (
                    <option key={terminal.id} value={terminal.id}>
                      {terminal.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Est. Buses
                <input
                  type="number"
                  min={0}
                  {...register('est_buses', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                />
              </label>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Hours
                <input
                  type="text"
                  {...register('hours')}
                  className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                  placeholder="05:30 - 22:00"
                />
              </label>

              <label className="md:col-span-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Notes
                <textarea
                  rows={3}
                  {...register('notes')}
                  className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                />
              </label>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <MapEditor stops={stops} color={selectedColor} onMapAdd={handleMapAdd} />
              <StopPicker
                disabledIds={stops.map((stop) => stop.stop_id).filter(Boolean) as string[]}
                onSelect={handleAddExistingStop}
                onCreate={handleCreateStop}
              />
            </div>
            <div className="space-y-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="stops">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-700">Stops</h3>
                        <p className="text-xs text-slate-500">Drag to reorder</p>
                      </div>
                      {stops.map((stop, index) => (
                        <Draggable key={stop.id} draggableId={stop.id} index={index}>
                          {(draggableProvided) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              className="space-y-2 rounded border border-slate-200 bg-slate-50 p-3"
                            >
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span>#{index + 1} • {stop.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStop(index)}
                                  className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="grid gap-2 md:grid-cols-2">
                                <label className="text-xs font-medium text-slate-600">
                                  Name
                                  <input
                                    type="text"
                                    {...register(`stops.${index}.name` as const)}
                                    disabled={Boolean(stop.stop_id)}
                                    className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand disabled:bg-slate-200"
                                  />
                                </label>
                                <label className="text-xs font-medium text-slate-600">
                                  Lat
                                  <input
                                    type="number"
                                    step="0.000001"
                                    {...register(`stops.${index}.lat` as const, { valueAsNumber: true })}
                                    className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                                  />
                                </label>
                                <label className="text-xs font-medium text-slate-600">
                                  Lng
                                  <input
                                    type="number"
                                    step="0.000001"
                                    {...register(`stops.${index}.lng` as const, { valueAsNumber: true })}
                                    className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                                  />
                                </label>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <FaresEditor
                control={control}
                register={register}
                fields={fareFieldArray.fields}
                append={fareFieldArray.append}
                remove={fareFieldArray.remove}
                stops={stops}
              />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-900">Route split badge</h2>
            <div className="mt-4">
              <RouteSplitBadgeDesigner
                key={route?.id ?? 'new'}
                defaultLeftName={initialLeftName}
                defaultRightName={initialRightName}
                defaultViaText="via"
              />
            </div>
          </section>

          <Upload attachments={attachments} onChange={setAttachments} routeId={route?.id ?? undefined} />
        </div>

        {/* Right Column - Upload & Tips */}
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <UploadIcon size={18} className="text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Upload Route Path</h2>
            </div>
            <p className="text-xs text-slate-600 flex items-start gap-2">
              <Info size={14} className="shrink-0 mt-0.5" />
              <span>
                Upload a <strong>.kml</strong> (from Google Earth / OSM) or a <strong>.csv</strong> containing <em>lat,lon</em> columns.
              </span>
            </p>
            <input
              type="file"
              accept=".kml,.csv"
              onChange={(e) => onUploadRoutePath(e.target.files?.[0] as File)}
              className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border file:border-slate-300 file:bg-white hover:file:bg-slate-50"
            />
            {routePath.length > 0 && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-slate-700">Loaded <b>{routePath.length}</b> points</span>
                <button
                  type="button"
                  onClick={clearPath}
                  className="inline-flex items-center gap-1 px-2 py-1 text-rose-600 hover:text-rose-700"
                >
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            )}
            {uploadError ? <div className="text-xs text-rose-600">{uploadError}</div> : null}
            <div className="mt-2">
              <PathPreview points={routePath} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-3 text-sm text-slate-600">
            <div className="text-slate-800 font-semibold">Tips</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Start and end stops define route direction.</li>
              <li>Use accurate coordinates to improve map precision.</li>
              <li>CSV headers can be <code>lat,lon</code> or <code>latitude,longitude</code>.</li>
              <li>Click preview to visualize your route page design.</li>
            </ul>
          </div>

          {statusMessage && (
            <div className="rounded-md bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-700">{statusMessage}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );



}
