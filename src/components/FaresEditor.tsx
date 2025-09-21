'use client';

import { useMemo } from 'react';
import {
  type Control,
  type FieldArrayWithId,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  type UseFormRegister
} from 'react-hook-form';
import type { RouteFormValues, StopFormValue } from './RouteEditor.types';

interface FaresEditorProps {
  control: Control<RouteFormValues>;
  register: UseFormRegister<RouteFormValues>;
  fields: FieldArrayWithId<RouteFormValues, 'fares', 'id'>[];
  append: UseFieldArrayAppend<RouteFormValues, 'fares'>;
  remove: UseFieldArrayRemove;
  stops: StopFormValue[];
  errors?: Record<string, unknown>;
}

const PASSENGER_TYPES = ['adult', 'student', 'child', 'senior'];

export function FaresEditor({
  fields,
  append,
  remove,
  stops,
  register
}: FaresEditorProps) {
  const options = useMemo(
    () =>
      stops.map((stop, index) => ({
        value: stop.stop_id ?? stop.local_id,
        label: `${index + 1}. ${stop.name}`
      })),
    [stops]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Fares</h3>
        <button
          type="button"
          onClick={() =>
            append({
              from_stop_ref: options[0]?.value ?? '',
              to_stop_ref: options[options.length - 1]?.value ?? '',
              passenger_type: 'adult',
              price_tzs: 0,
              note: ''
            })
          }
          className="rounded bg-brand-dark px-2 py-1 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={options.length < 2}
        >
          Add fare
        </button>
      </div>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-6"
          >
            <label className="flex flex-col text-xs font-medium text-slate-600 md:col-span-2">
              From
              <select
                {...register(`fares.${index}.from_stop_ref` as const)}
                className="mt-1 rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-xs font-medium text-slate-600 md:col-span-2">
              To
              <select
                {...register(`fares.${index}.to_stop_ref` as const)}
                className="mt-1 rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-xs font-medium text-slate-600">
              Passenger
              <select
                {...register(`fares.${index}.passenger_type` as const)}
                className="mt-1 rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
              >
                {PASSENGER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-xs font-medium text-slate-600">
              Price (TZS)
              <input
                type="number"
                min={0}
                step={100}
                {...register(`fares.${index}.price_tzs` as const, { valueAsNumber: true })}
                className="mt-1 rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
              />
            </label>

            <label className="md:col-span-5 flex flex-col text-xs font-medium text-slate-600">
              Note
              <input
                type="text"
                {...register(`fares.${index}.note` as const)}
                className="mt-1 rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
              />
            </label>

            <div className="flex items-center justify-end md:col-span-1">
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {!fields.length && (
          <p className="text-xs text-slate-500">Add fares to describe passenger segments.</p>
        )}
      </div>
    </div>
  );
}
