import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'שווארמה ביס';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F59E0B 0%, #E85D25 50%, #C73E1D 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo circle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            marginBottom: 24,
            fontSize: 64,
          }}
        >
          🌯
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-1px',
            textShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          שווארמה ביס
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: 'rgba(255,255,255,0.9)',
            marginTop: 16,
            fontWeight: 500,
          }}
        >
          מצאו את השווארמה הטובה בישראל 🇮🇱
        </div>

        {/* Decorative bottom bar */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'rgba(255,255,255,0.3)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
