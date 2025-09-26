import { ImageResponse } from 'next/og';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import type { Tables } from '@/lib/types';

export const size = {
  width: 1200,
  height: 630
};

export const contentType = 'image/png';
export const runtime = 'edge';
export const revalidate = 300;

type RouteOgRecord = Pick<Tables<'routes'>, 'display_name' | 'color' | 'corridors' | 'est_buses' | 'hours'>;

const fallbackImage = () =>
  new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
          color: '#f8fafc',
          gap: '16px'
        }}
      >
        <div style={{ fontSize: '48px', fontWeight: 700 }}>DaRoutes Wiki</div>
        <div style={{ fontSize: '28px', opacity: 0.85 }}>Route preview unavailable</div>
        <div style={{ fontSize: '22px', opacity: 0.7 }}>daroutes.org</div>
      </div>
    ),
    { ...size }
  );

export default async function RouteOgImage({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseServerClient();
  const { data: routeData } = await supabase
    .from('routes')
    .select('display_name, color, corridors, est_buses, hours')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!routeData) {
    return fallbackImage();
  }

  const route = routeData as RouteOgRecord;
  const color = route.color && route.color.length ? route.color : '#2563eb';
  const corridorTags = (route.corridors ?? []).slice(0, 4) as string[];
  const detailPills = [
    route.est_buses ? `${route.est_buses} buses` : null,
    route.hours ?? null
  ].filter(Boolean) as string[];

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          padding: '72px',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 60%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.7,
            right: '-140px',
            top: '-120px',
            filter: 'blur(4px)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.35,
            left: '-160px',
            bottom: '-140px',
            filter: 'blur(6px)'
          }}
        />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '26px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.85 }}>
            DaRoutes
          </div>
          <div style={{ fontSize: '68px', fontWeight: 700, lineHeight: 1.05 }}>{route.display_name}</div>
          {corridorTags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
              {corridorTags.map((corridor) => (
                <div
                  key={corridor}
                  style={{
                    fontSize: '24px',
                    padding: '8px 20px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(15,23,42,0.6)',
                    border: '1px solid rgba(248,250,252,0.2)'
                  }}
                >
                  {corridor}
                </div>
              ))}
            </div>
          )}
          {detailPills.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {detailPills.map((pill) => (
                <div
                  key={pill}
                  style={{
                    fontSize: '22px',
                    padding: '10px 24px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(37,99,235,0.25)',
                    border: '1px solid rgba(148,163,184,0.4)'
                  }}
                >
                  {pill}
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: '22px', color: 'rgba(248,250,252,0.8)', marginTop: '24px' }}>
            daroutes.org - Community transit knowledge base
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
