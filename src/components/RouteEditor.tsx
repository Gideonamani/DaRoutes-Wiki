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
import { DEFAULT_ROUTE_COLORS, isReadableOn } from '@/lib/colors';
import { MapEditor } from './MapEditor';
import { StopPicker } from './StopPicker';
import { FaresEditor } from './FaresEditor';
import { Upload } from './Upload';
import { RouteSplitBadgeDesigner } from './RouteSplitBadgeDesigner';
import type { Tables } from '@/lib/types';
import type { AttachmentDraft, RouteFormValues, StopFormValue } from './RouteEditor.types';

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
  is_published: z.boolean(),
  stops: z.array(StopSchema).min(2, 'Need at least two stops'),
  fares: z.array(FareSchema)
});

type RouteEditorProps = {
  mode: 'create' | 'edit';
  route: Tables<'routes'> | null;
  operators: Pick<Tables<'operators'>, 'id' | 'name'>[];
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
  initialStops,
  initialFares,
  initialAttachments
}: RouteEditorProps) {
  const router = useRouter();
  const supabase = useMemo(getSupabaseBrowserClient, []);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<AttachmentDraft[]>(initialAttachments);
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
      is_published: route?.is_published ?? false,
      stops: initialStops,
      fares: initialFares
    }),
    [initialFares, initialStops, route]
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
  const colorIsReadable = isReadableOn(selectedColor, '#ffffff');

  const handleTogglePublish = () => {
    setValue('is_published', !getValues('is_published'));
  };

  const publishLabel = getValues('is_published') ? 'Unpublish' : 'Publish';

  const onSubmit: SubmitHandler<RouteFormValues> = async (values) => {
    setStatusMessage(null);

    const newStops = values.stops.filter((stop) => !stop.stop_id);
    const stopIdMap = new Map<string, string>();

    if (newStops.length) {
      const { data, error } = await supabase
        .from('stops')
        .insert(
          newStops.map((stop) => ({
            name: stop.name,
            lat: stop.lat,
            lng: stop.lng,
            ward: stop.ward,
            name_aliases: stop.name_aliases
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

    const payload = {
      display_name: values.display_name,
      slug: values.slug,
      color: values.color.startsWith('#') ? values.color : `#${values.color}`,
      corridors: values.corridors,
      operator_ids: values.operator_ids,
      est_buses: values.est_buses,
      hours: values.hours,
      notes: values.notes,
      is_published: values.is_published,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          {mode === 'create' ? 'Create route' : 'Edit route'}
        </h2>
        <p className="text-sm text-slate-500">
          Manage metadata, stops, fares, and attachments before publishing to the wiki.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
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
            {!colorIsReadable && (
              <span className="mt-1 block text-xs text-orange-600">
                Selected color may not meet WCAG contrast for white text.
              </span>
            )}
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Corridors (comma separated)
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
            Estimated buses
            <input
              type="number"
              min={0}
              {...register('est_buses', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Operating hours
            <input
              type="text"
              {...register('hours')}
              className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
              placeholder="05:30 – 22:00"
            />
          </label>
          <label className="md:col-span-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Notes
            <textarea
              rows={3}
              {...register('notes')}
              className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
              placeholder="Operational notes or service advisories"
            />
          </label>
        </div>
        <div className="mt-6 flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Publish status: {watch('is_published') ? 'Published' : 'Draft'}
            </p>
            <p className="text-xs text-slate-500">
              Published routes appear on the public wiki and JSON API.
            </p>
          </div>
          <button
            type="button"
            onClick={handleTogglePublish}
            className="rounded bg-brand-dark px-4 py-1.5 text-sm font-semibold text-white"
          >
            {publishLabel}
          </button>
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
                    <p className="text-xs text-slate-500">
                      Drag to reorder; existing stops are read-only.
                    </p>
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
                            <span>
                              #{index + 1} • {stop.name}
                            </span>
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
                              Ward
                              <input
                                type="text"
                                {...register(`stops.${index}.ward` as const)}
                                className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                              />
                            </label>
                            <label className="text-xs font-medium text-slate-600">
                              Latitude
                              <input
                                type="number"
                                step="0.000001"
                                {...register(`stops.${index}.lat` as const, { valueAsNumber: true })}
                                className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                              />
                            </label>
                            <label className="text-xs font-medium text-slate-600">
                              Longitude
                              <input
                                type="number"
                                step="0.000001"
                                {...register(`stops.${index}.lng` as const, { valueAsNumber: true })}
                                className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                              />
                            </label>
                            <label className="md:col-span-2 text-xs font-medium text-slate-600">
                              Aliases
                              <input
                                type="text"
                                value={stop.name_aliases.join(', ')}
                                onChange={(event) =>
                                  setValue(
                                    `stops.${index}.name_aliases` as const,
                                    event.target.value
                                      .split(',')
                                      .map((alias) => alias.trim())
                                      .filter(Boolean)
                                  )
                                }
                                className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
                                placeholder="CBD Gate, Ferry Stop"
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
        <p className="text-sm text-slate-500">Craft the daladala split bar and export it as a PNG for signage or docs.</p>
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

      {statusMessage && (
        <p className="text-sm font-semibold text-emerald-600">{statusMessage}</p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isBusy}
          className="rounded bg-brand-dark px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isBusy ? 'Saving…' : 'Save route'}
        </button>
      </div>
    </form>
  );
}
