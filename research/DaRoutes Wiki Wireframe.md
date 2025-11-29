![][image1]  
import React, { useState } from 'react';  
import { Search, Bus, Clock, CreditCard, Menu, X, User, Info, PlusCircle, LayoutDashboard, LogIn, Settings } from 'lucide-react';  
import { Card, CardContent } from '@/components/ui/card';

// \---------------------------------------------  
// Design System (palette \+ tokens)  
// \---------------------------------------------  
// Rationale:  
// \- Primary (teal) conveys trust & clarity for public transport  
// \- Accent (cyan) adds a tech-forward, fresh identity  
// \- High-contrast text grays for accessibility (WCAG \> 4.5)  
const PALETTE \= {  
  primary: '\#009688', // Teal 600  
  primaryDark: '\#00796B', // Teal 700  
  accent: '\#5CE1E6', // Cyan 400  
  bg: '\#F9FAFB',  
  surface: '\#FFFFFF',  
  text: '\#1F2937',  
  textMuted: '\#6B7280',  
  success: '\#00C49A',  
  error: '\#D32F2F',  
};

// Lightweight SVG map thumbnail to simulate a route preview without external embeds.  
// In production, replace with a static tiles image \+ polyline overlay (Mapbox Static Images or your own tile server),  
// or render a tiny Leaflet/MapLibre canvas.  
function MapPreview({ color \= '\#2B7FFF', secondary \= '\#00C49A' }: { color?: string; secondary?: string }) {  
  return (  
    \<svg viewBox="0 0 320 120" className="w-full h-24 rounded-md bg-gray-100"\>  
      {/\* faint road grid \*/}  
      \<defs\>  
        \<pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse"\>  
          \<path d="M 16 0 L 0 0 0 16" fill="none" stroke="\#e5e7eb" strokeWidth="1" /\>  
        \</pattern\>  
        \<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"\>  
          \<feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.25" /\>  
        \</filter\>  
      \</defs\>  
      \<rect x="0" y="0" width="320" height="120" fill="url(\#grid)" /\>

      {/\* terminal markers \*/}  
      \<g filter="url(\#shadow)"\>  
        \<circle cx="24" cy="96" r="6" fill={secondary} /\>  
        \<circle cx="296" cy="24" r="6" fill={secondary} /\>  
      \</g\>

      {/\* route polyline \*/}  
      \<polyline  
        points="24,96 80,84 112,72 140,68 168,60 196,48 228,40 260,32 296,24"  
        fill="none"  
        stroke={color}  
        strokeWidth="4"  
        strokeLinejoin="round"  
        strokeLinecap="round"  
      /\>  
    \</svg\>  
  );  
}

export default function DARoutesHomepage() {  
  const \[menuOpen, setMenuOpen\] \= useState(false);

  const routes \= \[  
    {  
      id: 1,  
      name: 'T/Nyuki \- Gerezani',  
      via: 'via Bagamoyo Road, Muhimbili Road',  
      color: '\#2B7FFF',  
      secondary: '\#00C49A',  
      number: '14',  
      time: '05:00 \- 21:00',  
      fare: 'TSh 750'  
    },  
    {  
      id: 2,  
      name: 'Mabibo \- M/mBusho',  
      via: 'via Kawawa Road, Morogoro Road',  
      color: '\#7C3AED',  
      secondary: '\#00C49A',  
      number: '14',  
      time: '05:00 \- 21:00',  
      fare: 'TSh 750'  
    },  
    {  
      id: 3,  
      name: 'T/Nyuki \- M/mBusho',  
      via: 'via Bagamoyo Road',  
      color: '\#EF4444',  
      secondary: '\#00C49A',  
      number: '14',  
      time: '05:00 \- 21:00',  
      fare: 'TSh 750'  
    }  
  \];

  return (  
    \<div className="min-h-screen" style={{ backgroundColor: PALETTE.bg, color: PALETTE.text }}\>  
      {/\* Header \*/}  
      \<header className="flex items-center justify-between px-4 md:px-6 py-4 shadow-sm"  
        style={{ backgroundColor: PALETTE.primary, color: '\#ffffff' }}\>  
        \<div className="flex items-center gap-3"\>  
          {/\* Hamburger (always visible) \*/}  
          \<button  
            aria-label="Open menu"  
            onClick={() \=\> setMenuOpen(true)}  
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"  
            style={{ backgroundColor: 'transparent' }}  
          \>  
            \<Menu size={22} className="opacity-90" /\>  
          \</button\>  
          \<h1 className="text-2xl font-semibold tracking-wide"\>DARoutes\</h1\>  
        \</div\>

        {/\* Right-side actions: visible on md+; collapse into menu on mobile \*/}  
        \<nav className="hidden md:flex items-center gap-6 text-sm font-medium"\>  
          \<a href="\#explainer" className="hover:underline/50 opacity-95"\>Explainer\</a\>  
          \<a href="\#login" className="hover:underline/50 opacity-95"\>Login\</a\>  
        \</nav\>  
      \</header\>

      {/\* Mobile Sidebar Menu \*/}  
      \<div className={\`fixed inset-0 z-50 ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}\`}\>  
        {/\* Backdrop \*/}  
        \<div  
          onClick={() \=\> setMenuOpen(false)}  
          className={\`absolute inset-0 transition-opacity ${menuOpen ? 'opacity-40' : 'opacity-0'}\`}  
          style={{ backgroundColor: '\#000' }}  
          aria-hidden  
        /\>  
        {/\* Drawer \*/}  
        \<aside  
          className={\`absolute left-0 top-0 h-full w-72 bg-white shadow-xl transition-transform duration-200 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}\`}  
        \>  
          \<div className="flex items-center justify-between px-4 py-3 border-b"\>  
            \<div className="flex items-center gap-2"\>  
              \<Menu size={18} className="text-gray-500" /\>  
              \<span className="font-semibold"\>Menu\</span\>  
            \</div\>  
            \<button aria-label="Close menu" onClick={() \=\> setMenuOpen(false)} className="p-1 rounded hover:bg-gray-100"\>  
              \<X size={18} /\>  
            \</button\>  
          \</div\>  
          \<nav className="p-2 text-sm"\>  
            \<a href="\#home" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"\>\<LayoutDashboard size={16}/\> Home\</a\>  
            \<a href="\#dashboard" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"\>\<LayoutDashboard size={16}/\> My Dashboard\</a\>  
            \<a href="\#contribute" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"\>\<PlusCircle size={16}/\> Contribute a Route\</a\>  
            \<a href="\#explainer" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"\>\<Info size={16}/\> Explainer\</a\>  
            \<a href="\#login" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"\>\<LogIn size={16}/\> Login\</a\>  
            \<a href="\#profile" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"\>\<User size={16}/\> Profile\</a\>  
            \<a href="\#settings" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"\>\<Settings size={16}/\> Settings\</a\>  
          \</nav\>  
        \</aside\>  
      \</div\>

      {/\* Search Bar \*/}  
      \<div className="flex justify-center mt-8 px-4"\>  
        \<div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm px-4 py-2 w-full md:w-3/5 lg:w-1/2 max-w-2xl"\>  
          \<Search className="text-gray-400 mr-2" size={18} /\>  
          \<input  
            type="text"  
            placeholder="Search routes, stops, or terminals..."  
            className="w-full outline-none text-sm text-gray-700"  
          /\>  
        \</div\>  
      \</div\>

      {/\* Filters \*/}  
      \<div className="flex justify-center mt-4 gap-2 md:gap-4 text-sm" style={{ color: PALETTE.textMuted }}\>  
        \<button className="px-3 md:px-4 py-1 bg-white border rounded-full hover:bg-teal-50"\>All Routes\</button\>  
        \<button className="px-3 md:px-4 py-1 bg-white border rounded-full hover:bg-teal-50"\>By Fare\</button\>  
        \<button className="px-3 md:px-4 py-1 bg-white border rounded-full hover:bg-teal-50"\>By Terminal\</button\>  
      \</div\>

      {/\* Routes Grid \*/}  
      \<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 mt-8 md:mt-10"\>  
        {routes.map((route) \=\> (  
          \<Card key={route.id} className="hover:shadow-md transition-shadow cursor-pointer border border-gray-100"\>  
            \<div className="flex items-center justify-between p-4 border-b"\>  
              \<div\>  
                \<h2 className="font-semibold text-lg" style={{ color: PALETTE.text }}\>{route.name}\</h2\>  
                \<p className="text-sm" style={{ color: PALETTE.textMuted }}\>{route.via}\</p\>  
              \</div\>  
              \<div className="flex gap-1"\>  
                \<div className="h-4 w-4 rounded-sm" style={{ backgroundColor: route.color }}\>\</div\>  
                \<div className="h-4 w-4 rounded-sm" style={{ backgroundColor: route.secondary }}\>\</div\>  
              \</div\>  
            \</div\>  
            \<CardContent className="p-4 flex flex-col gap-2"\>  
              {/\* Map Preview (SVG) \*/}  
              \<div className="overflow-hidden rounded-md"\>  
                \<MapPreview color={route.color} secondary={route.secondary} /\>  
              \</div\>  
              \<div className="flex justify-between text-sm mt-2" style={{ color: PALETTE.textMuted }}\>  
                \<span className="flex items-center gap-1"\>\<Bus size={14} /\> {route.number}\</span\>  
                \<span className="flex items-center gap-1"\>\<Clock size={14} /\> {route.time}\</span\>  
                \<span className="flex items-center gap-1"\>\<CreditCard size={14} /\> {route.fare}\</span\>  
              \</div\>  
            \</CardContent\>  
          \</Card\>  
        ))}  
      \</section\>

      {/\* Footer \*/}  
      \<footer className="mt-12 md:mt-16 text-center text-sm py-6 border-t" style={{ color: PALETTE.textMuted, backgroundColor: PALETTE.surface }}\>  
        \<p\>DARoutes © {new Date().getFullYear()} — Mapping Dar es Salaam’s Public Transport Network\</p\>  
        \<p\>Design palette: Primary {PALETTE.primary}, Accent {PALETTE.accent}\</p\>  
      \</footer\>  
    \</div\>  
  );  
}

![][image2]  
![][image3]  
import React from "react";  
import { CheckCircle, AlertTriangle } from "lucide-react";

// DARoutes Design Palette Showcase  
// Material Design 3 inspired \+ WCAG-aware tokens  
const TOKENS \= \[  
  { role: "Primary (Teal 600)", hex: "\#009688", rationale: "Feels calm, modern, and trustworthy — fits public transport, signals clarity and purpose." },  
  { role: "Primary Variant (Teal 700)", hex: "\#00796B", rationale: "Used for hover states and dark accents (like footer or active nav)." },  
  { role: "Accent (Cyan 400)", hex: "\#5CE1E6", rationale: "Injects freshness and tech-forward energy — gives DARoutes its distinct ‘digital clarity.’" },  
  { role: "Background", hex: "\#F9FAFB", rationale: "Modern, clean base that allows route cards to pop." },  
  { role: "Surface (Card background)", hex: "\#FFFFFF", rationale: "Neutral tone for cards; maintains focus on content." },  
  { role: "Text Primary", hex: "\#1F2937", rationale: "Near-black gray for comfort and legibility." },  
  { role: "Text Secondary", hex: "\#6B7280", rationale: "Subtle gray for descriptions." },  
  { role: "Error", hex: "\#D32F2F", rationale: "High visibility; for form feedback or network error states." },  
  { role: "Success", hex: "\#00C49A", rationale: "Reinforces optimism and growth — aligns with routes and connectivity theme." },  
\];

// Utility to pick white/black text for legibility (approx luminance)  
function bestText(hex: string) {  
  const c \= hex.replace('\#','');  
  const r \= parseInt(c.slice(0,2),16), g \= parseInt(c.slice(2,4),16), b \= parseInt(c.slice(4,6),16);  
  const luminance \= 0.299\*r \+ 0.587\*g \+ 0.114\*b; // 0..255  
  return luminance \> 160 ? '\#111827' : '\#FFFFFF';  
}

function Swatch({ role, hex, rationale }: { role: string; hex: string; rationale: string }) {  
  const textColor \= bestText(hex);  
  return (  
    \<div className="rounded-2xl overflow-hidden shadow-sm border bg-white"\>  
      \<div className="h-24 flex items-end p-3" style={{ backgroundColor: hex, color: textColor }}\>  
        \<div className="text-sm font-semibold tracking-wide"\>{hex}\</div\>  
      \</div\>  
      \<div className="p-4"\>  
        \<div className="text-sm font-semibold text-gray-900"\>{role}\</div\>  
        \<div className="text-sm text-gray-600 mt-1"\>{rationale}\</div\>  
      \</div\>  
    \</div\>  
  );  
}

function ContrastChip({ label, bg, fg }: { label: string; bg: string; fg: string }) {  
  return (  
    \<div className="rounded-lg p-3 text-sm font-medium shadow-sm border" style={{ backgroundColor: bg, color: fg }}\>  
      {label}  
    \</div\>  
  );  
}

export default function PaletteShowcase() {  
  return (  
    \<div className="min-h-screen bg-gray-50 text-gray-800"\>  
      \<header className="px-6 py-5 border-b bg-white"\>  
        \<h1 className="text-2xl font-semibold"\>DARoutes — Design Palette\</h1\>  
        \<p className="text-sm text-gray-600 mt-1"\>Material Design 3 inspired, tuned for WCAG legibility and the realities of outdoor mobile use.\</p\>  
      \</header\>

      {/\* Swatches \*/}  
      \<section className="px-6 py-8"\>  
        \<h2 className="text-lg font-semibold mb-4"\>Core Tokens\</h2\>  
        \<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"\>  
          {TOKENS.map((t) \=\> (  
            \<Swatch key={t.role} role={t.role} hex={t.hex} rationale={t.rationale} /\>  
          ))}  
        \</div\>  
      \</section\>

      {/\* Usage guidance \*/}  
      \<section className="px-6 pb-6"\>  
        \<h2 className="text-lg font-semibold mb-3"\>Usage Guidelines\</h2\>  
        \<div className="grid grid-cols-1 lg:grid-cols-3 gap-5"\>  
          \<div className="rounded-xl border bg-white p-4"\>  
            \<div className="font-semibold mb-2"\>Primary / Variant\</div\>  
            \<ul className="list-disc list-inside text-sm text-gray-700 space-y-1"\>  
              \<li\>\<span className="font-medium"\>Header, active nav, primary buttons.\</span\>\</li\>  
              \<li\>Hover/pressed states use the variant (Teal 700).\</li\>  
              \<li\>Avoid over-using on large areas beyond header/hero.\</li\>  
            \</ul\>  
          \</div\>  
          \<div className="rounded-xl border bg-white p-4"\>  
            \<div className="font-semibold mb-2"\>Accent\</div\>  
            \<ul className="list-disc list-inside text-sm text-gray-700 space-y-1"\>  
              \<li\>Use for highlights: chips, pills, small indicators.\</li\>  
              \<li\>Prefer subtlety; accent should not compete with content.\</li\>  
            \</ul\>  
          \</div\>  
          \<div className="rounded-xl border bg-white p-4"\>  
            \<div className="font-semibold mb-2"\>Background / Surface / Text\</div\>  
            \<ul className="list-disc list-inside text-sm text-gray-700 space-y-1"\>  
              \<li\>Background keeps the UI airy (\#F9FAFB); cards on \#FFFFFF.\</li\>  
              \<li\>Text primary on most content; secondary for metadata.\</li\>  
              \<li\>Respect minimum sizes: 16px body, 13–14px meta.\</li\>  
            \</ul\>  
          \</div\>  
        \</div\>  
      \</section\>

      {/\* Contrast demonstrations \*/}  
      \<section className="px-6 pb-10"\>  
        \<h2 className="text-lg font-semibold mb-3"\>Contrast Demos\</h2\>  
        \<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"\>  
          \<div className="rounded-xl border bg-white p-4 space-y-3"\>  
            \<div className="text-sm font-semibold text-gray-800 mb-1"\>Primary Button\</div\>  
            \<div className="flex items-center gap-2"\>  
              \<ContrastChip label="Button" bg="\#009688" fg="\#FFFFFF" /\>  
              \<CheckCircle className="text-emerald-600" size={16} /\>  
              \<span className="text-xs text-gray-600"\>Meets contrast on light surfaces\</span\>  
            \</div\>  
          \</div\>  
          \<div className="rounded-xl border bg-white p-4 space-y-3"\>  
            \<div className="text-sm font-semibold text-gray-800 mb-1"\>Accent on White\</div\>  
            \<div className="flex items-center gap-2"\>  
              \<ContrastChip label="Chip" bg="\#5CE1E6" fg="\#111827" /\>  
              \<AlertTriangle className="text-amber-500" size={16} /\>  
              \<span className="text-xs text-gray-600"\>Use for small UI accents; avoid long text\</span\>  
            \</div\>  
          \</div\>  
          \<div className="rounded-xl border bg-white p-4 space-y-3"\>  
            \<div className="text-sm font-semibold text-gray-800 mb-1"\>Text on Background\</div\>  
            \<div className="flex items-center gap-2"\>  
              \<ContrastChip label="Body" bg="\#F9FAFB" fg="\#1F2937" /\>  
              \<CheckCircle className="text-emerald-600" size={16} /\>  
              \<span className="text-xs text-gray-600"\>Comfortable reading contrast\</span\>  
            \</div\>  
          \</div\>  
        \</div\>  
      \</section\>

      \<footer className="px-6 py-8 border-t bg-white text-sm text-gray-600"\>  
        \<div\>  
          \<span className="font-medium"\>Design Principles: \</span\>  
          Contrast ≥ 4.5 for body text; accent sparingly; consistent spacing (8px grid); generous hit targets.  
        \</div\>  
        \<div className="mt-1"\>Future: define dark theme tokens; semantic tokens (primary/secondary/tertiary) map to brand colors.\</div\>  
      \</footer\>  
    \</div\>  
  );  
}

![][image4]  
![][image5]  
import React, { useMemo, useState, useEffect } from "react";  
import {  
  ArrowLeft,  
  Clock,  
  CreditCard,  
  MapPin,  
  Navigation2,  
  Users,  
  Camera,  
  Bus,  
  Ticket,  
  Play,  
  Pause,  
  ChevronRight,  
  ChevronLeft,  
  ExternalLink,  
  CheckCircle,  
  XCircle,  
} from "lucide-react";  
import { Card, CardContent } from "@/components/ui/card";

// \---------------------------------------------  
// Palette (kept consistent with homepage)  
// \---------------------------------------------  
const PALETTE \= {  
  primary: "\#009688",  
  primaryDark: "\#00796B",  
  accent: "\#5CE1E6",  
  bg: "\#F9FAFB",  
  surface: "\#FFFFFF",  
  text: "\#1F2937",  
  textMuted: "\#6B7280",  
  passed: "\#D1D5DB", // for passed segments  
};

// \---------------------------------------------  
// Demo route data  
// \---------------------------------------------  
const ROUTE \= {  
  id: "route-14",  
  name: "T/Nyuki – Gerezani",  
  code: "14",  
  color: "\#2B7FFF",  
  origin: "Tandale/Nyuki",  
  destination: "Gerezani",  
  via: \["Bagamoyo Rd", "Muhimbili Rd"\],  
  time: { start: "05:00", end: "21:00" },  
  headways: \[  
    { label: "Weekday Peak", window: "06:30–09:00", headwayMin: 8 },  
    { label: "Off-Peak", window: "09:00–16:00", headwayMin: 12 },  
    { label: "Evening Peak", window: "16:00–19:30", headwayMin: 10 },  
  \],  
  operators: \[  
    { id: "op-1", name: "Ubungo Line Sacco", brandColor: "\#2563EB" },  
    { id: "op-2", name: "Dar Rapid Coasters", brandColor: "\#F59E0B" },  
    { id: "op-3", name: "Mtaa Express", brandColor: "\#10B981" },  
  \],  
  stages: \[  
    { id: 1, name: "T/Nyuki", lat: \-6.775, lon: 39.236, busy: "06:30–08:30" },  
    { id: 2, name: "Mwenge", lat: \-6.765, lon: 39.24, busy: "07:00–09:00" },  
    { id: 3, name: "Kijitonyama", lat: \-6.761, lon: 39.246, busy: "07:30–09:30" },  
    { id: 4, name: "Muhimbili", lat: \-6.801, lon: 39.27, busy: "12:00–14:00" },  
    { id: 5, name: "Posta", lat: \-6.816, lon: 39.287, busy: "16:00–18:00" },  
    { id: 6, name: "Gerezani", lat: \-6.829, lon: 39.295, busy: "17:30–19:30" },  
  \],  
  fares: {  
    currency: "TZS",  
    peakMultiplier: 1.0,  
    offpeakMultiplier: 0.9,  
    table: \[  
      { from: 1, to: 2, price: 400 },  
      { from: 2, to: 3, price: 400 },  
      { from: 3, to: 4, price: 400 },  
      { from: 4, to: 5, price: 500 },  
      { from: 5, to: 6, price: 600 },  
    \],  
  },  
  photos: \[  
    { id: "p1", caption: "Bus at Mwenge", url: "" },  
    { id: "p2", caption: "Stage at Muhimbili", url: "" },  
    { id: "p3", caption: "Approaching Gerezani", url: "" },  
  \],  
};

// \---------------------------------------------  
// Map preview with progress states (passed/current/upcoming)  
// \---------------------------------------------  
function RouteMap({  
  color \= "\#2B7FFF",  
  totalStops,  
  currentIndex,  
}: {  
  color?: string;  
  totalStops: number;  
  currentIndex: number;  
}) {  
  const width \= 800;  
  const height \= 320;  
  const start \= { x: 60, y: 260 };  
  const end \= { x: 740, y: 60 };

  const pts \= Array.from({ length: totalStops }, (\_, i) \=\> {  
    const t \= i / (totalStops \- 1);  
    const x \= start.x \+ (end.x \- start.x) \* t;  
    const y \= start.y \+ (end.y \- start.y) \* t \- Math.sin(t \* Math.PI) \* 30;  
    return { x, y };  
  });

  const segs \= pts.slice(0, \-1).map((p, i) \=\> ({ a: p, b: pts\[i \+ 1\], i }));

  return (  
    \<svg viewBox={\`0 0 ${width} ${height}\`} className="w-full h-64 md:h-80 rounded-xl bg-gray-100"\>  
      \<defs\>  
        \<pattern id="grid32" width="32" height="32" patternUnits="userSpaceOnUse"\>  
          \<path d="M 32 0 L 0 0 0 32" fill="none" stroke="\#e5e7eb" strokeWidth="1" /\>  
        \</pattern\>  
        \<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"\>  
          \<feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.25" /\>  
        \</filter\>  
      \</defs\>  
      \<rect x={0} y={0} width={width} height={height} fill="url(\#grid32)" /\>

      {segs.map(({ a, b, i }) \=\> {  
        const isPassed \= i \< currentIndex \- 1;  
        const isCurrent \= i \=== currentIndex \- 1;  
        const stroke \= isPassed ? PALETTE.passed : color;  
        const dash \= isCurrent ? "6,6" : "0";  
        return (  
          \<line  
            key={i}  
            x1={a.x}  
            y1={a.y}  
            x2={b.x}  
            y2={b.y}  
            stroke={stroke}  
            strokeWidth={isCurrent ? 6 : 5}  
            strokeDasharray={dash}  
            strokeLinecap="round"  
          /\>  
        );  
      })}

      {pts.map((p, i) \=\> {  
        const isPassed \= i \< currentIndex;  
        const isCurrent \= i \=== currentIndex;  
        const fill \= isCurrent ? color : isPassed ? PALETTE.passed : "\#111827";  
        return (  
          \<g key={i}\>  
            \<circle cx={p.x} cy={p.y} r={isCurrent ? 7 : 5} fill={fill} /\>  
            {isCurrent && (  
              \<circle cx={p.x} cy={p.y} r={12} fill="none" stroke={color} strokeWidth={2} opacity={0.6} /\>  
            )}  
          \</g\>  
        );  
      })}  
    \</svg\>  
  );  
}

// \---------------------------------------------  
// Ticket mock components (design only)  
// \---------------------------------------------  
const Perforation \= () \=\> (  
  \<div className="relative w-full h-0.5 border-t border-dashed border-gray-300 my-2" /\>  
);

const QRPlaceholder \= () \=\> (  
  \<div className="grid grid-cols-5 grid-rows-5 gap-0.5"\>  
    {Array.from({ length: 25 }).map((\_, i) \=\> (  
      \<div key={i} className={\`${i % 2 \=== 0 ? "bg-gray-900" : "bg-gray-200"} w-2 h-2\`} /\>  
    ))}  
  \</div\>  
);

function DigitalTicket({ operatorName, brandColor }: { operatorName: string; brandColor: string }) {  
  return (  
    \<div className="rounded-2xl border shadow-sm overflow-hidden bg-white"\>  
      \<div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: brandColor, color: "\#fff" }}\>  
        \<div className="text-sm font-semibold tracking-wide"\>DARoutes Ticket\</div\>  
        \<div className="text-xs opacity-90"\>Operator: {operatorName}\</div\>  
      \</div\>  
      \<div className="p-4"\>  
        \<div className="flex items-center justify-between text-sm"\>  
          \<div\>  
            \<div className="text-gray-500"\>Route\</div\>  
            \<div className="font-semibold"\>  
              {ROUTE.name} ({ROUTE.code})  
            \</div\>  
          \</div\>  
          \<div className="text-right"\>  
            \<div className="text-gray-500"\>Valid\</div\>  
            \<div className="font-semibold"\>Today • {ROUTE.time.start}–{ROUTE.time.end}\</div\>  
          \</div\>  
        \</div\>  
        \<Perforation /\>  
        \<div className="grid grid-cols-3 gap-3 text-sm"\>  
          \<div\>  
            \<div className="text-gray-500"\>From\</div\>  
            \<div className="font-medium"\>{ROUTE.origin}\</div\>  
          \</div\>  
          \<div\>  
            \<div className="text-gray-500"\>To\</div\>  
            \<div className="font-medium"\>{ROUTE.destination}\</div\>  
          \</div\>  
          \<div className="text-right"\>  
            \<div className="text-gray-500"\>Fare\</div\>  
            \<div className="font-semibold"\>{ROUTE.fares.currency} 750\</div\>  
          \</div\>  
        \</div\>  
        \<div className="mt-4 flex items-center justify-between"\>  
          \<div className="text-xs text-gray-500"\>  
            Sample design — fares are governed by city rules; styling may vary by operator.  
          \</div\>  
          \<div className="text-\[10px\] text-gray-500"\>No refund • Non-transferable\</div\>  
        \</div\>  
        \<div className="mt-3 flex justify-end"\>  
          \<QRPlaceholder /\>  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
}

function TicketGallery({ operators }: { operators: { id: string; name: string; brandColor: string }\[\] }) {  
  return (  
    \<div className="grid grid-cols-2 gap-3"\>  
      {operators.map((op) \=\> (  
        \<div key={op.id} className="rounded-xl border overflow-hidden bg-white"\>  
          \<div className="h-2" style={{ backgroundColor: op.brandColor }} /\>  
          \<div className="p-3"\>  
            \<div className="text-xs text-gray-500"\>Operator\</div\>  
            \<div className="text-sm font-medium mb-2"\>{op.name}\</div\>  
            \<div className="aspect-video rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500"\>  
              Ticket style placeholder  
            \</div\>  
          \</div\>  
        \</div\>  
      ))}  
    \</div\>  
  );  
}

// \---------------------------------------------  
// Stop drawer (click a stop to open)  
// \---------------------------------------------  
function StopDrawer({ open, onClose, stop }: { open: boolean; onClose: () \=\> void; stop: any }) {  
  return (  
    \<div className={\`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}\`}\>  
      \<div  
        className={\`absolute inset-0 ${open ? "opacity-40" : "opacity-0"} transition-opacity\`}  
        style={{ background: "\#000" }}  
        onClick={onClose}  
      /\>  
      \<div  
        className={\`absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-2xl transition-transform duration-200 ${  
          open ? "translate-y-0" : "translate-y-full"  
        }\`}  
      \>  
        \<div className="p-4"\>  
          \<div className="h-1 w-10 bg-gray-200 rounded mx-auto mb-3" /\>  
          \<div className="flex items-center justify-between mb-2"\>  
            \<div\>  
              \<div className="text-xs text-gray-500"\>Stop\</div\>  
              \<div className="text-lg font-semibold"\>{stop?.name}\</div\>  
            \</div\>  
            \<a href="\#/stops/placeholder" className="text-sm text-teal-700 inline-flex items-center gap-1"\>  
              Open stop page \<ExternalLink size={14} /\>  
            \</a\>  
          \</div\>  
          \<div className="grid grid-cols-3 gap-3 text-sm"\>  
            \<div\>  
              \<div className="text-gray-500"\>Lat\</div\>  
              \<div className="font-medium"\>{stop?.lat?.toFixed(4)}\</div\>  
            \</div\>  
            \<div\>  
              \<div className="text-gray-500"\>Lon\</div\>  
              \<div className="font-medium"\>{stop?.lon?.toFixed(4)}\</div\>  
            \</div\>  
            \<div\>  
              \<div className="text-gray-500"\>Busy\</div\>  
              \<div className="font-medium"\>{stop?.busy}\</div\>  
            \</div\>  
          \</div\>  
          \<div className="mt-3 text-xs text-gray-600"\>  
            Routes here: \<span className="font-medium"\>14, 15B\</span\> • Nearby: pharmacy, cafe  
          \</div\>  
          \<div className="mt-4 grid grid-cols-3 gap-2"\>  
            \<div className="aspect-video rounded-lg bg-gray-100" /\>  
            \<div className="aspect-video rounded-lg bg-gray-100" /\>  
            \<div className="aspect-video rounded-lg bg-gray-100" /\>  
          \</div\>  
          \<div className="mt-4 text-right"\>  
            \<button onClick={onClose} className="px-3 py-2 text-sm rounded-md border hover:bg-gray-50"\>  
              Close  
            \</button\>  
          \</div\>  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
}

// \---------------------------------------------  
// Stage selector \+ fare calculator  
// \---------------------------------------------  
function StageSelector({  
  stages,  
  value,  
  onChange,  
}: {  
  stages: { id: number; name: string }\[\];  
  value: { from: number; to: number };  
  onChange: (v: { from: number; to: number }) \=\> void;  
}) {  
  const fromId \= "stage-from";  
  const toId \= "stage-to";  
  return (  
    \<div className="grid grid-cols-2 gap-3"\>  
      \<div\>  
        \<label className="text-xs text-gray-600" htmlFor={fromId}\>  
          From  
        \</label\>  
        \<select  
          id={fromId}  
          value={value.from}  
          onChange={(e) \=\> onChange({ ...value, from: Number(e.target.value) })}  
          className="mt-1 w-full rounded-md border px-2 py-2 text-sm"  
        \>  
          {stages.map((s) \=\> (  
            \<option key={s.id} value={s.id}\>  
              {s.id}. {s.name}  
            \</option\>  
          ))}  
        \</select\>  
      \</div\>  
      \<div\>  
        \<label className="text-xs text-gray-600" htmlFor={toId}\>  
          To  
        \</label\>  
        \<select  
          id={toId}  
          value={value.to}  
          onChange={(e) \=\> onChange({ ...value, to: Number(e.target.value) })}  
          className="mt-1 w-full rounded-md border px-2 py-2 text-sm"  
        \>  
          {stages.map((s) \=\> (  
            \<option key={s.id} value={s.id}\>  
              {s.id}. {s.name}  
            \</option\>  
          ))}  
        \</select\>  
      \</div\>  
    \</div\>  
  );  
}

function FareCalculator({ peak, stages, fares }: { peak: boolean; stages: any\[\]; fares: any }) {  
  const \[sel, setSel\] \= useState\<{ from: number; to: number }\>({  
    from: stages\[1\].id, // demo defaults Mwenge  
    to: stages\[2\].id, // demo defaults Kijitonyama  
  });

  const price \= useMemo(() \=\> {  
    const \[a, b\] \= \[Math.min(sel.from, sel.to), Math.max(sel.from, sel.to)\];  
    const base \= fares.table  
      .filter((r: any) \=\> r.from \>= a && r.to \<= b)  
      .reduce((sum: number, r: any) \=\> sum \+ r.price, 0);  
    const mult \= peak ? fares.peakMultiplier : fares.offpeakMultiplier;  
    return Math.round(base \* mult);  
  }, \[sel, fares, peak\]);

  return (  
    \<div\>  
      \<StageSelector stages={stages} value={sel} onChange={setSel} /\>  
      \<div className="mt-3 flex items-center justify-between"\>  
        \<div className="text-sm text-gray-600"\>Estimated Fare ({peak ? "Peak" : "Off-peak"})\</div\>  
        \<div className="text-lg font-semibold"\>  
          {fares.currency} {price.toLocaleString()}  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
}

// \---------------------------------------------  
// (Dev) Minimal UI test panel to catch regressions early  
// \---------------------------------------------  
function DevTests({ route, currentIndex }: { route: typeof ROUTE; currentIndex: number }) {  
  const tests \= \[  
    {  
      name: "currentIndex within bounds",  
      pass: currentIndex \>= 0 && currentIndex \< route.stages.length,  
    },  
    {  
      name: "fare table non-empty",  
      pass: Array.isArray(route.fares.table) && route.fares.table.length \> 0,  
    },  
    {  
      name: "operators exist",  
      pass: route.operators.length \>= 1,  
    },  
  \];  
  return (  
    \<div className="mt-6 p-4 rounded-xl border bg-white"\>  
      \<div className="text-sm font-semibold mb-2"\>Dev Checks\</div\>  
      \<ul className="text-sm space-y-1"\>  
        {tests.map((t) \=\> (  
          \<li key={t.name} className="flex items-center gap-2"\>  
            {t.pass ? \<CheckCircle size={14} className="text-emerald-600" /\> : \<XCircle size={14} className="text-rose-600" /\>}  
            \<span\>{t.name}\</span\>  
          \</li\>  
        ))}  
      \</ul\>  
    \</div\>  
  );  
}

// \---------------------------------------------  
// Page  
// \---------------------------------------------  
export default function RoutePage() {  
  // Demo: show we are between Mwenge (idx 1\) and Kijitonyama (idx 2\)  
  const \[currentIndex, setCurrentIndex\] \= useState(2);  
  const \[tracking, setTracking\] \= useState(false);  
  const \[peak, setPeak\] \= useState(true);  
  const \[activeTab, setActiveTab\] \= useState\<"digital" | "gallery"\>("digital");  
  const \[drawerOpen, setDrawerOpen\] \= useState(false);  
  const \[drawerStop, setDrawerStop\] \= useState\<any\>(null);

  // simple demo tracker: auto-advance every 3s when enabled  
  useEffect(() \=\> {  
    if (\!tracking) return;  
    if (currentIndex \>= ROUTE.stages.length \- 1\) return;  
    const t \= setInterval(() \=\> setCurrentIndex((i) \=\> Math.min(i \+ 1, ROUTE.stages.length \- 1)), 3000);  
    return () \=\> clearInterval(t);  
  }, \[tracking, currentIndex\]);

  const openStop \= (idx: number) \=\> {  
    setDrawerStop(ROUTE.stages\[idx\]);  
    setDrawerOpen(true);  
  };

  return (  
    \<div className="min-h-screen" style={{ backgroundColor: PALETTE.bg, color: PALETTE.text }}\>  
      {/\* Top bar \*/}  
      \<div className="px-4 md:px-6 py-4 flex items-center gap-3 bg-white border-b"\>  
        \<button className="p-2 rounded-md hover:bg-gray-100" aria-label="Back"\>  
          \<ArrowLeft size={18} /\>  
        \</button\>  
        \<div\>  
          \<div className="text-xs text-gray-500"\>Route\</div\>  
          \<h1 className="text-xl md:text-2xl font-semibold"\>  
            {ROUTE.name} \<span className="text-gray-400"\>({ROUTE.code})\</span\>  
          \</h1\>  
          \<div className="text-sm text-gray-600"\>via {ROUTE.via.join(", ")}\</div\>  
        \</div\>  
      \</div\>

      {/\* Content \*/}  
      \<div className="px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6"\>  
        {/\* Left column \*/}  
        \<div className="lg:col-span-2 space-y-6"\>  
          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="flex items-center justify-between mb-2"\>  
                \<div className="text-sm text-gray-600"\>  
                  Live Route Preview  
                  \<span className="ml-2 inline-flex items-center text-\[11px\] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200"\>  
                    Demo: between Mwenge → Kijitonyama  
                  \</span\>  
                \</div\>  
                \<div className="flex items-center gap-2"\>  
                  \<button  
                    onClick={() \=\> setCurrentIndex((i) \=\> Math.max(i \- 1, 0))}  
                    className="p-1 rounded border hover:bg-gray-50"  
                    aria-label="Prev stop"  
                  \>  
                    \<ChevronLeft size={16} /\>  
                  \</button\>  
                  {tracking ? (  
                    \<button  
                      onClick={() \=\> setTracking(false)}  
                      className="px-2 py-1 rounded-full border bg-white inline-flex items-center gap-1 text-xs"  
                    \>  
                      \<Pause size={14} /\> Pause  
                    \</button\>  
                  ) : (  
                    \<button  
                      onClick={() \=\> setTracking(true)}  
                      className="px-2 py-1 rounded-full border bg-white inline-flex items-center gap-1 text-xs"  
                    \>  
                      \<Play size={14} /\> Track my route  
                    \</button\>  
                  )}  
                  \<button  
                    onClick={() \=\> setCurrentIndex((i) \=\> Math.min(i \+ 1, ROUTE.stages.length \- 1))}  
                    className="p-1 rounded border hover:bg-gray-50"  
                    aria-label="Next stop"  
                  \>  
                    \<ChevronRight size={16} /\>  
                  \</button\>  
                \</div\>  
              \</div\>

              \<RouteMap color={ROUTE.color} totalStops={ROUTE.stages.length} currentIndex={currentIndex} /\>  
              \<div className="mt-3 flex items-center gap-3 text-sm" style={{ color: PALETTE.textMuted }}\>  
                \<MapPin size={16} /\>  
                \<span\>{ROUTE.stages\[0\].name}\</span\>  
                \<Navigation2 size={14} className="opacity-60" /\>  
                \<span\>{ROUTE.stages\[ROUTE.stages.length \- 1\].name}\</span\>  
              \</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="flex items-center justify-between"\>  
                \<div className="font-semibold"\>Stages & Stops\</div\>  
                \<div className="text-xs" style={{ color: PALETTE.textMuted }}\>  
                  Passed \= gray • Current leg \= dotted • Upcoming \= solid  
                \</div\>  
              \</div\>  
              \<ol className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2"\>  
                {ROUTE.stages.map((s, idx) \=\> {  
                  const isPassed \= idx \< currentIndex;  
                  const isCurrent \= idx \=== currentIndex;  
                  return (  
                    \<li  
                      key={s.id}  
                      onClick={() \=\> openStop(idx)}  
                      className={\`px-3 py-2 rounded-lg border text-sm flex items-center gap-2 cursor-pointer transition ${  
                        isCurrent ? "bg-teal-50 border-teal-200" : "bg-white hover:bg-gray-50"  
                      }\`}  
                    \>  
                      \<span  
                        className={\`inline-flex h-5 w-5 items-center justify-center rounded-full text-white text-xs\`}  
                        style={{ backgroundColor: isPassed ? PALETTE.passed : ROUTE.color }}  
                      \>  
                        {idx \+ 1}  
                      \</span\>  
                      \<span className={\`${isPassed ? "text-gray-400 line-through" : ""}\`}\>{s.name}\</span\>  
                    \</li\>  
                  );  
                })}  
              \</ol\>  
            \</CardContent\>  
          \</Card\>  
        \</div\>

        {/\* Right column \*/}  
        \<div className="space-y-6"\>  
          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4 space-y-4"\>  
              \<div className="flex items-center justify-between"\>  
                \<div className="font-semibold flex items-center gap-2"\>  
                  \<CreditCard size={16} /\> Fare Estimator  
                \</div\>  
                \<div className="flex items-center gap-2 text-xs"\>  
                  \<button  
                    onClick={() \=\> setPeak(true)}  
                    className={\`px-3 py-1 rounded-full border ${peak ? "bg-teal-600 text-white border-transparent" : "bg-white"}\`}  
                  \>  
                    Peak  
                  \</button\>  
                  \<button  
                    onClick={() \=\> setPeak(false)}  
                    className={\`px-3 py-1 rounded-full border ${\!peak ? "bg-teal-600 text-white border-transparent" : "bg-white"}\`}  
                  \>  
                    Off-peak  
                  \</button\>  
                \</div\>  
              \</div\>  
              \<FareCalculator peak={peak} stages={ROUTE.stages} fares={ROUTE.fares} /\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="font-semibold flex items-center gap-2"\>  
                \<Clock size={16} /\> Typical Headways  
              \</div\>  
              \<ul className="mt-2 space-y-2"\>  
                {ROUTE.headways.map((h) \=\> (  
                  \<li key={h.label} className="flex items-center justify-between text-sm"\>  
                    \<span className="text-gray-700"\>  
                      {h.label} \<span className="text-gray-500"\>({h.window})\</span\>  
                    \</span\>  
                    \<span className="font-medium"\>{h.headwayMin} min\</span\>  
                  \</li\>  
                ))}  
              \</ul\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="font-semibold flex items-center gap-2"\>  
                \<Users size={16} /\> Operators  
              \</div\>  
              \<div className="mt-2 flex flex-wrap gap-2"\>  
                {ROUTE.operators.map((op) \=\> (  
                  \<span key={op.id} className="px-3 py-1 rounded-full border text-sm bg-white hover:bg-teal-50"\>  
                    {op.name}  
                  \</span\>  
                ))}  
              \</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="font-semibold flex items-center gap-2"\>  
                \<Camera size={16} /\> Photos  
              \</div\>  
              \<div className="mt-2 grid grid-cols-3 gap-2"\>  
                {ROUTE.photos.map((p) \=\> (  
                  \<div key={p.id} className="aspect-video rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-600"\>  
                    {p.caption}  
                  \</div\>  
                ))}  
              \</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="flex items-center justify-between"\>  
                \<div className="font-semibold"\>  
                  \<Ticket size={16} className="inline mr-2" /\> Tickets  
                \</div\>  
                \<div className="text-xs flex border rounded-full overflow-hidden"\>  
                  \<button  
                    onClick={() \=\> setActiveTab("digital")}  
                    className={\`px-3 py-1 ${activeTab \=== "digital" ? "bg-teal-600 text-white" : "bg-white"}\`}  
                  \>  
                    Digital Sample  
                  \</button\>  
                  \<button  
                    onClick={() \=\> setActiveTab("gallery")}  
                    className={\`px-3 py-1 ${activeTab \=== "gallery" ? "bg-teal-600 text-white" : "bg-white"}\`}  
                  \>  
                    Operator Gallery  
                  \</button\>  
                \</div\>  
              \</div\>  
              \<div className="mt-3"\>  
                {activeTab \=== "digital" ? (  
                  \<DigitalTicket operatorName={ROUTE.operators\[0\].name} brandColor={ROUTE.operators\[0\].brandColor} /\>  
                ) : (  
                  \<TicketGallery operators={ROUTE.operators} /\>  
                )}  
              \</div\>  
              \<div className="mt-3 text-\[11px\] text-gray-500"\>  
                Local touch: each operator has its style, but fare parity applies. This section is illustrative and not required to board.  
              \</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4 text-sm text-gray-600"\>  
              \<div className="flex items-center gap-2 mb-2"\>  
                \<Bus size={16} /\> \<span\>Service window\</span\>  
              \</div\>  
              \<div\>  
                {ROUTE.time.start} – {ROUTE.time.end} daily (subject to traffic & demand)  
              \</div\>  
            \</CardContent\>  
          \</Card\>  
        \</div\>  
      \</div\>

      {/\* Dev tests \*/}  
      \<div className="px-4 md:px-6 pb-10"\>  
        \<DevTests route={ROUTE} currentIndex={currentIndex} /\>  
      \</div\>

      {/\* Stop info drawer \*/}  
      \<StopDrawer open={drawerOpen} onClose={() \=\> setDrawerOpen(false)} stop={drawerStop} /\>  
    \</div\>  
  );  
}

![][image6]  
![][image7]  
import React, { useMemo, useState, useEffect } from "react";  
import {  
  ArrowLeft,  
  MapPin,  
  Navigation2,  
  Clock,  
  AlertTriangle,  
  Bus,  
  Star,  
  StarOff,  
  Share2,  
  Info,  
  CheckCircle,  
  XCircle,  
  Accessibility,  
  Camera,  
  Phone,  
  Flag,  
} from "lucide-react";  
import { Card, CardContent } from "@/components/ui/card";

// \---------------------------------------------  
// Palette tokens (aligned with project)  
// \---------------------------------------------  
const PALETTE \= {  
  primary: "\#009688",  
  primaryDark: "\#00796B",  
  accent: "\#5CE1E6",  
  bg: "\#F9FAFB",  
  surface: "\#FFFFFF",  
  text: "\#1F2937",  
  textMuted: "\#6B7280",  
};

// \---------------------------------------------  
// Demo Stop Data  
// \---------------------------------------------  
const STOP \= {  
  id: "stop-ki-003",  
  name: "Kijitonyama",  
  localName: "Kijito",  
  lat: \-6.7611,  
  lon: 39.2462,  
  description:  
    "Busy interchange for commuters heading to Muhimbili and Posta; shaded area with small kiosks.",  
  busyHours: \[  
    { label: "Morning Peak", window: "06:30–09:00", level: 4 },  
    { label: "Midday", window: "12:00–14:00", level: 2 },  
    { label: "Evening Peak", window: "16:30–19:00", level: 5 },  
  \],  
  routes: \[  
    { id: "14", name: "T/Nyuki – Gerezani", color: "\#2B7FFF" },  
    { id: "15B", name: "Mwenge – Kariakoo", color: "\#10B981" },  
  \],  
  photos: \[  
    { id: "p1", caption: "Shelter at platform", url: "" },  
    { id: "p2", caption: "Ticket kiosk", url: "" },  
    { id: "p3", caption: "Crosswalk", url: "" },  
  \],  
  accessibility: {  
    curbRamp: true,  
    tactilePaving: false,  
    seating: true,  
    lighting: true,  
  },  
};

// \---------------------------------------------  
// Lightweight SVG Map with stop focus & nearby streets  
// \---------------------------------------------  
function StopMap({ lat, lon, color \= "\#2B7FFF" }: { lat: number; lon: number; color?: string }) {  
  const width \= 800;  
  const height \= 260;  
  return (  
    \<svg viewBox={\`0 0 ${width} ${height}\`} className="w-full h-60 rounded-xl bg-gray-100"\>  
      \<defs\>  
        \<pattern id="grid16" width="16" height="16" patternUnits="userSpaceOnUse"\>  
          \<path d="M 16 0 L 0 0 0 16" fill="none" stroke="\#e5e7eb" strokeWidth="1" /\>  
        \</pattern\>  
        \<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"\>  
          \<feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.25" /\>  
        \</filter\>  
      \</defs\>  
      \<rect x={0} y={0} width={width} height={height} fill="url(\#grid16)" /\>  
      {/\* stylized streets \*/}  
      \<g stroke="\#d1d5db" strokeWidth={6} strokeLinecap="round"\>  
        \<path d="M20 230 L 300 120 L 780 60" /\>  
        \<path d="M60 30 L 500 200 L 700 240" /\>  
        \<path d="M100 140 L 420 100 L 760 150" /\>  
      \</g\>  
      {/\* stop focus \*/}  
      \<g filter="url(\#shadow)"\>  
        \<circle cx={420} cy={120} r={8} fill={color} /\>  
        \<circle cx={420} cy={120} r={16} fill="none" stroke={color} strokeWidth={2} opacity={0.6} /\>  
      \</g\>  
    \</svg\>  
  );  
}

// \---------------------------------------------  
// Busy-ness bars (0-5)  
// \---------------------------------------------  
function BusyBar({ label, window, level }: { label: string; window: string; level: number }) {  
  const caps \= 5;  
  return (  
    \<div className="flex items-center justify-between gap-4"\>  
      \<div className="min-w-36"\>  
        \<div className="text-sm font-medium text-gray-800"\>{label}\</div\>  
        \<div className="text-xs text-gray-500"\>{window}\</div\>  
      \</div\>  
      \<div className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden"\>  
        \<div className="h-full rounded-full" style={{ width: \`${(level / caps) \* 100}%\`, backgroundColor: PALETTE.primary }} /\>  
      \</div\>  
      \<div className="w-8 text-right text-xs text-gray-600"\>{level}/{caps}\</div\>  
    \</div\>  
  );  
}

// \---------------------------------------------  
// Live arrivals (mock)  
// \---------------------------------------------  
function LiveArrivals() {  
  const \[now, setNow\] \= useState\<Date\>(new Date());  
  useEffect(() \=\> {  
    const t \= setInterval(() \=\> setNow(new Date()), 1000);  
    return () \=\> clearInterval(t);  
  }, \[\]);  
  const rows \= \[  
    { route: "14", head: "Gerezani", etaMin: 3, crowd: "Moderate" },  
    { route: "15B", head: "Kariakoo", etaMin: 6, crowd: "Light" },  
    { route: "14", head: "T/Nyuki", etaMin: 9, crowd: "Busy" },  
  \];  
  return (  
    \<div\>  
      \<div className="flex items-center justify-between text-sm mb-2"\>  
        \<span className="text-gray-600"\>Live arrivals\</span\>  
        \<span className="text-gray-400"\>{now.toLocaleTimeString()}\</span\>  
      \</div\>  
      \<div className="divide-y border rounded-xl overflow-hidden bg-white"\>  
        {rows.map((r, i) \=\> (  
          \<div key={i} className="flex items-center justify-between px-3 py-2 text-sm"\>  
            \<div className="flex items-center gap-2"\>  
              \<span className="inline-flex items-center justify-center h-6 w-8 rounded-md text-white" style={{ background: r.route \=== "14" ? "\#2B7FFF" : "\#10B981" }}\>{r.route}\</span\>  
              \<span className="text-gray-800"\>{r.head}\</span\>  
            \</div\>  
            \<div className="flex items-center gap-4"\>  
              \<span className="text-gray-700 font-medium"\>{r.etaMin} min\</span\>  
              \<span className="text-gray-500"\>{r.crowd}\</span\>  
            \</div\>  
          \</div\>  
        ))}  
      \</div\>  
    \</div\>  
  );  
}

// \---------------------------------------------  
// Dev tests (render-only)  
// \---------------------------------------------  
function DevTests() {  
  const tests \= \[  
    { name: "Has coordinates", pass: typeof STOP.lat \=== "number" && typeof STOP.lon \=== "number" },  
    { name: "Busy hours defined", pass: STOP.busyHours.length \> 0 },  
    { name: "At least one route", pass: STOP.routes.length \> 0 },  
    { name: "Accessibility flags present", pass: STOP.accessibility && typeof STOP.accessibility.curbRamp \=== "boolean" },  
  \];  
  return (  
    \<div className="mt-6 p-4 rounded-xl border bg-white"\>  
      \<div className="text-sm font-semibold mb-2"\>Dev Checks\</div\>  
      \<ul className="text-sm space-y-1"\>  
        {tests.map((t) \=\> (  
          \<li key={t.name} className="flex items-center gap-2"\>  
            {t.pass ? \<CheckCircle size={14} className="text-emerald-600" /\> : \<XCircle size={14} className="text-rose-600" /\>}  
            \<span\>{t.name}\</span\>  
          \</li\>  
        ))}  
      \</ul\>  
    \</div\>  
  );  
}

// \---------------------------------------------  
// Page  
// \---------------------------------------------  
export default function StopPage() {  
  const \[fav, setFav\] \= useState(false);

  return (  
    \<div className="min-h-screen" style={{ backgroundColor: PALETTE.bg, color: PALETTE.text }}\>  
      {/\* Header \*/}  
      \<div className="px-4 md:px-6 py-4 flex items-center gap-3 bg-white border-b"\>  
        \<button className="p-2 rounded-md hover:bg-gray-100" aria-label="Back"\>  
          \<ArrowLeft size={18} /\>  
        \</button\>  
        \<div\>  
          \<div className="text-xs text-gray-500"\>Stop\</div\>  
          \<h1 className="text-xl md:text-2xl font-semibold"\>  
            {STOP.name} \<span className="text-gray-400"\>({STOP.localName})\</span\>  
          \</h1\>  
          \<div className="text-sm text-gray-600 flex items-center gap-2"\>  
            \<MapPin size={14} /\> {STOP.lat.toFixed(4)}, {STOP.lon.toFixed(4)}  
          \</div\>  
        \</div\>  
        \<div className="ml-auto flex items-center gap-2"\>  
          \<button className="px-3 py-1.5 rounded-md border bg-white text-sm inline-flex items-center gap-1" onClick={() \=\> setFav((v) \=\> \!v)}\>  
            {fav ? \<StarOff size={16} /\> : \<Star size={16} /\>} {fav ? "Unsave" : "Save"}  
          \</button\>  
          \<button className="px-3 py-1.5 rounded-md border bg-white text-sm inline-flex items-center gap-1"\>  
            \<Share2 size={16} /\> Share  
          \</button\>  
        \</div\>  
      \</div\>

      {/\* Content \*/}  
      \<div className="px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6"\>  
        {/\* Left column \*/}  
        \<div className="lg:col-span-2 space-y-6"\>  
          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<StopMap lat={STOP.lat} lon={STOP.lon} color={PALETTE.primary} /\>  
              \<div className="mt-3 text-sm text-gray-600 flex items-center gap-3"\>  
                \<Navigation2 size={16} className="opacity-60" /\>  
                \<span\>{STOP.description}\</span\>  
              \</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4 space-y-4"\>  
              \<div className="font-semibold flex items-center gap-2"\>  
                \<Clock size={16} /\> Busy hours  
              \</div\>  
              \<div className="space-y-3"\>  
                {STOP.busyHours.map((b) \=\> (  
                  \<BusyBar key={b.label} label={b.label} window={b.window} level={b.level} /\>  
                ))}  
              \</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="font-semibold flex items-center gap-2"\>  
                \<Camera size={16} /\> Photos  
              \</div\>  
              \<div className="mt-2 grid grid-cols-3 gap-2"\>  
                {STOP.photos.map((p) \=\> (  
                  \<div key={p.id} className="aspect-video rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-600"\>  
                    {p.caption}  
                  \</div\>  
                ))}  
              \</div\>  
            \</CardContent\>  
          \</Card\>  
        \</div\>

        {/\* Right column \*/}  
        \<div className="space-y-6"\>  
          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="font-semibold mb-2"\>Routes serving this stop\</div\>  
              \<div className="flex flex-wrap gap-2"\>  
                {STOP.routes.map((r) \=\> (  
                  \<a key={r.id} href={\`\#/routes/${r.id}\`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm bg-white hover:bg-teal-50" style={{ borderColor: "\#e5e7eb" }}\>  
                    \<span className="inline-flex items-center justify-center h-6 w-8 rounded-md text-white" style={{ background: r.color }}\>{r.id}\</span\>  
                    \<span className="text-gray-800"\>{r.name}\</span\>  
                  \</a\>  
                ))}  
              \</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<LiveArrivals /\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4 space-y-3 text-sm"\>  
              \<div className="font-semibold flex items-center gap-2"\>  
                \<Accessibility size={16} /\> Accessibility  
              \</div\>  
              \<div className="grid grid-cols-2 gap-2"\>  
                \<div className="flex items-center gap-2"\>\<CheckCircle size={16} className={STOP.accessibility.curbRamp ? "text-emerald-600" : "text-gray-300"}/\> Curb ramp\</div\>  
                \<div className="flex items-center gap-2"\>\<CheckCircle size={16} className={STOP.accessibility.seating ? "text-emerald-600" : "text-gray-300"}/\> Seating\</div\>  
                \<div className="flex items-center gap-2"\>\<CheckCircle size={16} className={STOP.accessibility.lighting ? "text-emerald-600" : "text-gray-300"}/\> Lighting\</div\>  
                \<div className="flex items-center gap-2"\>\<CheckCircle size={16} className={STOP.accessibility.tactilePaving ? "text-emerald-600" : "text-gray-300"}/\> Tactile paving\</div\>  
              \</div\>  
              \<div className="text-xs text-gray-500"\>Community-sourced. Accuracy improves as riders contribute.\</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4 space-y-3 text-sm"\>  
              \<div className="font-semibold flex items-center gap-2"\>\<AlertTriangle size={16}/\> Service alerts\</div\>  
              \<div className="rounded-md border p-3 bg-amber-50 text-amber-900 text-xs"\>No active alerts for this stop.\</div\>  
              \<div className="font-semibold flex items-center gap-2"\>\<Flag size={16}/\> Report an issue\</div\>  
              \<div className="text-xs text-gray-600"\>Broken shelter? Incorrect location? \<a href="\#/report" className="text-teal-700 underline"\>Send a quick report\</a\>.\</div\>  
            \</CardContent\>  
          \</Card\>  
        \</div\>  
      \</div\>

      {/\* Dev tests \*/}  
      \<div className="px-4 md:px-6 pb-10"\>  
        \<DevTests /\>  
      \</div\>  
    \</div\>  
  );  
}

![][image8]  
import React, { useState, useMemo } from 'react';  
import { Map, Plus, Save, Eye, Bus, X, Upload, Trash2, Info } from 'lucide-react';  
import { Card, CardContent } from '@/components/ui/card';

export default function NewRoutePage() {  
  const \[stops, setStops\] \= useState(\[{ name: '', lat: '', lon: '' }\]);  
  const \[routeName, setRouteName\] \= useState('');  
  const \[routeNumber, setRouteNumber\] \= useState('');  
  const \[via, setVia\] \= useState('');  
  const \[fare, setFare\] \= useState('');  
  const \[previewMode, setPreviewMode\] \= useState(false);

  // NEW: uploaded path (from KML/CSV)  
  const \[routePath, setRoutePath\] \= useState(\[\]); // \[{lat, lon}\]  
  const \[uploadError, setUploadError\] \= useState('');

  const handleAddStop \= () \=\> {  
    setStops(\[...stops, { name: '', lat: '', lon: '' }\]);  
  };

  const handleRemoveStop \= (index) \=\> {  
    const newStops \= stops.filter((\_, i) \=\> i \!== index);  
    setStops(newStops);  
  };

  const handleChangeStop \= (index, field, value) \=\> {  
    const newStops \= \[...stops\];  
    newStops\[index\]\[field\] \= value;  
    setStops(newStops);  
  };

  // \-----------------  
  // File parsing  
  // \-----------------  
  const parseCSV \= (text) \=\> {  
    const lines \= text.split(/\\r?\\n/).map(l \=\> l.trim()).filter(Boolean);  
    if (\!lines.length) return \[\];  
    const header \= lines\[0\].toLowerCase().split(/\[;,\\t\]/).map(h \=\> h.trim());  
    const hasHeader \= header.some(h \=\> \['lat','latitude','y'\].includes(h)) && header.some(h \=\> \['lon','lng','longitude','x'\].includes(h));  
    const rows \= hasHeader ? lines.slice(1) : lines;  
    const idxLat \= hasHeader ? header.findIndex(h \=\> \['lat','latitude','y'\].includes(h)) : 0;  
    const idxLon \= hasHeader ? header.findIndex(h \=\> \['lon','lng','longitude','x'\].includes(h)) : 1;  
    const out \= \[\];  
    for (const line of rows) {  
      const cols \= line.split(/\[;,\\t\]/).map(c \=\> c.trim());  
      const lat \= parseFloat(cols\[idxLat\]);  
      const lon \= parseFloat(cols\[idxLon\]);  
      if (Number.isFinite(lat) && Number.isFinite(lon)) out.push({ lat, lon });  
    }  
    return out;  
  };

  const parseKML \= (text) \=\> {  
    // naive parse: collect all \<coordinates\>...lon,lat(,alt)...\</coordinates\>  
    const coords \= \[\];  
    const regex \= /\<coordinates\>(\[\\s\\S\]\*?)\<\\/coordinates\>/gi;  
    let m;  
    while ((m \= regex.exec(text)) \!== null) {  
      const block \= m\[1\].trim();  
      const pairs \= block.split(/\\s+/);  
      for (const p of pairs) {  
        const \[lonStr, latStr\] \= p.split(',');  
        const lat \= parseFloat(latStr);  
        const lon \= parseFloat(lonStr);  
        if (Number.isFinite(lat) && Number.isFinite(lon)) coords.push({ lat, lon });  
      }  
    }  
    return coords;  
  };

  const onUpload \= async (file) \=\> {  
    setUploadError('');  
    if (\!file) return;  
    try {  
      const text \= await file.text();  
      const ext \= (file.name.split('.').pop() || '').toLowerCase();  
      let pts \= \[\];  
      if (ext \=== 'csv') pts \= parseCSV(text);  
      else if (ext \=== 'kml') pts \= parseKML(text);  
      else throw new Error('Unsupported file type. Please upload .kml or .csv');  
      if (\!pts.length) throw new Error('No coordinates found. Ensure your file has lat/lon pairs.');  
      setRoutePath(pts);  
    } catch (e) {  
      setRoutePath(\[\]);  
      setUploadError(e.message || 'Failed to parse file');  
    }  
  };

  const clearPath \= () \=\> { setRoutePath(\[\]); setUploadError(''); };

  // Simple SVG preview for uploaded path  
  const PathPreview \= ({ points, height \= 256 }) \=\> {  
    const pad \= 16;  
    const width \= 480;  
    if (\!points || points.length \< 2\) return (  
      \<div className="h-64 w-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm"\>  
        Upload a .kml or .csv to see a route path preview  
      \</div\>  
    );  
    const lats \= points.map(p \=\> p.lat);  
    const lons \= points.map(p \=\> p.lon);  
    const minLat \= Math.min(...lats), maxLat \= Math.max(...lats);  
    const minLon \= Math.min(...lons), maxLon \= Math.max(...lons);  
    const spanLat \= Math.max(maxLat \- minLat, 1e-6);  
    const spanLon \= Math.max(maxLon \- minLon, 1e-6);  
    const project \= (pt) \=\> {  
      const x \= pad \+ (pt.lon \- minLon) / spanLon \* (width \- 2\*pad);  
      const y \= pad \+ (1 \- (pt.lat \- minLat) / spanLat) \* (height \- 2\*pad);  
      return \[x, y\];  
    };  
    const d \= points.map(project).map((\[x,y\]) \=\> \`${x},${y}\`).join(' ');  
    return (  
      \<svg viewBox={\`0 0 ${width} ${height}\`} className="w-full h-64 rounded-lg bg-gray-100"\>  
        \<defs\>  
          \<pattern id="grid16" width="16" height="16" patternUnits="userSpaceOnUse"\>  
            \<path d="M 16 0 L 0 0 0 16" fill="none" stroke="\#e5e7eb" strokeWidth="1" /\>  
          \</pattern\>  
        \</defs\>  
        \<rect x={0} y={0} width={width} height={height} fill="url(\#grid16)" /\>  
        \<polyline points={d} fill="none" stroke="\#2B7FFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /\>  
        {points.map((p, i) \=\> {  
          const \[x,y\] \= project(p);  
          return \<circle key={i} cx={x} cy={y} r={3} fill="\#111827" /\>;  
        })}  
      \</svg\>  
    );  
  };

  const pathMeta \= useMemo(() \=\> ({ count: routePath.length }), \[routePath\]);

  return (  
    \<div className="min-h-screen bg-gray-50 text-gray-800"\>  
      {/\* Header \*/}  
      \<header className="flex items-center justify-between bg-white px-6 py-4 border-b"\>  
        \<h1 className="text-2xl font-semibold flex items-center gap-2"\>  
          \<Bus size={22} className="text-teal-600" /\>  
          New Route  
        \</h1\>  
        \<div className="flex items-center gap-3"\>  
          \<button className="px-4 py-2 border rounded-md hover:bg-teal-50" onClick={() \=\> setPreviewMode(\!previewMode)}\>  
            \<Eye size={16} className="inline mr-1" /\> {previewMode ? 'Hide Route Preview' : 'Preview Route Page'}  
          \</button\>  
          \<button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center gap-1"\>  
            \<Save size={16} /\> Save Route  
          \</button\>  
        \</div\>  
      \</header\>

      {previewMode ? (  
        \<div className="p-6"\>  
          {/\* Preview Simulation of the Route Page \*/}  
          \<Card className="border border-gray-200"\>  
            \<CardContent className="p-6 space-y-4"\>  
              \<h2 className="text-xl font-semibold text-teal-700"\>{routeNumber || '00'} \- {routeName || 'Route Name'}\</h2\>  
              \<p className="text-sm text-gray-600"\>Via {via || 'main roads'}\</p\>  
              \<p className="text-sm text-gray-700"\>Default Fare: {fare || 'TSh 0'}\</p\>  
              \<div className="mt-4"\>  
                \<h3 className="text-md font-semibold mb-2"\>Stops on this route:\</h3\>  
                \<ul className="list-disc pl-5 space-y-1 text-sm text-gray-700"\>  
                  {stops.map((s, i) \=\> (  
                    \<li key={i}\>{s.name || \`Stop ${i \+ 1}\`} ({s.lat || 'lat'}, {s.lon || 'lon'})\</li\>  
                  ))}  
                \</ul\>  
              \</div\>  
              \<div\>  
                \<div className="flex items-center gap-2 text-sm text-gray-600 mb-2"\>  
                  \<Map size={16}/\> Route path preview {pathMeta.count ? \<span className="ml-1"\>• {pathMeta.count} points\</span\> : null}  
                \</div\>  
                \<PathPreview points={routePath} /\>  
                {uploadError ? \<div className="mt-2 text-xs text-rose-600"\>{uploadError}\</div\> : null}  
              \</div\>  
            \</CardContent\>  
          \</Card\>  
        \</div\>  
      ) : (  
        \<main className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-6"\>  
          {/\* Left \- Form \*/}  
          \<section className="lg:col-span-2 space-y-6"\>  
            \<Card className="border border-gray-200"\>  
              \<CardContent className="p-6 space-y-4"\>  
                \<div\>  
                  \<label className="block text-sm font-medium text-gray-700"\>Route Number\</label\>  
                  \<input type="text" className="mt-1 p-2 w-full border rounded-md" value={routeNumber} onChange={(e) \=\> setRouteNumber(e.target.value)} /\>  
                \</div\>  
                \<div\>  
                  \<label className="block text-sm font-medium text-gray-700"\>Route Name\</label\>  
                  \<input type="text" className="mt-1 p-2 w-full border rounded-md" value={routeName} onChange={(e) \=\> setRouteName(e.target.value)} /\>  
                \</div\>  
                \<div\>  
                  \<label className="block text-sm font-medium text-gray-700"\>Via Roads\</label\>  
                  \<textarea className="mt-1 p-2 w-full border rounded-md" rows={2} value={via} onChange={(e) \=\> setVia(e.target.value)} /\>  
                \</div\>  
                \<div\>  
                  \<label className="block text-sm font-medium text-gray-700"\>Default Fare\</label\>  
                  \<input type="text" className="mt-1 p-2 w-full border rounded-md" value={fare} onChange={(e) \=\> setFare(e.target.value)} placeholder="e.g., TSh 750" /\>  
                \</div\>  
              \</CardContent\>  
            \</Card\>

            \<Card className="border border-gray-200"\>  
              \<CardContent className="p-6"\>  
                \<div className="flex items-center justify-between mb-4"\>  
                  \<h2 className="text-lg font-semibold"\>Stops & Stages\</h2\>  
                  \<button className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-teal-50" onClick={handleAddStop}\>  
                    \<Plus size={14} /\> Add Stop  
                  \</button\>  
                \</div\>

                \<div className="space-y-3"\>  
                  {stops.map((stop, index) \=\> (  
                    \<div key={index} className="grid grid-cols-6 gap-2 items-center"\>  
                      \<input type="text" placeholder="Stop Name" value={stop.name} onChange={(e) \=\> handleChangeStop(index, 'name', e.target.value)} className="col-span-2 p-2 border rounded-md" /\>  
                      \<input type="text" placeholder="Latitude" value={stop.lat} onChange={(e) \=\> handleChangeStop(index, 'lat', e.target.value)} className="col-span-2 p-2 border rounded-md" /\>  
                      \<input type="text" placeholder="Longitude" value={stop.lon} onChange={(e) \=\> handleChangeStop(index, 'lon', e.target.value)} className="col-span-2 p-2 border rounded-md" /\>  
                      \<button onClick={() \=\> handleRemoveStop(index)} className="text-red-500 hover:text-red-700"\>  
                        \<X size={16} /\>  
                      \</button\>  
                    \</div\>  
                  ))}  
                \</div\>  
              \</CardContent\>  
            \</Card\>  
          \</section\>

          {/\* Right \- Uploads, Map & Tips \*/}  
          \<section className="space-y-6"\>  
            {/\* Upload card \*/}  
            \<Card className="border border-gray-200"\>  
              \<CardContent className="p-6 space-y-3"\>  
                \<div className="flex items-center gap-2 mb-1"\>  
                  \<Upload size={18} className="text-gray-600" /\>  
                  \<h2 className="text-lg font-semibold"\>Upload Route Path\</h2\>  
                \</div\>  
                \<p className="text-xs text-gray-600 flex items-start gap-2"\>\<Info size={14}/\> Upload a \<strong\>.kml\</strong\> (from Google Earth / OSM) or a \<strong\>.csv\</strong\> containing \<em\>lat,lon\</em\> columns.\</p\>  
                \<input  
                  type="file"  
                  accept=".kml,.csv"  
                  onChange={(e) \=\> onUpload(e.target.files && e.target.files\[0\])}  
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border file:border-gray-300 file:bg-white hover:file:bg-gray-50"  
                /\>  
                {routePath.length \> 0 && (  
                  \<div className="flex items-center justify-between text-sm mt-1"\>  
                    \<span className="text-gray-700"\>Loaded \<b\>{routePath.length}\</b\> points\</span\>  
                    \<button onClick={clearPath} className="inline-flex items-center gap-1 px-2 py-1 text-rose-600 hover:text-rose-700"\>\<Trash2 size={14}/\> Clear\</button\>  
                  \</div\>  
                )}  
                {uploadError ? \<div className="text-xs text-rose-600"\>{uploadError}\</div\> : null}  
                \<div className="mt-2"\>  
                  \<PathPreview points={routePath} /\>  
                \</div\>  
              \</CardContent\>  
            \</Card\>

            {/\* Tips card \*/}  
            \<Card className="border border-gray-200"\>  
              \<CardContent className="p-6 space-y-3 text-sm text-gray-600"\>  
                \<div className="text-gray-800 font-semibold"\>Tips\</div\>  
                \<ul className="list-disc pl-4 space-y-1"\>  
                  \<li\>Start and end stops define route direction.\</li\>  
                  \<li\>Use accurate coordinates to improve map precision.\</li\>  
                  \<li\>CSV headers can be \<code\>lat,lon\</code\> or \<code\>latitude,longitude\</code\>.\</li\>  
                  \<li\>Click preview to visualize your route page design.\</li\>  
                \</ul\>  
              \</CardContent\>  
            \</Card\>  
          \</section\>  
        \</main\>  
      )}  
    \</div\>  
  );  
}

![][image9]  
![][image10]  
import React, { useMemo, useState, useEffect } from "react";  
import {  
  Plus,  
  Bus,  
  MapPin,  
  Users,  
  AlertTriangle,  
  TrendingUp,  
  Activity,  
  Clock,  
  RefreshCw,  
  Settings,  
  Search,  
  ExternalLink,  
  CheckCircle,  
  XCircle,  
} from "lucide-react";  
import { Card, CardContent } from "@/components/ui/card";

// Palette tokens (aligned with project)  
const PALETTE \= {  
  primary: "\#009688",  
  primaryDark: "\#00796B",  
  accent: "\#5CE1E6",  
  bg: "\#F9FAFB",  
  surface: "\#FFFFFF",  
  text: "\#1F2937",  
  textMuted: "\#6B7280",  
};

// Mock data  
const METRICS \= {  
  routes: 128,  
  stops: 1642,  
  operators: 23,  
  activeAlerts: 2,  
  views7d: 48210,  
};

const TOP\_ROUTES \= \[  
  { id: "14", name: "T/Nyuki – Gerezani", views: 8210, trend: \+12 },  
  { id: "15B", name: "Mwenge – Kariakoo", views: 6780, trend: \+6 },  
  { id: "9A", name: "Mbagala – Posta", views: 5421, trend: \-3 },  
  { id: "2", name: "Kimara – Kivukoni", views: 4980, trend: \+9 },  
\];

const RECENT\_ACTIVITY \= \[  
  { ts: "2025-10-21 16:40", who: "Gideonamani", what: "Updated stops for Route 14", type: "edit" },  
  { ts: "2025-10-21 13:05", who: "Asha", what: "Created Route 22 draft", type: "create" },  
  { ts: "2025-10-20 19:10", who: "Omar", what: "Resolved alert: Diversion near Posta", type: "resolve" },  
  { ts: "2025-10-20 10:12", who: "Admin", what: "Added operator: Mtaa Express", type: "create" },  
\];

const ALERTS \= \[  
  { id: 1, level: "warning", title: "Diversion on Morogoro Rd", detail: "Temporary detour near Ubungo for road works." },  
  { id: 2, level: "info", title: "New route pilot: 22B", detail: "Trial service for 2 weeks. Feedback welcome." },  
\];

// Mini bar sparkline placeholder  
function SparkBars({ values }: { values: number\[\] }) {  
  const max \= Math.max(...values, 1);  
  return (  
    \<div className="flex items-end gap-1 h-10"\>  
      {values.map((v, i) \=\> (  
        \<div key={i} className="w-2 rounded-sm bg-teal-600" style={{ height: \`${(v / max) \* 100}%\` }} /\>  
      ))}  
    \</div\>  
  );  
}

// Simple Area-like chart placeholder  
function AreaChart({ series }: { series: number\[\] }) {  
  const width \= 520, height \= 180, pad \= 16;  
  const max \= Math.max(...series, 1), min \= Math.min(...series, 0);  
  const span \= Math.max(max \- min, 1);  
  const pts \= series.map((v, i) \=\> {  
    const x \= pad \+ (i / (series.length \- 1)) \* (width \- 2 \* pad);  
    const y \= pad \+ (1 \- (v \- min) / span) \* (height \- 2 \* pad);  
    return \`${x},${y}\`;  
  });  
  const path \= \`M ${pts.join(" L ")}\`;  
  return (  
    \<svg viewBox={\`0 0 ${width} ${height}\`} className="w-full h-44 rounded-lg bg-gray-100"\>  
      \<defs\>  
        \<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"\>  
          \<stop offset="0%" stopColor="\#5CE1E6" stopOpacity="0.5" /\>  
          \<stop offset="100%" stopColor="\#5CE1E6" stopOpacity="0.05" /\>  
        \</linearGradient\>  
      \</defs\>  
      \<polyline points={pts.join(" ")} fill="none" stroke="\#009688" strokeWidth={2} /\>  
      \<path d={\`${path} L ${width \- pad},${height \- pad} L ${pad},${height \- pad} Z\`} fill="url(\#g)" opacity={0.6} /\>  
    \</svg\>  
  );  
}

// Dev checks  
function DevTests() {  
  const tests \= \[  
    { name: "Metrics sane", pass: METRICS.routes \> 0 && METRICS.stops \> 0 },  
    { name: "Recent activity present", pass: RECENT\_ACTIVITY.length \> 0 },  
    { name: "Alerts array", pass: Array.isArray(ALERTS) },  
  \];  
  return (  
    \<div className="mt-6 p-4 rounded-xl border bg-white"\>  
      \<div className="text-sm font-semibold mb-2"\>Dev Checks\</div\>  
      \<ul className="text-sm space-y-1"\>  
        {tests.map((t) \=\> (  
          \<li key={t.name} className="flex items-center gap-2"\>  
            {t.pass ? \<CheckCircle size={14} className="text-emerald-600" /\> : \<XCircle size={14} className="text-rose-600" /\>}  
            \<span\>{t.name}\</span\>  
          \</li\>  
        ))}  
      \</ul\>  
    \</div\>  
  );  
}

export default function Dashboard() {  
  const \[loading, setLoading\] \= useState(false);  
  const \[query, setQuery\] \= useState("");  
  const viewsSeries \= useMemo(() \=\> \[4200, 5200, 4800, 6000, 7200, 6900, 8100\], \[\]);

  useEffect(() \=\> {  
    // simulate refresh  
    let t: any;  
    if (loading) t \= setTimeout(() \=\> setLoading(false), 800);  
    return () \=\> clearTimeout(t);  
  }, \[loading\]);

  return (  
    \<div className="min-h-screen" style={{ backgroundColor: PALETTE.bg, color: PALETTE.text }}\>  
      {/\* Header \*/}  
      \<div className="px-4 md:px-6 py-4 flex items-center gap-3 bg-white border-b"\>  
        \<div className="text-xl font-semibold"\>Dashboard\</div\>  
        \<div className="ml-auto flex items-center gap-2"\>  
          \<div className="hidden md:flex items-center bg-white border rounded-full px-3 py-1.5"\>  
            \<Search size={16} className="text-gray-400 mr-2" /\>  
            \<input value={query} onChange={(e) \=\> setQuery(e.target.value)} placeholder="Search routes, stops, operators..." className="outline-none text-sm text-gray-700" /\>  
          \</div\>  
          \<button onClick={() \=\> setLoading(true)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-sm"\>  
            \<RefreshCw size={16} className={loading ? "animate-spin" : ""} /\> Refresh  
          \</button\>  
          \<button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-600 text-white text-sm hover:bg-teal-700"\>  
            \<Plus size={16} /\> New Route  
          \</button\>  
          \<button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-sm"\>  
            \<Settings size={16} /\> Settings  
          \</button\>  
        \</div\>  
      \</div\>

      {/\* Content \*/}  
      \<div className="px-4 md:px-6 py-6 grid grid-cols-1 xl:grid-cols-3 gap-6"\>  
        {/\* KPIs \*/}  
        \<div className="xl:col-span-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"\>  
          \<Card className="border border-gray-100"\>\<CardContent className="p-4"\>\<div className="text-xs text-gray-500"\>Routes\</div\>\<div className="text-2xl font-semibold"\>{METRICS.routes}\</div\>\</CardContent\>\</Card\>  
          \<Card className="border border-gray-100"\>\<CardContent className="p-4"\>\<div className="text-xs text-gray-500"\>Stops\</div\>\<div className="text-2xl font-semibold"\>{METRICS.stops.toLocaleString()}\</div\>\</CardContent\>\</Card\>  
          \<Card className="border border-gray-100"\>\<CardContent className="p-4"\>\<div className="text-xs text-gray-500"\>Operators\</div\>\<div className="text-2xl font-semibold"\>{METRICS.operators}\</div\>\</CardContent\>\</Card\>  
          \<Card className="border border-gray-100"\>\<CardContent className="p-4"\>\<div className="text-xs text-gray-500"\>Active Alerts\</div\>\<div className="text-2xl font-semibold"\>{METRICS.activeAlerts}\</div\>\</CardContent\>\</Card\>  
          \<Card className="border border-gray-100"\>\<CardContent className="p-4"\>\<div className="text-xs text-gray-500"\>Views (7d)\</div\>\<div className="text-2xl font-semibold"\>{METRICS.views7d.toLocaleString()}\</div\>\</CardContent\>\</Card\>  
        \</div\>

        {/\* Left column: charts & tables \*/}  
        \<div className="xl:col-span-2 space-y-6"\>  
          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="flex items-center justify-between mb-2"\>  
                \<div className="font-semibold flex items-center gap-2"\>\<TrendingUp size={16}/\> Usage (7 days)\</div\>  
                \<div className="text-xs text-gray-500"\>Daily views\</div\>  
              \</div\>  
              \<AreaChart series={viewsSeries} /\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="font-semibold mb-2 flex items-center gap-2"\>\<Bus size={16}/\> Top Routes by Views\</div\>  
              \<div className="grid grid-cols-1 md:grid-cols-2 gap-3"\>  
                {TOP\_ROUTES.map(r \=\> (  
                  \<div key={r.id} className="rounded-lg border p-3 bg-white"\>  
                    \<div className="flex items-center justify-between"\>  
                      \<div className="flex items-center gap-2"\>  
                        \<span className="inline-flex items-center justify-center h-6 w-8 rounded-md text-white" style={{ background: '\#2B7FFF' }}\>{r.id}\</span\>  
                        \<div className="text-sm font-medium"\>{r.name}\</div\>  
                      \</div\>  
                      \<a href={\`\#/routes/${r.id}\`} className="text-xs text-teal-700 inline-flex items-center gap-1"\>Open \<ExternalLink size={12}/\>\</a\>  
                    \</div\>  
                    \<div className="mt-3 flex items-end justify-between"\>  
                      \<SparkBars values={\[5,9,7,8,6,9,12\]} /\>  
                      \<div className={\`text-sm font-semibold ${r.trend\>=0? 'text-emerald-600':'text-rose-600'}\`}\>{r.trend\>=0? '+'+r.trend: r.trend}%\</div\>  
                    \</div\>  
                  \</div\>  
                ))}  
              \</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="font-semibold mb-2 flex items-center gap-2"\>\<Activity size={16}/\> Recent Activity\</div\>  
              \<div className="divide-y rounded-lg border bg-white overflow-hidden"\>  
                {RECENT\_ACTIVITY.map((a, i) \=\> (  
                  \<div key={i} className="flex items-center justify-between px-3 py-2 text-sm"\>  
                    \<div className="flex items-center gap-2"\>  
                      \<Clock size={14} className="text-gray-400" /\>  
                      \<span className="text-gray-800"\>{a.what}\</span\>  
                    \</div\>  
                    \<div className="flex items-center gap-4 text-gray-500"\>  
                      \<span\>{a.who}\</span\>  
                      \<span\>{a.ts}\</span\>  
                    \</div\>  
                  \</div\>  
                ))}  
              \</div\>  
            \</CardContent\>  
          \</Card\>  
        \</div\>

        {/\* Right column: actions & alerts \*/}  
        \<div className="space-y-6"\>  
          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="font-semibold mb-3"\>Quick Actions\</div\>  
              \<div className="grid grid-cols-2 gap-3 text-sm"\>  
                \<a href="\#/new-route" className="rounded-lg border p-3 bg-white hover:bg-teal-50 inline-flex items-center gap-2"\>\<Plus size={14}/\> New Route\</a\>  
                \<a href="\#/new-stop" className="rounded-lg border p-3 bg-white hover:bg-teal-50 inline-flex items-center gap-2"\>\<MapPin size={14}/\> New Stop\</a\>  
                \<a href="\#/operators" className="rounded-lg border p-3 bg-white hover:bg-teal-50 inline-flex items-center gap-2"\>\<Users size={14}/\> Operators\</a\>  
                \<a href="\#/alerts" className="rounded-lg border p-3 bg-white hover:bg-teal-50 inline-flex items-center gap-2"\>\<AlertTriangle size={14}/\> Alerts\</a\>  
              \</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4"\>  
              \<div className="font-semibold mb-2 flex items-center gap-2"\>\<AlertTriangle size={16}/\> Service Alerts\</div\>  
              \<div className="space-y-2"\>  
                {ALERTS.map(al \=\> (  
                  \<div key={al.id} className={\`rounded-lg border p-3 text-sm ${al.level==='warning'? 'bg-amber-50 border-amber-200 text-amber-900':'bg-sky-50 border-sky-200 text-sky-900'}\`}\>  
                    \<div className="font-medium"\>{al.title}\</div\>  
                    \<div className="text-xs opacity-90"\>{al.detail}\</div\>  
                  \</div\>  
                ))}  
              \</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-100"\>  
            \<CardContent className="p-4 text-sm text-gray-600"\>  
              \<div className="font-semibold mb-2"\>System Health\</div\>  
              \<ul className="space-y-1"\>  
                \<li className="flex items-center gap-2"\>\<CheckCircle size={14} className="text-emerald-600"/\> API latency normal\</li\>  
                \<li className="flex items-center gap-2"\>\<CheckCircle size={14} className="text-emerald-600"/\> Map tiles reachable\</li\>  
                \<li className="flex items-center gap-2"\>\<CheckCircle size={14} className="text-emerald-600"/\> Database up\</li\>  
              \</ul\>  
            \</CardContent\>  
          \</Card\>  
        \</div\>  
      \</div\>

      \<div className="px-4 md:px-6 pb-10"\>  
        \<DevTests /\>  
      \</div\>  
    \</div\>  
  );  
}

![][image11]  
import React from 'react';  
import { User, Edit3, LogOut, Settings, Mail, Smartphone, ShieldCheck, Clock, MapPin } from 'lucide-react';  
import { Card, CardContent } from '@/components/ui/card';

export default function ProfilePage() {  
  const user \= {  
    name: 'Gideonamani Marress',  
    role: 'Editor / Contributor',  
    email: 'gideonamani@example.com',  
    phone: '+255 712 345 678',  
    joined: 'June 2024',  
    routesContributed: 27,  
    stopsAdded: 142,  
    lastActive: '2 hours ago',  
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Gideonamani\&backgroundColor=5CE1E6',  
  };

  return (  
    \<div className="min-h-screen bg-gray-50"\>  
      {/\* Header \*/}  
      \<header className="bg-white border-b px-6 py-4 flex items-center justify-between"\>  
        \<h1 className="text-xl font-semibold flex items-center gap-2"\>  
          \<User className="text-teal-600" size={20}/\> Profile  
        \</h1\>  
        \<button className="flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"\>  
          \<LogOut size={14}/\> Log Out  
        \</button\>  
      \</header\>

      {/\* Main Content \*/}  
      \<main className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6"\>  
        {/\* Left: User Info \*/}  
        \<section className="space-y-6"\>  
          \<Card className="border border-gray-200"\>  
            \<CardContent className="p-6 flex flex-col items-center text-center"\>  
              \<img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4" /\>  
              \<h2 className="text-lg font-semibold text-gray-800"\>{user.name}\</h2\>  
              \<p className="text-sm text-gray-500"\>{user.role}\</p\>

              \<div className="mt-4 flex flex-col items-center gap-2 text-sm text-gray-600"\>  
                \<div className="flex items-center gap-2"\>\<Mail size={14}/\> {user.email}\</div\>  
                \<div className="flex items-center gap-2"\>\<Smartphone size={14}/\> {user.phone}\</div\>  
                \<div className="flex items-center gap-2"\>\<Clock size={14}/\> Joined {user.joined}\</div\>  
                \<div className="flex items-center gap-2"\>\<ShieldCheck size={14}/\> Last active {user.lastActive}\</div\>  
              \</div\>

              \<button className="mt-6 flex items-center gap-2 text-sm px-3 py-2 border rounded-md hover:bg-gray-50"\>  
                \<Edit3 size={14}/\> Edit Profile  
              \</button\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-200"\>  
            \<CardContent className="p-6 space-y-3 text-sm text-gray-600"\>  
              \<div className="font-semibold text-gray-800"\>Settings\</div\>  
              \<div className="space-y-2"\>  
                \<button className="w-full flex items-center justify-between border rounded-md px-3 py-2 hover:bg-teal-50"\>  
                  \<span className="flex items-center gap-2"\>\<Settings size={14}/\> Account Preferences\</span\>  
                  \<span className="text-teal-600 text-xs"\>Edit\</span\>  
                \</button\>  
                \<button className="w-full flex items-center justify-between border rounded-md px-3 py-2 hover:bg-teal-50"\>  
                  \<span className="flex items-center gap-2"\>\<ShieldCheck size={14}/\> Privacy & Security\</span\>  
                  \<span className="text-teal-600 text-xs"\>Manage\</span\>  
                \</button\>  
              \</div\>  
            \</CardContent\>  
          \</Card\>  
        \</section\>

        {/\* Right: Contributions Overview \*/}  
        \<section className="lg:col-span-2 space-y-6"\>  
          \<Card className="border border-gray-200"\>  
            \<CardContent className="p-6"\>  
              \<h2 className="text-lg font-semibold mb-4"\>Contributions Overview\</h2\>  
              \<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"\>  
                \<div className="p-3 bg-white rounded-lg border"\>  
                  \<div className="text-2xl font-semibold text-teal-600"\>{user.routesContributed}\</div\>  
                  \<div className="text-sm text-gray-600"\>Routes Added\</div\>  
                \</div\>  
                \<div className="p-3 bg-white rounded-lg border"\>  
                  \<div className="text-2xl font-semibold text-teal-600"\>{user.stopsAdded}\</div\>  
                  \<div className="text-sm text-gray-600"\>Stops Added\</div\>  
                \</div\>  
                \<div className="p-3 bg-white rounded-lg border"\>  
                  \<div className="text-2xl font-semibold text-teal-600"\>12\</div\>  
                  \<div className="text-sm text-gray-600"\>Edits Reviewed\</div\>  
                \</div\>  
                \<div className="p-3 bg-white rounded-lg border"\>  
                  \<div className="text-2xl font-semibold text-teal-600"\>4.8★\</div\>  
                  \<div className="text-sm text-gray-600"\>Contributor Rating\</div\>  
                \</div\>  
              \</div\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-200"\>  
            \<CardContent className="p-6"\>  
              \<h2 className="text-lg font-semibold mb-4 flex items-center gap-2"\>\<MapPin size={16}/\> Recent Contributions\</h2\>  
              \<ul className="divide-y text-sm"\>  
                \<li className="py-2 flex items-center justify-between"\>\<span\>Updated Route 14 stops\</span\>\<span className="text-gray-500"\>2 days ago\</span\>\</li\>  
                \<li className="py-2 flex items-center justify-between"\>\<span\>Added Stop: Mikocheni B\</span\>\<span className="text-gray-500"\>3 days ago\</span\>\</li\>  
                \<li className="py-2 flex items-center justify-between"\>\<span\>Submitted photo for Gerezani Terminal\</span\>\<span className="text-gray-500"\>5 days ago\</span\>\</li\>  
                \<li className="py-2 flex items-center justify-between"\>\<span\>Reviewed Route 15B data\</span\>\<span className="text-gray-500"\>1 week ago\</span\>\</li\>  
              \</ul\>  
            \</CardContent\>  
          \</Card\>  
        \</section\>  
      \</main\>  
    \</div\>  
  );  
}

![][image12]  
![][image13]  
import React from 'react';  
import { Info, Globe, Users, Bus, Map, Heart, Lightbulb, MessageCircle, Mail } from 'lucide-react';  
import { Card, CardContent } from '@/components/ui/card';

export default function ExplainerPage() {  
  return (  
    \<div className="min-h-screen bg-gray-50 text-gray-800"\>  
      {/\* Header \*/}  
      \<header className="bg-white border-b px-6 py-4 flex items-center justify-between"\>  
        \<h1 className="text-xl font-semibold flex items-center gap-2"\>  
          \<Info className="text-teal-600" size={20}/\> About DARoutes  
        \</h1\>  
      \</header\>

      {/\* Hero Section \*/}  
      \<section className="max-w-6xl mx-auto px-6 py-12 text-center"\>  
        \<h2 className="text-3xl font-bold text-teal-700 mb-4"\>Mapping Public Transport for Everyone\</h2\>  
        \<p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed"\>  
          DARoutes is a community-driven initiative to map, document, and visualize the public transport network of Dar es Salaam.   
          Our goal is to make movement across the city easier, more transparent, and data-informed — for commuters, planners, and operators alike.  
        \</p\>  
        \<div className="mt-6 flex justify-center gap-3"\>  
          \<button className="px-5 py-2.5 rounded-md bg-teal-600 text-white hover:bg-teal-700"\>Get Involved\</button\>  
          \<button className="px-5 py-2.5 rounded-md border border-teal-600 text-teal-700 hover:bg-teal-50"\>View Routes\</button\>  
        \</div\>  
      \</section\>

      {/\* Vision Section \*/}  
      \<section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8"\>  
        \<Card className="border border-gray-200"\>  
          \<CardContent className="p-6"\>  
            \<h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-3"\>\<Globe className="text-teal-600"/\> Our Vision\</h3\>  
            \<p className="text-gray-600 leading-relaxed"\>  
              We believe that accessible transport information is key to empowering citizens and improving urban life. By mapping routes, stops, and fares,   
              we help make commuting predictable, efficient, and inclusive — whether you’re a daily commuter, a city planner, or a researcher.  
            \</p\>  
          \</CardContent\>  
        \</Card\>

        \<Card className="border border-gray-200"\>  
          \<CardContent className="p-6"\>  
            \<h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-3"\>\<Lightbulb className="text-teal-600"/\> How It Works\</h3\>  
            \<p className="text-gray-600 leading-relaxed"\>  
              The project collects route data through community contributors, digital mapping, and field verification. Users can add new routes, update fare details, and suggest edits.  
              Over time, this data powers tools for route planning, fare comparison, and better transport management.  
            \</p\>  
          \</CardContent\>  
        \</Card\>  
      \</section\>

      {/\* Participation Section \*/}  
      \<section className="max-w-6xl mx-auto px-6 py-12"\>  
        \<h3 className="text-2xl font-semibold text-center text-teal-700 mb-8"\>How You Can Take Part\</h3\>  
        \<div className="grid md:grid-cols-3 gap-6"\>  
          \<Card className="border border-gray-200 text-center"\>  
            \<CardContent className="p-6 flex flex-col items-center"\>  
              \<Users size={36} className="text-teal-600 mb-3" /\>  
              \<h4 className="text-lg font-semibold mb-2"\>Contribute Data\</h4\>  
              \<p className="text-gray-600 text-sm leading-relaxed"\>Add routes, stops, and fare information from your neighborhood to make transport info accessible for all.\</p\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-200 text-center"\>  
            \<CardContent className="p-6 flex flex-col items-center"\>  
              \<Bus size={36} className="text-teal-600 mb-3" /\>  
              \<h4 className="text-lg font-semibold mb-2"\>Verify Routes\</h4\>  
              \<p className="text-gray-600 text-sm leading-relaxed"\>Help validate and improve route accuracy by confirming details in the field or online.\</p\>  
            \</CardContent\>  
          \</Card\>

          \<Card className="border border-gray-200 text-center"\>  
            \<CardContent className="p-6 flex flex-col items-center"\>  
              \<MessageCircle size={36} className="text-teal-600 mb-3" /\>  
              \<h4 className="text-lg font-semibold mb-2"\>Engage the Community\</h4\>  
              \<p className="text-gray-600 text-sm leading-relaxed"\>Join conversations, share updates, and collaborate with others passionate about urban mobility.\</p\>  
            \</CardContent\>  
          \</Card\>  
        \</div\>  
      \</section\>

      {/\* Impact Section \*/}  
      \<section className="bg-white border-t py-12"\>  
        \<div className="max-w-6xl mx-auto px-6 text-center"\>  
          \<h3 className="text-2xl font-semibold text-teal-700 mb-6"\>Our Impact So Far\</h3\>  
          \<div className="grid grid-cols-2 md:grid-cols-4 gap-4"\>  
            \<div\>  
              \<div className="text-3xl font-bold text-teal-600"\>120+\</div\>  
              \<p className="text-sm text-gray-600"\>Routes Documented\</p\>  
            \</div\>  
            \<div\>  
              \<div className="text-3xl font-bold text-teal-600"\>1,500+\</div\>  
              \<p className="text-sm text-gray-600"\>Stops Mapped\</p\>  
            \</div\>  
            \<div\>  
              \<div className="text-3xl font-bold text-teal-600"\>25\</div\>  
              \<p className="text-sm text-gray-600"\>Active Contributors\</p\>  
            \</div\>  
            \<div\>  
              \<div className="text-3xl font-bold text-teal-600"\>5\</div\>  
              \<p className="text-sm text-gray-600"\>Districts Covered\</p\>  
            \</div\>  
          \</div\>  
        \</div\>  
      \</section\>

      {/\* Contact Section \*/}  
      \<section className="max-w-4xl mx-auto px-6 py-12 text-center"\>  
        \<h3 className="text-2xl font-semibold text-teal-700 mb-4"\>Contact & Collaboration\</h3\>  
        \<p className="text-gray-600 max-w-2xl mx-auto mb-6"\>We welcome partnerships with transport agencies, research institutions, and innovators.  
          If you’d like to collaborate or have ideas to improve the platform, we’d love to hear from you.\</p\>  
        \<button className="px-6 py-2.5 rounded-md bg-teal-600 text-white hover:bg-teal-700 inline-flex items-center gap-2"\>  
          \<Mail size={16}/\> Email Us  
        \</button\>  
      \</section\>

      {/\* Footer \*/}  
      \<footer className="bg-gray-100 border-t text-center py-6 text-sm text-gray-600"\>  
        \<p\>© {new Date().getFullYear()} DARoutes • A Community Mobility Initiative\</p\>  
      \</footer\>  
    \</div\>  
  );  
}

![][image14]  
![][image15]  
import React from 'react';  
import { MapPin, Bus, Users, Clock, CreditCard, Info, Image, Phone, ShieldCheck, Share2, Save, AlertTriangle, Accessibility } from 'lucide-react';  
import { Card, CardContent } from '@/components/ui/card';

export default function TerminalPage() {  
  const terminal \= {  
    name: 'Gerezani Terminal',  
    location: 'Kisutu, Ilala District, Dar es Salaam',  
    coordinates: 'Lat: \-6.818, Lon: 39.281',  
    totalRoutes: 18,  
    dailyPassengers: '12,000+',  
    facilities: \['Restrooms', 'Shops', 'Ticket Booths', 'Security'\],  
    contact: '+255 713 123 456',  
    supervisor: 'Mtaa Transport Co-op',  
    description: 'Busy interchange for commuters heading to Muhimbili and Posta; shaded area with small kiosks.'  
  };

  const connectedRoutes \= \[  
    { id: '14', name: 'T/Nyuki – Gerezani', fare: 'TSh 750', time: '05:00 \- 21:00' },  
    { id: '22B', name: 'Mabibo – Gerezani', fare: 'TSh 800', time: '05:30 \- 20:30' },  
    { id: '9A', name: 'Mbagala – Gerezani', fare: 'TSh 900', time: '05:00 \- 22:00' },  
  \];

  const gallery \= \[  
    'https://source.unsplash.com/400x300/?bus-terminal',  
    'https://source.unsplash.com/400x300/?bus-dar',  
    'https://source.unsplash.com/400x300/?bus-stop',  
  \];

  const busyHours \= \[  
    { time: '06:00 \- 08:00', level: 'High' },  
    { time: '12:00 \- 14:00', level: 'Medium' },  
    { time: '17:00 \- 19:00', level: 'High' },  
  \];

  const accessibility \= \[  
    'Wheelchair ramps available',  
    'Tactile walkways for visually impaired',  
    'Accessible restrooms',  
    'Priority seating areas',  
  \];

  const alerts \= \[  
    { id: 1, title: 'Temporary Diversion', detail: 'Buses rerouted to secondary gate due to maintenance works.', level: 'warning' },  
    { id: 2, title: 'Scheduled Cleaning', detail: 'Passenger waiting area closed for cleaning from 22:00 \- 04:00.', level: 'info' },  
  \];

  return (  
    \<div className="min-h-screen bg-gray-50 text-gray-800"\>  
      {/\* Header \*/}  
      \<header className="bg-white border-b px-6 py-4 flex items-center justify-between"\>  
        \<h1 className="text-xl font-semibold flex items-center gap-2"\>  
          \<MapPin className="text-teal-600" size={20}/\> Terminal Details  
        \</h1\>  
        \<div className="flex items-center gap-3"\>  
          \<button className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50 flex items-center gap-1"\>\<Save size={14}/\> Save\</button\>  
          \<button className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50 flex items-center gap-1"\>\<Share2 size={14}/\> Share\</button\>  
        \</div\>  
      \</header\>

      {/\* Overview Section \*/}  
      \<section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8"\>  
        \<Card className="border border-gray-200"\>  
          \<CardContent className="p-6"\>  
            \<h2 className="text-2xl font-semibold text-teal-700 mb-2"\>{terminal.name}\</h2\>  
            \<p className="text-sm text-gray-600 mb-4"\>{terminal.location}\</p\>  
            \<div className="text-sm text-gray-700 space-y-2"\>  
              \<div className="flex items-center gap-2"\>\<Info size={14}/\> {terminal.coordinates}\</div\>  
              \<div className="flex items-center gap-2"\>\<Bus size={14}/\> {terminal.totalRoutes} Connected Routes\</div\>  
              \<div className="flex items-center gap-2"\>\<Users size={14}/\> {terminal.dailyPassengers} Daily Passengers\</div\>  
              \<div className="flex items-center gap-2"\>\<Phone size={14}/\> {terminal.contact}\</div\>  
              \<div className="flex items-center gap-2"\>\<ShieldCheck size={14}/\> Managed by {terminal.supervisor}\</div\>  
            \</div\>

            \<h3 className="mt-6 mb-2 font-semibold text-gray-800"\>Facilities\</h3\>  
            \<ul className="list-disc list-inside text-sm text-gray-600"\>  
              {terminal.facilities.map((f, i) \=\> (\<li key={i}\>{f}\</li\>))}  
            \</ul\>  
          \</CardContent\>  
        \</Card\>

        {/\* Map Card \*/}  
        \<Card className="border border-gray-200"\>  
          \<CardContent className="p-6"\>  
            \<h3 className="text-lg font-semibold flex items-center gap-2 mb-3"\>\<MapPin size={16}/\> Map View\</h3\>  
            \<div className="h-64 w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mb-4"\>  
              \<img src="/mnt/data/8c4e06f9-580a-404e-89c7-82b19b29b299.png" alt="Terminal map diagram" className="rounded-md" /\>  
            \</div\>  
            \<p className="text-sm text-gray-600 italic"\>{terminal.description}\</p\>  
          \</CardContent\>  
        \</Card\>  
      \</section\>

      {/\* Additional Info Cards \*/}  
      \<section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6"\>  
        {/\* Busy Hours \*/}  
        \<Card className="border border-gray-200"\>  
          \<CardContent className="p-6"\>  
            \<h3 className="text-lg font-semibold flex items-center gap-2 mb-3"\>\<Clock size={16}/\> Busy Hours\</h3\>  
            \<ul className="space-y-2 text-sm text-gray-700"\>  
              {busyHours.map((b, i) \=\> (  
                \<li key={i} className="flex items-center justify-between border rounded-md px-3 py-2 bg-white"\>  
                  \<span\>{b.time}\</span\>  
                  \<span className={\`font-medium ${b.level \=== 'High' ? 'text-rose-600' : 'text-amber-600'}\`}\>{b.level}\</span\>  
                \</li\>  
              ))}  
            \</ul\>  
          \</CardContent\>  
        \</Card\>

        {/\* Accessibility \*/}  
        \<Card className="border border-gray-200"\>  
          \<CardContent className="p-6"\>  
            \<h3 className="text-lg font-semibold flex items-center gap-2 mb-3"\>\<Accessibility size={16}/\> Accessibility\</h3\>  
            \<ul className="list-disc list-inside text-sm text-gray-600 space-y-1"\>  
              {accessibility.map((a, i) \=\> (\<li key={i}\>{a}\</li\>))}  
            \</ul\>  
          \</CardContent\>  
        \</Card\>

        {/\* Photos \*/}  
        \<Card className="border border-gray-200"\>  
          \<CardContent className="p-6"\>  
            \<h3 className="text-lg font-semibold flex items-center gap-2 mb-3"\>\<Image size={16}/\> Photos\</h3\>  
            \<div className="grid grid-cols-3 gap-2"\>  
              {gallery.map((g, i) \=\> (  
                \<img key={i} src={g} alt="terminal photo" className="rounded-md border hover:opacity-90 cursor-pointer" /\>  
              ))}  
            \</div\>  
          \</CardContent\>  
        \</Card\>

        {/\* Service Alerts \*/}  
        \<Card className="border border-gray-200 lg:col-span-3"\>  
          \<CardContent className="p-6"\>  
            \<h3 className="text-lg font-semibold flex items-center gap-2 mb-3"\>\<AlertTriangle size={16}/\> Service Alerts\</h3\>  
            \<div className="space-y-2"\>  
              {alerts.map((al) \=\> (  
                \<div key={al.id} className={\`rounded-md border p-3 text-sm ${al.level==='warning'? 'bg-amber-50 border-amber-200 text-amber-900':'bg-sky-50 border-sky-200 text-sky-900'}\`}\>  
                  \<div className="font-medium"\>{al.title}\</div\>  
                  \<div className="text-xs opacity-90"\>{al.detail}\</div\>  
                \</div\>  
              ))}  
            \</div\>  
          \</CardContent\>  
        \</Card\>  
      \</section\>

      {/\* Connected Routes Section \*/}  
      \<section className="max-w-6xl mx-auto px-6 py-10"\>  
        \<h2 className="text-2xl font-semibold text-teal-700 mb-6 flex items-center gap-2"\>\<Bus size={20}/\> Routes from {terminal.name}\</h2\>  
        \<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"\>  
          {connectedRoutes.map((r) \=\> (  
            \<Card key={r.id} className="border border-gray-200 hover:shadow-sm transition"\>  
              \<CardContent className="p-4"\>  
                \<div className="flex items-center justify-between mb-2"\>  
                  \<div className="flex items-center gap-2 text-lg font-semibold text-gray-800"\>  
                    \<span className="inline-flex items-center justify-center h-6 w-8 rounded-md text-white bg-teal-600"\>{r.id}\</span\>  
                    {r.name}  
                  \</div\>  
                \</div\>  
                \<div className="text-sm text-gray-600 flex flex-col gap-1"\>  
                  \<div className="flex items-center gap-1"\>\<Clock size={14}/\> {r.time}\</div\>  
                  \<div className="flex items-center gap-1"\>\<CreditCard size={14}/\> {r.fare}\</div\>  
                \</div\>  
              \</CardContent\>  
            \</Card\>  
          ))}  
        \</div\>  
      \</section\>

      {/\* Footer \*/}  
      \<footer className="bg-gray-100 border-t py-6 text-center text-sm text-gray-600"\>  
        \<p\>© {new Date().getFullYear()} DARoutes — Empowering Public Transport Data\</p\>  
      \</footer\>  
    \</div\>  
  );  
}

[image1]: <data:image/png;base64,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oDbByBfYRMgXgHJq84UCDqCA2gQjX2ATIV8AyqnNFwo4gAJqE4x8gU2EfAEopzZfKOAACqhNMPIFNhHyBaCc2nyhgAMooDbByBfYRMgXgHJq84UCDqCA2gQjX2ATIV8AyqnNFwo4gAJqE4x8gU2EfAEopzZfKOAACqhNMPIFNhHyBaCc2nwZXMBJn53dPf38AGuNrHlZ+zqBPMkX2ETIF4ByavNlcAEn8fMXLnavvHJDnwPAWiJrXda8rH2dQJ7kC2wa5AtAOfPky+ACTr5K/3PnLpBksPbIGpe1Lms+5MAQyRfYJMgXgHLmzZfBBZwobbLfmRfPHnju4PHl2e9wEddJ+WfZssZlrdf8dGTlixyTfMF1U9b0svJFPxdi60q+SO00b75UFXDyWPpu7+zOXvp74cyL3ennnkdcG597/oXu7LlzszUua73mpyMrX+SY5Auum7Kml5Uvkov6+RBbVvJFaqd586WqgAtKH1H2k/0R18WQC7U/GVnKseSY5Auum+QLYrmypkP9pNf9EOcq4BARERFxfCngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMSngEBERERuTAg4RERGxMU9cu3atu379evfyyy93r7zySnfjxo2ZN2/e7G7dunVMAAAAAFg9FHAAAAAAjUEBBwAAANAYFHAAAAAAjUEBBwAAANAYFHAAAAAAjUEBBwAAANAYFHAAAAAAjUEBBwAAANAYFHAAAAAAjUEBBwAAANAYFHAAAAAAjUEBBwAAANAYFHAAAAAAjUEBBwAAANAYFHAAAAAAjUEBBwAAANAYFHAAsBRe94Y36xAsmDDGjDXA5kEBB80Tf/OyvpGl2q2+y0A/Z+55dV/rayo2D9ZxrNgYWNe5DJZ57LFo/RqGnP+QvgCbAAUcNI++secKAL0dk2sTpD0Yb8ftKXTfFCV9hPgcxsA6f33tuo8eJ2v/VDy1Hfe39g2k9ikh1VcfxzoXvW2RigeGtMfPF6O3Nfr89HaI6W19fbk+cSzVFuIW3vPl9osf6/1CHKB1KOCgefTNWG/HsdQNPSbXFtB99HZgaLyWRRwvPsbQ41n94zHX5J7L2w6k4gGvXUj1ScVT5K4nJtdWQ26Mc6T6l8at67Vipej+ejuO6a/6cUwqDrAOUMBB8+ibdHyDj43b9OOYVDympI9gPW/JdorSfmNjnVfq2nVMt6e2U/ESSvvWPlfuepZJ6nw9Uv1T8YD1fLnYELz9UzErHsi1AbQOBRw0T+ombcW9bxJCKh6T6pOLp9qEXFugpM8yKHleq0+I5dr0Y2s7RWm/UnLnpNHtQ/YVSvqUkBvjHKnzLT2OtY8Vq8XaPxWz4gGrzYoBtAgFHDRPuIl7N2arj/dNR8fiY+jj6b4B3cfql7oGa9/cOcxL6nheTJ9X3G7tK1j7lMTj7RS6n9XXipc+d4h5jy289hirr/Vcup/e1uj21HXHxO2p/lYsJtemsY4VP3+KuC3VLxUHaAkKOACYm3m+Ic6zL6wG5gxg9VDAAcDc1HxDt15hgTZg3gBWDwUcAAAAQGNQwAEAAAA0BgUcAAAAQGNQwAEAAAA0BgUcwIiEP9xf5z8CX/X1Wc9dEkudt47pfqVz6rUvCv08qfPTsVS/mFQfKwYAy4UCDgBcWvrmnDvXVFsqrtEFj8aKCSGeal8kJc9h9dExvZ2KAcBqoIADWCH6G3vqa8AqIPTXGKvNilnbMSX7p0j1s47j9dUsMy6xYA7rOjRWH91fb8fE55HrF9DPM3SfFLpPOHbpcwDA4qCAA1gh8Tdl/U3Q+4botefQzxXHdDy0ha+5foJuS/ULpPrGx0kdw+qvnz8mFRf0ftbjXEzvPwS9n74O3Z5C7zeEkn10H70NAONBAQcwYXLfIHNtKeJ9huw/tJCI8faxzknv420HUvGA1y5Y55CLxZTE9LYV87ZTzNPPiml0H70NAONBAQcwIvINL6jRMb0dyB3DQvfL7a/jJY89vL6p46Ye52IprL46pq+9NBa2db8S9D7WcXU8JhWPSZ2bjpdch9VHbwPAOFDAATQK3zSnCfMCAGNAAQfQEBQHhzAOALDpUMABAAAANAYFHAAAAEBjUMABAAAANAYFHAAAAEBjUMABAAAANAYFHAAAAEBjUMABAAAANAYFHAAAAEBjUMABAAAANAYFHAAAAEBjUMABAAAANAYFHAAAAEBjUMABAAAANAYFHAAAAEBjUMABAAAANMaJvf1L3f6ly93lK1e7K1evdVevXZ957fpL3fWXXj7mSy+/goiIiIgrlgIOERERsTEp4BAREREbkwIOERERsTEp4BAREREbkwIOERERsTEp4BAREREbkwIOERERsTEp4BAREREbkwIOERERsTEp4BAREREbkwIOERERsTEp4BAREREbkwIOERERsTEp4BAREREb8/8DsOFHJSHZ+V4AAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,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>

[image4]: <data:image/png;base64,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>

[image5]: <data:image/png;base64,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>

[image6]: <data:image/png;base64,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>

[image7]: <data:image/png;base64,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>

[image8]: <data:image/png;base64,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>

[image9]: <data:image/png;base64,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>

[image10]: <data:image/png;base64,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>

[image11]: <data:image/png;base64,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>

[image12]: <data:image/png;base64,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>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnAAAAF4CAYAAADUqMRTAAAkLUlEQVR4Xu3dTagt2Xne8TYhYw89jJNhxslcY40yEWToBDTWVCMngwwiLgYNQluhA04igwIOQQ5ICYLIaWwcxSFYxBCLmCBs99ftb7U+utUtOFGdpjrrPnetqtq1P2pV7d8f/pxa73rXqn32Xmfv5557W3rh5x9/8kCSJMn9+EIWSJIk2bcCHEmS5M4U4EiSJDvzF7/4xaQCHEmSZGdmYEsFOJIkyc7MwJYKcCRJkp1ZhrWvfvWrD0+ePHn44IMPBDiSJMleHYPayy+//BjeRgU4kiTJTh2DWhneBl966SUBjiRJskfHAPed73znGb/3ve8JcCRJkj1a/hu4mgIcSZJkZ2ZgSwU4kjzBF778pedqJHlpM7ClAhx5B9ZCR612rrU9a7VzHPYrzflTzf3m9p2am3PpPUgyA1sqwJF3YC0s1GqXsNz3kve4duhZuv+Snpa5NsdLXLOG5P7MwJYKcOQdWPvQz6CVlvW8zvVT+7buUeupjcu1Wc/57Buva3Npzs/tmWta/XmP2ri1tpyf6iN5PDOwpQIceQfmB38GgAwDGRjyurYm1y9dm/vkuLZ+ytw7x9nf6s25vM7+1nVrn9o4a3mPnCd5XDOwpQIceQfWPvQzKORcGVRaPblnbX2tt7Z/qzf7a47z2Zdrcpxzuba1Z+6TvTnf6mvNlbXaHlkjeTwzsKUCHHkH1j70p4JCGSRqXzNopDmfvbX9W71z9ZxrXdfGOVc+ptY+tced/S1bPblX7XqqRvJ4ZmBLBTjyDqx96E8FhZybGtfMntq4dd3ae25u7ro2zrlxvnVd7tGqT9nqae1T66/VSB7PDGypAEfegbUP/ayNgSTr2dvqyf5az5J6bb7W23pMWc+1uV9tjxxnvdZTjlv3adXLudwv+8Z6a47kMczAlgpwJEmSnZmBLRXgSJIkOzMDWyrAkSRJdmYGtlSAI0mS7MwMbKkAR5Ik2ZkZ2FIBjiRJsjMzsKUCHEmSZGdmYEsFOJIkyc7MwJYKcCRJkp2ZgS0V4EiSJDszA1sqwJEkSXZmBrZUgCNJkuzMDGypAEeSJNmZGdhSAY4kSbIzM7ClAhxJkmRnZmBLBTiSJMnOzMCWCnAkSZKdmYEt3W2A++jnHz/64Uc/Jzd1OId5Pk/VeWYvOs88iuM5zPO5FzOwpbsMcD/78KOHd9//0cPrT99+ePX1t8hNHc7hT3/24eMbRp7VOYc3l/E8v/aG88ztfevt9x7P85oPvvE8v/X2u84zN3c4g8NZHM7kmvO8tRnY0t0FuMc3ll9+UAK9MbxZDOczz+yU7/0yuDnP6JHhbJ7yh5Kh13lGjwxn8tTz3IMZ2NJdBbjhyX/rnffytQG6YTifeW5bDuf5zbecZ/TJcDZP+QPJ0PvmW+/mNkAXDGfzlPPcgxnY0l0FuOHXoK+98Va+LkA3DOdz6a/qh/P8ySe/yC2ALhjO5o8++PHi8zz0Os/olfE857nt2Qxs6a4C3E9++rPHv9cGemU4n0t/TT+cZ6Bn3nn3vcXneegFemY4o3luezYDWyrAARdEgMOREOBwJAS4DRXg0DsCHI6EAIcjIcBtqACH3hHgcCQEOBwJAW5DBTj0jgCHIyHA4UgIcBsqwKF3BDgcCQEOR0KA21ABDr0jwOFICHA4EgLchgpw6B0BDkdCgMOREOA2VIBD7whwOBICHI6EALehAtxlePKn//3hH3332w/f/OH/eab+B6/+5TNjnI4AhyMhwN2WH37w/sMLL36l6u/84M+yHSciwG2oAHc++abwD/7Tf3is/8Z3v/VZDesR4HAkBLjbUb4v/9P/8UePf6AeAt0Q3Mb6r3/9a7kMJyDAbagAdx5/82tPHt8E3v3ow8fx7/3fHzyOf+v7f/I4Ht4whvEQ5rAOAQ5HQoC7DUsC2hDq/CH7PAS4DRXg1vOD9955/MH//R/+xTP1X/vX/+K5N4QcYzkC3PUpf1Ox1KkPRrQR4K7P+Bu2pTjP6xHgNlSAW88fv/7q4w/+n73z7PP39//9v33uzSPHWI4Ad33K8/mnbz197rz+zp//r2dqw4dd9mAZAtz1Gc7mqf/+eFgz/PUqTkOA21AB7jzG30Zk7XPf/MYzY3+6W48Ad13ytxVLAtxAjrEMAe66fO73v7HqbNbeyzGPALehAtx5/O933/7sB790oPyHsliPAHddzglw/iu+0xHgrsva99y1we/eEeA2VIC7DOObxvDv30aGX8cPv3nza/nzEOCuyz/7n//tuT+ALPVv/PaT3A4zCHDXZTybpzL+rwbgNAS4DRXg0DsC3HXJ38Cdwtp194wAd13WBjj/rnMdAtyGCnDrKf8T9DT/zdswPvUf1eJTBLjrIsDdFgHuuqz9q9C1we/eEeA2VIBbx9T/unfpSCvYYR4B7rqUAa52dgf+3V/8+Wf14XrgnOB3zwhw12V8bz6VYY3/vc7TEeA2VIBbx5I3iPwgXPvGcu8IcNfl///HNv/8s/P5937v3zwT5ga/+F//8+NcWfMfMZyOAHd9Tn2fXftbOwhwmyrAnc74/64wR+1NIceYR4C7PmUoG/g7v/svnwtww/9F3E8+/vi5XpyGAHddlr4/j4z/8YJ/4rIOAW5DBbjTWfpXRwLcZRDgbkcrnP3t3/30H3gPDtdYjwB3XfI/RpgKZq3zjuUIcBsqwK1jyQ/88MaR/+Ytx5hHgMOREOCuSxnK5vR+fD4C3IYKcOgdAQ5HQoC7PsPffuRv3oa/ORnqQ2gb/hcEcBkEuA0V4NA7AhyOhACHIyHAbagAh94R4HAkBDgcCQFuQwU49I4AhyMhwOFICHAbKsChdwQ4HAkBDkdCgNtQAQ69I8DhSAhwOBIC3IYKcOgdAQ5HQoDDkRDgNlSAQ+8IcDgSAhyOhAC3oQIcekeAw5EQ4HAkBLgNFeDQOwIcjoQAhyMhwG2oAIfeEeBwJAQ4HAkBbkPvIcD96q/93UcvwaX2qTE+zmveY48IcG3yrOQ4yfOV4xrO5WU5UoDr5Wysvf/eH38PCHAbevQAd84PxjlrS5buU/b18KbSCwJcmzwjOZ5iae/Yt+ZMntp/DxwtwG1Fvl+eyrnr8SkC3IYeOcC1fijHD6L8YJqq5fxI1lrztX2TrLXW5PqcPxoC3DKmzkReZ0/OlWR/eV3rH8meufG9cOQAV76m5dySWo5btZwrr09ZWyPXlON0ar7cL6+n+nLvPSDAbei9BbistX6QyutaLan1jrTWZ++p42Rufq8IcNPk2audsTW1kaE2Oo5zvsXauSNztADXOhtTtZJabWRqbWtuyX1zXKuV39c4zutarbxeUxup1XpEgNtQAW79D2lJrXck15eWtMat/pG5+b0jwE2Tr3vtjJU9S2sjOZc9OS7Je5SPqazdE0cLcK1x7bzk9dzrX/ZkX+6V10vXtmq5rnZdq5XXa2ojU3M9IcBt6JED3MD4Q5g/NGUt58rr2tq5+VatNT9SztXWZy3nanseAQFunnzt80y0zk5Jjkdaa/PMTdVq8zm+F44W4PI1LefK6+ybqrXWleTasl7O19YOlPOtNbV9y+tarbxu3aPWl7Xxuhz3iAC3oUcPcNg/Atxt6P2D4igcKcCdijN2Gnt4vgS4DRXg0DsC3G3Yw4fFERDgplnScy/s4bkQ4DZUgEPvCHA4Evcc4HA8BLgNFeDQOwIcjoQAhyMhwG2oAIfeEeBwJAQ4HAkBbkMFOPSOAIcjIcDhSAhwGyrAoXcEOBwJAQ5HQoDbUAEOvSPA4UgIcDgSAtyGCnDoHQEOR0KAw5EQ4DZUgEPvCHA4EgIcjoQAt6ECHHpHgMOREOBwJAS4Db1lgPv8F76YpcNRfo+X/H4vudepbHnvgS0D3Nz3PjfforWuVq/VsF/2EOCcOSxFgNvQawS44Yc/g0xZy/mR2nz2teayb6TVk9c5rpH1XFPbZ+6xzu05d13Wynu1+nPt1LqR7KnVateXoscAl89HXreorRvHrecxr5PsW/qYavvmHq395mrjuNZXMne/Wq11nax9XLV12XMOewtw+b3n81cyt65WL2vl3nmfrNfmauOcG8l6rslxrV5Se1xjvTYue1vXyVRPjm+FALeh1whwLWqHLsn5HI+UB3ktufYSj68cT82V4yVrWvUcZ32kVs9ajkey3hpn/VJsHeBKk6yV45wrac3V6lnL8VjLeo6XkGtyPFeb+/6zluNrcep9Tu0/hb0FuBzn3BTZm+Nkbr6kduZKWvUpptZMzQ0M89mT45FWfSm5Pse3RIDb0EsHuKkf9NoBT3I+xyO1eq02sLSe45JxLnumxrlmqrdVW7p2ri/rtVqOR7LeGmf9Umwd4KbI+RyfUhsY6jmX45Lyuc++HC8h1+S4rJX3nOqbquX40sw9vlp9oPY9XgoB7vnrqVqLqdd2YO5eA1mfer1b9ZHa2hyPtOpLyfU5viUC3IZeOsDVGA92+QM3deByPnvLfbKWtHryOsfl17Jeq5VztX3K+SRrrXHuldT6Rsp75/zU3EitXltX67sEPQa42vdc68352rpybmq+Vh9r5dqcO4XcK9fnuCTnpsat+9S+j6lx67ok92z1jczNn0vvAS6//7lxydzzXL7Oc/Xydau9hjlOanuW1OpL1uTcWCvN+fK67Cm/1q5Lsiep1W6BALehtwhwwDlsGeDuja0+BLZgyfe6pOdUeg9wWM81zkvvCHAbKsChdwQ4HAkBDkdCgNtQAQ69I8DhSAhwOBIC3IYKcOgdAQ5HQoDDkRDgNlSAQ+8IcDgSAhyOhAC3oQIcekeAw5EQ4HAkBLgNPVKAy/8CKMctlvYla9e1WLLfkp5zucU9TuEoAa635/USHPF7ujYCXJ2lZ2lpH26DALehtw5wtR++oTZaq7fGZa22R47HWo5ba0tq4+wfxzk3Us4vqddqeZ+slfVT5lrXJa2eVv+l6D3A5XNaknM5n/Xsr12P41qtNs79s2+kVR/IuXGf0nKuZElPqzZw6rqp8dTcrbh1gJv6/ktyLteN4/J6HGd9qicZe0uT3Ku1X+3+tZ68z5LrWi33GWs51+rLvUpyPNaWrGvdtzY+FwFuQ68Z4MpDVKuX46yVzM0P1Hpy3CL7ctxiaV/J1HNS+x6Sufkl5B5535yf4pTetfQc4E553lrzeSby68jUOOdGWvVkSV+tJ2utx17W8mte1zh1fmrvHN+aWwa4qeehRvbUxllLpuZrr/1IrVZjSd9UT2uuVS/JnhzXWNLTItfmuFbLcas2MjW3BAFuQ68Z4FrkgRnGWSuZmx+o9eS4RfbluMXSvpJxTa6tPf4aS3rmyD3y3jk/xSm9axHgPmVqnHPXoHaPrOW4pPV9tWolp85PPTc5vjU9BrjWa1MbZy1ZO9+qJ0v6smfqeah970uua+MaS3pa5Noc12o5Hmu1+kCrvhQBbkOvHeDycOQPQ2mLca7WN7VHq5YsqdXGtVprbqTsGb+WJktqOS7JffM6H085t5S8x6XpOcAN5HPaojWXr0F+Hcn7TM3nuLVnydTcQM7XHsNYr1F7PCW12kCrPlKbn7pXbS57rsktA9xA7futka9nXteeq9aarJdzNWr9JTmX45HWYywZ75U9S9ZmLedr+9bq5dyS8bi+9hhznNc5Tmq1UxDgNvTWAe5a3Oo+uD29B7itcOb3ya0DHJ7Fz81lEeA29NoBDjgXAQ5HQoDDkRDgNlSAQ+8IcDgSAhyOhAC3oQIcekeAw5EQ4HAkBLgNFeDQOwIcjoQAhyMhwG2oAHd55v6R7Nx8i7Xr9o4AhyMhwN2efO/MMdYjwG2oAHd5rvXmcK19e0eAw5EQ4G7Pvb533gIBbkPvOcBd64d63De/1pjrKeutnqMjwOFICHCXZe49dCDnclwyNYfnEeA29F4D3PBDOvWDOs7X3hyWrCuva/1Zy/FYW3rfIyPA4UgIcLcl30fHWoupOTyPALeh9xjgyoDVYmpuitqbRY3saY0FOAEOx0KAuy219+Qc11jSAwFuU+8xwGFfCHA4EgJc/whvyxHgNlSAQ+8IcDgSAhyOhAC3oQIcekeAw5EQ4HAkBLgNFeDQOwIcjoQAhyMhwG2oAIfeEeBwJAQ4HAkBbkMFOPSOAIcjIcDhSAhwGyrAoXcEOBwJAQ5HQoDbUAEOvSPA4UgIcDgSAtyGCnDoHQEOR0KAw5EQ4DZUgEPvCHA4EgIcjoQAt6ECHHpHgMOREOBwJAS4DR0+8F574+18TYBuGM7n0g88AQ69I8DhSAhwG/rTn3348Pobb+ZrAnTDcD4/+vnHz53dmsN5HgR6ZDib7773/uLzPPQ6z+iV8Tznue3ZDGzprgLc8CfBN9/yGzj0yfAGMZzPpR94w3l+7Q3/JAB9MpzND378k8Xneeh1ntEr43nOc9uzGdjSXQW4weFD8pVXXnt4+uY7D5988ot8jYCbM5zDV19/8+Gtt995PJ95Zqf80Qc//uw8Az0wnOHhPA9nc+lfnw4OveN59ps49MKYGU49zz2YgS3dXYAb/jQ4pOjhNx2vvvb6w1/99Svkpg7ncPzro6W/rRgd3lDG8/zXr7z63N7krX3j6dPH87zmw248z8MezjO3djiDw1kczuSa87y1GdjS3QW4weFDcngxhg/M4R+Ck1s6nMNz3hycZ/bkzz786OzzPOzhPHNrhzM4nMVT/2DdixnY0l0GOJIkySObgS0V4EiSJDszA1sqwJEkSXZmBrZUgCNJkuzMDGypAEeSJNmZGdhSAY4kSbIzM7ClAhxJkmRnZmBLBTiSJMnOzMCWCnAkSZKdmYEtFeBIkiQ7MwNbKsCRJEl2Zga2VIAjSZLszAxsqQBHkiTZmRnYUgGOJEmyMzOwpQIcSZJkZ2ZgSwU4kiTJzszAlgpwJEmSnZmBLRXgSJIkOzMDWyrAkSRJdmYGtlSAI0mS7MwMbKkAR5Ik2ZkZ2NIX/uqN9x9IkiTZjxnY0hceAAAA0BUZ2FIBDgAAoDMysKUCHAAAQGdkYEsFOAAAgM7IwJYKcAAAAJ2RgS0V4AAAADojA1sqwAEAAHRGBrZUgAMAAOiMDGypAAcAANAZGdhSAQ4AAKAzMrClAhwAAEBnZGBLBTgAAIDOyMCWCnAAAACdkYEtFeAAAAA6owxr3/72tx+ePHny8PTpUwEOAACgV8agNgS30jHECXAAAACd0QpwgwIcAABAhwhwAAAAO0OAAwAA2BkCHAAAwM4Q4AAAAHaGAAcAALAzBDgAAICdIcABAADsDAEOAABgZwhwAAAAO0OAAwAA2BkCHIDVvPDlLz3jJbjUPtfg3O8316/ZAwAGBDgAq8jwcalAcok9zqF1/0t8f+euB4ARAQ7AybSCSFnPnpxrBaLsG7+2bM2Xe9TqOZfjVm+LqbUjU/XaulYdAAQ4ACfTChRlPXtyLudHpvpq41a9tn/21GjVB6b2Xbp3aY3cp9UH4L4R4ACcTCtUZPgomZormeprjWtBpzae2nukVS9ZstfS2si459y+ADAgwAE4mQwaZb12neOcK5nqa41rj6ecy1pel7TqSXnP2pq1tSWPEQAEOACryHCRISqvc9xiqq81ntp/yXXJ0np5z6n7l9TquS7HAFBDgAOwmjFwZPCozS0NJlN9rXHeJ/eo1XOuVq/V5tbU5kam6rW1rX4AEOAA7J4MPgBwdAQ4ALtHgANwbwhwAHaPAAfg3hDgAAAAdoYABwAAsDMEOAAAgJ0hwAEAAOwMAQ4AAGBnCHAAAAA7Q4ADAADYGQIcAADAzhDgAAAAdoYABwAAsDMEOAAAgJ0hwAEAAOwMAQ4AAGBnCHAAAAA7Q4ADAADYGQIcAADAzhDgOuWFF7/yaK2WJnPz6Julr1u+zrU1c/MDS3qwT/K1rb2+OV/rwfHJM+Ac9I8A1xH5w5M/QFnLcdZa+6BPpl77GnN9Od8aOy/HJV/L2uubY9wnzsH+EOA6ovZhOkWtJ2s5Rr+Mr9XS12yuL+db41oNx6T2+uYY90ftXKB/BLhOWfIDlT05btVGpuawHUtfl6m+cS7ny9rcfDI1h31Qew1zjPujdi7QPwJcp8z9QI3zZU+OW7WRqTlsx9LXpTwDuaZWK+t5XZtPpubQP63XrzwrrR4cm3z9nYN9IMB1ytQPUOsH7NRaij5Y83rk65jj7Mvr2nzWUuyHpa+Z1xfOwH4Q4Dql9QPUqg/U5qZqKfpg7etRrmu9rrWe1nzWUuyDU14vry8GnIF9IMB1Su0HqFZLsifHJVNz2I41r8u4Zuq1b41rtRpTc+iTU1+z2pnA8cnX2xnYBwJcp9R+gMo319Ybbc7lfMncPLah9bpkPV/nXJNzS3tazM2jL/J1bb3GOZfzOD75+jsH+0CA65TaD1D+cC3twb5ovW5ZW/I6z/XMzWO/5Gvbep2n5nAf5BlwDvaBAAfsAG+qAIASAQ7YAQIcAKBEgAMAANgZAhwAAMDOEOAAAAB2hgB3JT7/hS8+emmute9aenosR+ESr3Ftfa22hkvtg+tzzlka161dj+uQr+m1Xp+8z6W4xp73igB3ZeZ+0Gpvkq3rpFyba7JW1sfrnCuva3vnnjnG5cnnP+dq1+M456dex/L6lDEuSz6/+bpNMTc/kD15r/K6vG+uG+vl17wuadVxPrXXKa9LTumZq42Ue43jVn1qH5yGAHcllh7U1g9Qq1aS83nP2vySryNTe4206lhP+Trm16XU+mu1kZwrH0PSquN2rDkXrd7WXq36SGt+bozLUnt+a7WBWn1JrTXO+hLWrEEdAW5jzvlBSIY9yn1yz7xXfk2m9hpp1XE+5eu55HmuvV65R2ufrJ/Si8tQe/3OIffI8UjrjLXqI635HOO61J7vWm2gVR9YO3cql9zr3hHgbkge3GGctbFeux7Hc7VynPXa17zOWvk119TW4Tzyec3XIet5XRuXtZzLfU4Z47qUz3c+73PjsZavX1KrDZT3zZ5abazXaNVxOvnct16n1nNe66n1zu2Xczlfq+cY5yHAAQAA7AwBDgAAYGcIcAAAADtDgAMAANgZAhwAAMDOEOAAAAB2hgAHAACwMwQ4AACAnSHAAQAA7AwBDgAAYGcIcAAAADtDgAMAANgZAhwAAMDOEOAAAAB2hgAHAACwMwQ4AACAnSHAAQAA7AwBDgAAYGcIcAAAADtDgAMAANgZAhwAAMDOEOAAAAB2hgAHAACwMwQ4AACAnSHAAQAA7IzZAPfzjz95IEmSZD8KcCRJkjtTgCNJktyZAhxJkuTOFOBIkiR3pgBHkiS5MwU4kiTJnSnAkSRJ7kwBjiRJcmcKcCRJkjtTgCNJktyZAhxJkuTOFOBIkiR3pgBHkiS5MwU4kiTJnSnAkSRJ7kwBjiRJcmcKcCRJkjtTgCNJktyZAhxJkuTOFOBIkiR3pgBHkiS5MwU4kiTJnSnAkSRJ7kwBjiRJcmcKcCRJkjtTgCNJktyZAhxJ/tIXvvylR/O65ZKeS3rr+5HsWwGOvFOvEQjO3W9qfTk31TfOz/WkPQa4a+9Pcr8KcOSdeo1wcO6eU+uXBri1wUqAI7knBTjyDp0LH+N8ra81t7SW9XEux2num/O5d9ZzPvtqj2VJf22uNl/W82urr6xNzWc958vHRfIYCnDkHTr1oV770K8FhFpvrqvtkWtqPTVrgaTWX6tNzdUeV96n7J3qKeeyPrUu19fGuUdrbc7lmOQxFODIO3TqQ70WMDJItHpr60prPdmftXKf2nWtN2tTc619y95xPNWTe2W9NZf7Zz17sp69OZdjksdQgCPv1NYH+5Ig0eptXZfjrNd60qyP9816OZf12j5lrVyX17W9a/eprcne2lztOsdTe5S1nMsxyWMowJF3ai2AlHOtvrzOcW1urq92XVpbn7Wp/pyr9Z1zPbVvbW68zvHc3NJ7t/YgeRwFOPLOHcNAftBP1bNnyXytb0kt51r7p2V/9szVcr5Wn9o/57Ne663N1e7Xms+9WmOSx1CAI0mS3JkCHEmS5M4U4EiSJHemAEeSJLkzBTiSJMmdKcCRJEnuTAGOJElyZwpwJEmSO1OAI0mS3JkCHEmS5M4U4EiSJHemAEeSJLkzBTiSJMmdKcCRHfn5L3zxudo1vNV9yD06/Hz4GWHvCnC8meUbYr5BerP81Hwecnwpr7XvGnt6LFu79rlYsm5JDy+n55vXVoDjTR3f1MoANxXkanP5Nc29s681l+Opem1cu29r/7nrclyr57p8XFnP/tp+2ZP75XX2TY2zVu4x15v9ZW3JmuzJcdbK+jg3tW9e537lHtlb9mUt58vHlH3lPWprci7rU3umtbnaOGtz87Vx+RizL+ezpzXOuXScz/V5nT05n/tlH3muAhxvau2NLGs5Hmu1N9F0Sc85c0v7cm5u3KqP40t8X2v6aq5Zm48/x9k/tTZrNWvzWcvx3NzSWq2e41a9Nc56uqSv1jNcT605xUvs03qMta8ta2tb46Xmva9xD/JUBThuavkBMl7nG2CtXqulp84t2TP7s9aay71r30vWy3H257qca83X+k61tnbqXmn2zq2r9Y57tNbW6rU1tb6s57radTnO9bVxqz41zrla35KerJ1Sb+0zVT/F2h5LvreWtTW12lJra7OWY/JaCnC8ueUbXOt6Sf/UuFVvjZeYe0/tMTU3NZ/1JfdKyzWtda36lEsfS20+a+U456bqWcvxEvP7qO2x5PG1+mvjltnXGufXNOdrfa25HK+1tf8pzu2R9Ry3ajk31bPEqfWtuVadXKsAR+5Ab/6f6nm4vZ7zT/U8sDcFOHIH+vAgSZYKcCRJkjtTgCNJktyZAhxJkuTOFOBIkiR3pgDHXbvFP+7f4p5LvdRju9Q+p7jFPW9pL99fL4+D5HkKcNy1W3wYbXHPpfb62Hp9XLe0l+egl8dB8jwFOO7a8cMoP5RyvGau1Td3z9oe+TWv5/apjWu11tqcT7Oe++R8y1Z/7ftu9bS+TvXmdW08Vy/nsmduvMTaY82vtf7aXG0+v7ZszWc9x3P1ubnsmeqdmmvN5761nrTVm2OyRwU47trhjbZ8sz3njXdqbeseS9e0ajleamtdrV4+Rzmf47l6rWdq/1pvzmVPa1yz1VM+prnemkseb8vavcu9anM15/pyfmrcum5Z+x5yPGerP+vl83LJ52jJXKunVSd7UoDjrs032hyf4tTacm6qr7VmqrbG1j6tevZc6gOs1Zf1ufvV5nJcs9VT3m/JvdM1a+b6T91zSd/SPcv5ud6yZ+3zN9Xfqp/aM9c3NTfnOWvJWynAcdfWPlzKD51a71zPXF95z9Zca33rOse5bq5e26NVq41rtdp1rT+vsz9t9WQtx7W12XPq/FTfkjWtem28ZM/aujXW1o73rM1lT2ufnK/1tXpavXPXc7buV6u15sc9spZryJ4U4EhyBwoUl9Xzyb0rwJEkSe5MAY4kSXJnCnAkSZI7U4AjSZLcmQIcSZLkzhTgSJIkd6YAR5IkuTMFOJIkyZ0pwJEkSe5MAY4kSXJnCnAkSZI7U4AjSZLcmQIcSZLkzhTgSN7cF178yl35m9/7w+eeA5I8RwGO5E3NcHMv/vFrrzz3XJDkWgU4kjc1g829+Cu/NJ8LklyrAEfypmawuSfzuSDJtQpwJG9qhpp7Mp8LklyrAEfypmaouSfzuSDJtbYC3IsvvijAkby8GWruyXwuSHKtrQD39OlTAY7k5c1QM+Wv/quvPvzBq39ZdZjL/nMdyNolzeeCJNc6BriWAhzJi5qhZsp/+J3/+PBP/uSPnqv/xne/9TiX9XOdCnBTc0vN54Ik15qBLRXgSF7UDDVTfu6b33gMcD/84P3PagNDbZjL/nOdCmlTc0vN54Ik15qBLRXgSF7UDDVTliHt17/+teZc6UjWsq/mVN84N9UzZz4XJLnWDGypAEfyomaombIV0ubm0lroWlqrzU31TZnPBUmuNQNbKsCRvKgZaqa81H/EsDRwTfXlXI6XmM8FSa41A1sqwJG8qBlq7sl8LkhyrRnYUgGO5EXNUHNP5nNBkmvNwJYKcCQvaoaaezKfC5Jcawa2VIAjeVEz1NyT+VyQ5FozsKUCHMmLmqHmnszngiTXmoEtFeBIXtQMNffi3/r6bz/3XJDkWjOwpQIcyYv6m9/7w+fCzT2YzwNJnmMGtlSAI3lx//F/+dbDr1RCzhH1mzeS1zADWyrAkSRJdmYGtlSAI0mS7MwMbKkAR5Ik2ZkZ2FIBjiRJsjMzsKUCHEmSZGdmYEsFOJIkyc7MwJYKcCRJkp2ZgS0V4EiSJDszA1sqwJEkSXZmBrZUgCNJkuzMMag9efLkOQU4kiTJDm0FuJdeekmAI0mS7NExwL388svP/fZNgCNJkuzQ8t+7ff/7338mvAlwJEmSHVqGtZoCHEmSZGdmYEv/H14k5YQZLBpYAAAAAElFTkSuQmCC>

[image14]: <data:image/png;base64,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>

[image15]: <data:image/png;base64,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>