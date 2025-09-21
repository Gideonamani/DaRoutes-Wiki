'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';
import type { Tables } from '@/lib/types';

type ExistingStop = Pick<Tables<'stops'>, 'id' | 'name' | 'lat' | 'lng' | 'ward' | 'name_aliases'>;

interface NewStopInput {
  name: string;
  lat: number;
  lng: number;
  ward?: string | null;
  name_aliases: string[];
}

interface StopPickerProps {
  disabledIds?: string[];
  onSelect: (stop: ExistingStop) => void;
  onCreate: (stop: NewStopInput) => void;
}

export function StopPicker({ disabledIds = [], onSelect, onCreate }: StopPickerProps) {
  const supabase = useMemo(getSupabaseBrowserClient, []);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExistingStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newStop, setNewStop] = useState<NewStopInput>({
    name: '',
    lat: 0,
    lng: 0,
    ward: '',
    name_aliases: []
  });

  useEffect(() => {
    const controller = new AbortController();
    async function runSearch() {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('stops')
        .select('id,name,lat,lng,ward,name_aliases')
        .or(`name.ilike.%${query}%,ward.ilike.%${query}%`)
        .limit(10);
      if (err) {
        setError(err.message);
      } else {
        const filtered = (data ?? []).filter((stop) => {
          const aliases = stop.name_aliases ?? [];
          const aliasMatch = aliases.some((alias) =>
            alias.toLowerCase().includes(query.toLowerCase())
          );
          return aliasMatch || true;
        });
        setResults(filtered);
      }
      setLoading(false);
    }
    runSearch();
    return () => controller.abort();
  }, [query, supabase]);

  const canSaveNewStop =
    newStop.name.trim().length > 1 &&
    Number.isFinite(newStop.lat) &&
    Number.isFinite(newStop.lng);

  const handleCreate = useCallback(() => {
    if (!canSaveNewStop) return;
    onCreate({
      name: newStop.name.trim(),
      lat: Number(newStop.lat),
      lng: Number(newStop.lng),
      ward: newStop.ward?.trim() || null,
      name_aliases: newStop.name_aliases
    });
    setNewStop({
      name: '',
      lat: 0,
      lng: 0,
      ward: '',
      name_aliases: []
    });
  }, [canSaveNewStop, newStop, onCreate]);

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700">Search stops</label>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Stop name or ward"
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand"
        />
        {loading && <p className="mt-2 text-xs text-slate-500">Searching…</p>}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <ul className="mt-3 space-y-2 text-sm">
          {results.map((stop) => {
            const disabled = disabledIds.includes(stop.id);
            return (
              <li
                key={stop.id}
                className="flex items-center justify-between rounded border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div>
                  <p className="font-semibold text-slate-800">{stop.name}</p>
                  <p className="text-xs text-slate-500">
                    {stop.lat.toFixed(5)}, {stop.lng.toFixed(5)} · {stop.ward ?? '—'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(stop)}
                  disabled={disabled}
                  className="rounded bg-brand-dark px-3 py-1 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {disabled ? 'Added' : 'Add'}
                </button>
              </li>
            );
          })}
          {!loading && !results.length && query.length >= 2 && (
            <li className="rounded border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-500">
              No matches. Create a new stop below.
            </li>
          )}
        </ul>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-700">Create a new stop</h3>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-slate-600">
            Name
            <input
              type="text"
              value={newStop.name}
              onChange={(event) => setNewStop((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            Ward
            <input
              type="text"
              value={newStop.ward ?? ''}
              onChange={(event) => setNewStop((prev) => ({ ...prev, ward: event.target.value }))}
              className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            Latitude
            <input
              type="number"
              value={newStop.lat}
              step="0.000001"
              onChange={(event) =>
                setNewStop((prev) => ({ ...prev, lat: Number(event.target.value) }))
              }
              className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            Longitude
            <input
              type="number"
              value={newStop.lng}
              step="0.000001"
              onChange={(event) =>
                setNewStop((prev) => ({ ...prev, lng: Number(event.target.value) }))
              }
              className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
            />
          </label>
          <label className="sm:col-span-2 text-xs font-medium text-slate-600">
            Aliases (comma separated)
            <input
              type="text"
              value={newStop.name_aliases.join(', ')}
              onChange={(event) =>
                setNewStop((prev) => ({
                  ...prev,
                  name_aliases: event.target.value
                    .split(',')
                    .map((alias) => alias.trim())
                    .filter(Boolean)
                }))
              }
              className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={!canSaveNewStop}
          className="mt-3 inline-flex items-center rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Save new stop
        </button>
      </div>
    </div>
  );
}
