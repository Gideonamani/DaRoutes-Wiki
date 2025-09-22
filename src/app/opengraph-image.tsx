import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630
};

export const contentType = 'image/png';
export const runtime = 'edge';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          padding: '64px',
          background: 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
          color: '#f8fafc'
        }}
      >
        <div style={{ fontSize: '48px', fontWeight: 700 }}>DaRoutes Wiki</div>
        <div style={{ fontSize: '28px', maxWidth: '700px', lineHeight: 1.3 }}>
          Plan, curate, and publish Dar es Salaam bus routes with community insights.
        </div>
        <div style={{ fontSize: '20px', opacity: 0.9 }}>daroutes.org - Transit knowledge for Dar es Salaam</div>
      </div>
    ),
    { ...size }
  );
}
