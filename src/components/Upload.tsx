'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';
import type { AttachmentDraft } from './RouteEditor.types';

interface UploadProps {
  attachments: AttachmentDraft[];
  onChange: (attachments: AttachmentDraft[]) => void;
  routeId?: string;
  bucket?: string;
}

const KIND_OPTIONS = [
  { value: 'ticket', label: 'Ticket' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'map', label: 'Map' },
  { value: 'document', label: 'Document' }
];

export function Upload({
  attachments,
  onChange,
  routeId,
  bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'route-media'
}: UploadProps) {
  const supabase = useMemo(getSupabaseBrowserClient, []);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;

    const newAttachments: AttachmentDraft[] = [];
    for (const file of Array.from(files)) {
      const extension = file.name.split('.').pop();
      const objectPath = `routes/${routeId ?? 'drafts'}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from(bucket).upload(objectPath, file, {
        cacheControl: '3600',
        upsert: false
      });
      if (error) {
        console.error(error);
        continue;
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      newAttachments.push({
        file_path: objectPath,
        kind: 'ticket',
        caption: '',
        publicUrl: data.publicUrl,
        status: 'new'
      });
    }
    if (newAttachments.length) {
      onChange([...attachments, ...newAttachments]);
    }
    event.target.value = '';
  }

  function updateAttachment(index: number, patch: Partial<AttachmentDraft>) {
    onChange(
      attachments.map((attachment, idx) =>
        idx === index ? { ...attachment, ...patch } : attachment
      )
    );
  }

  function toggleRemoval(index: number) {
    onChange(
      attachments.map((attachment, idx) =>
        idx === index
          ? {
              ...attachment,
              markedForDeletion: !attachment.markedForDeletion
            }
          : attachment
      )
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Attachments</h3>
          <p className="text-xs text-slate-500">
            Upload ticket scans, vehicle photos, or supporting documents.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center rounded bg-brand-dark px-3 py-1.5 text-xs font-semibold text-white">
          Upload
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <ul className="space-y-3">
        {attachments.map((attachment, index) => (
          <li
            key={attachment.id ?? attachment.file_path}
            className={clsx(
              'grid gap-3 rounded border border-slate-200 bg-slate-50 p-3 md:grid-cols-6',
              attachment.markedForDeletion && 'border-red-200 bg-red-50 text-red-600'
            )}
          >
            <div className="md:col-span-2">
              {attachment.publicUrl ? (
                <Image
                  src={attachment.publicUrl}
                  alt={attachment.caption ?? attachment.kind}
                  width={160}
                  height={120}
                  className="h-28 w-full rounded object-cover"
                />
              ) : (
                <div className="flex h-28 w-full items-center justify-center rounded bg-white text-xs text-slate-500">
                  {attachment.file_path}
                </div>
              )}
            </div>

            <label className="md:col-span-2 text-xs font-medium text-slate-600">
              Caption
              <input
                type="text"
                value={attachment.caption ?? ''}
                onChange={(event) => updateAttachment(index, { caption: event.target.value })}
                className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
              />
            </label>

            <label className="text-xs font-medium text-slate-600">
              Kind
              <select
                value={attachment.kind}
                onChange={(event) => updateAttachment(index, { kind: event.target.value })}
                className="mt-1 w-full rounded-md border-slate-300 text-sm focus:border-brand focus:ring-brand"
              >
                {KIND_OPTIONS.map((kind) => (
                  <option key={kind.value} value={kind.value}>
                    {kind.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end justify-end">
              <button
                type="button"
                onClick={() => toggleRemoval(index)}
                className={clsx(
                  'rounded px-3 py-1 text-xs font-semibold',
                  attachment.markedForDeletion
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-100 text-red-600'
                )}
              >
                {attachment.markedForDeletion ? 'Keep' : 'Remove'}
              </button>
            </div>
          </li>
        ))}
        {!attachments.length && (
          <li className="rounded border border-dashed border-slate-200 p-4 text-xs text-slate-500">
            No attachments yet.
          </li>
        )}
      </ul>
    </div>
  );
}
