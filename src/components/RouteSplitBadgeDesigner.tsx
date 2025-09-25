'use client';

import { useMemo, useRef, useState } from 'react';
import domToImage from 'dom-to-image-more';

const WIDTH = 800;
const HEIGHT = 100;
const MAX_STRIPES = 3;

const DEFAULT_LEFT_COLORS = ['#0f172a'];
const DEFAULT_RIGHT_COLORS = ['#dc2626'];

type SideKey = 'left' | 'right';

type RouteSplitBadgeDesignerProps = {
  defaultLeftName?: string;
  defaultRightName?: string;
  defaultViaText?: string;
  width?: number;
  height?: number;
};

function sanitizeLabel(label: string) {
  return label.trim();
}

function renderVerticalStripes(colors: string[]) {
  const widthPerStripe = colors.length ? 100 / colors.length : 100;
  return colors.map((color, index) => (
    <div key={`${color}-${index}`} className="h-full" style={{ width: `${widthPerStripe}%`, backgroundColor: color }} />
  ));
}

export function RouteSplitBadgeDesigner({
  defaultLeftName = 'Side A',
  defaultRightName = 'Side B',
  defaultViaText = 'via',
  width = WIDTH,
  height = HEIGHT
}: RouteSplitBadgeDesignerProps) {
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const [leftName, setLeftName] = useState(defaultLeftName);
  const [rightName, setRightName] = useState(defaultRightName);
  const [viaText, setViaText] = useState(defaultViaText);
  const [leftColors, setLeftColors] = useState<string[]>(DEFAULT_LEFT_COLORS);
  const [rightColors, setRightColors] = useState<string[]>(DEFAULT_RIGHT_COLORS);
  const [textColor, setTextColor] = useState('#ffffff');
  const [centerBackground, setCenterBackground] = useState('#0f172a');

  const leftLabel = useMemo(() => sanitizeLabel(leftName), [leftName]);
  const rightLabel = useMemo(() => sanitizeLabel(rightName), [rightName]);
  const viaLines = useMemo(
    () => viaText.split('\n').map((line) => line.trim()).filter(Boolean),
    [viaText]
  );

  const addStripe = (side: SideKey) => {
    if (side === 'left') {
      if (leftColors.length >= MAX_STRIPES) return;
      setLeftColors((prev) => [...prev, '#94a3b8']);
    } else {
      if (rightColors.length >= MAX_STRIPES) return;
      setRightColors((prev) => [...prev, '#94a3b8']);
    }
  };

  const removeStripe = (side: SideKey, index: number) => {
    if (side === 'left') {
      if (leftColors.length <= 1) return;
      setLeftColors((prev) => prev.filter((_, i) => i !== index));
    } else {
      if (rightColors.length <= 1) return;
      setRightColors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateStripe = (side: SideKey, index: number, color: string) => {
    if (side === 'left') {
      setLeftColors((prev) => prev.map((existing, i) => (i === index ? color : existing)));
    } else {
      setRightColors((prev) => prev.map((existing, i) => (i === index ? color : existing)));
    }
  };

  const downloadPng = async () => {
    if (!badgeRef.current) return;
    try {
      const dataUrl = await domToImage.toPng(badgeRef.current, {
        bgcolor: 'transparent',
        width,
        height,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      const anchor = document.createElement('a');
      anchor.download = `${leftLabel || 'route'}-${rightLabel || 'split'}-${width}x${height}.png`;
      anchor.href = dataUrl;
      anchor.click();
    } catch (error) {
      console.error('Failed to export split badge', error);
      alert("Couldn't export the image. Try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500" htmlFor="left-name">
              Left side name
            </label>
            <input
              id="left-name"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              value={leftName}
              onChange={(event) => setLeftName(event.target.value)}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Left stripes</span>
              <button
                type="button"
                onClick={() => addStripe('left')}
                disabled={leftColors.length >= MAX_STRIPES}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add stripe
              </button>
            </div>
            <div className="space-y-2">
              {leftColors.map((color, index) => (
                <div key={`left-${index}`} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    aria-label={`Left stripe ${index + 1}`}
                    className="h-9 w-16 cursor-pointer rounded border border-slate-200"
                    onChange={(event) => updateStripe('left', index, event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeStripe('left', index)}
                    disabled={leftColors.length <= 1}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500" htmlFor="right-name">
              Right side name
            </label>
            <input
              id="right-name"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              value={rightName}
              onChange={(event) => setRightName(event.target.value)}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Right stripes</span>
              <button
                type="button"
                onClick={() => addStripe('right')}
                disabled={rightColors.length >= MAX_STRIPES}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add stripe
              </button>
            </div>
            <div className="space-y-2">
              {rightColors.map((color, index) => (
                <div key={`right-${index}`} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    aria-label={`Right stripe ${index + 1}`}
                    className="h-9 w-16 cursor-pointer rounded border border-slate-200"
                    onChange={(event) => updateStripe('right', index, event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeStripe('right', index)}
                    disabled={rightColors.length <= 1}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase text-slate-500" htmlFor="via-text">
            Via roads (new line per entry)
          </label>
          <textarea
            id="via-text"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            rows={3}
            value={viaText}
            onChange={(event) => setViaText(event.target.value)}
          />
        </div>
        <div className="space-y-4">
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500">Text color</span>
            <input
              type="color"
              value={textColor}
              onChange={(event) => setTextColor(event.target.value)}
              className="mt-1 h-9 w-16 cursor-pointer rounded border border-slate-200"
            />
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500">Center background</span>
            <input
              type="color"
              value={centerBackground}
              onChange={(event) => setCenterBackground(event.target.value)}
              className="mt-1 h-9 w-16 cursor-pointer rounded border border-slate-200"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase text-slate-500">Preview ({width}×{height} px)</div>
        <div className="mt-2 inline-block rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div
            ref={badgeRef}
            style={{ width, height }}
            className="relative flex overflow-hidden rounded border border-slate-300"
          >
            <div className="flex h-full w-1/2">
              {renderVerticalStripes(leftColors)}
            </div>
            <div className="pointer-events-none absolute left-0 top-0 flex h-full w-1/2 flex-col items-center justify-center">
              <span className="font-daladala text-3xl uppercase tracking-widest" style={{ color: textColor }}>
                {leftLabel}
              </span>
            </div>
            <div className="flex h-full w-1/2">
              {renderVerticalStripes(rightColors)}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 flex h-full w-1/2 flex-col items-center justify-center">
              <span className="font-daladala text-3xl uppercase tracking-widest" style={{ color: textColor }}>
                {rightLabel}
              </span>
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 flex -translate-x-1/2 flex-col items-center justify-center gap-1 px-6"
              style={{ backgroundColor: centerBackground }}
            >
              {viaLines.length ? (
                viaLines.map((line, index) => (
                  <span
                    key={`via-${index}`}
                    className="font-daladala text-lg uppercase tracking-[0.35em]"
                    style={{ color: textColor }}
                  >
                    {line}
                  </span>
                ))
              ) : (
                <span className="font-daladala text-lg uppercase tracking-[0.35em]" style={{ color: textColor }}>
                  via
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={downloadPng}
          className="inline-flex items-center gap-2 rounded-md bg-brand-dark px-4 py-2 text-sm font-semibold text-white hover:bg-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          Export PNG ({width}×{height})
        </button>
      </div>
    </div>
  );
}
