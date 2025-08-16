// components/DashedFrame.tsx
'use client';
import { PropsWithChildren } from 'react';

type DashedFrameProps = PropsWithChildren<{
  /** px — default 16 sejalan dengan rounded-2xl Tailwind */
  radius?: number;
  /** px — default 1.5 */
  strokeWidth?: number;
  /** css color — default '#9ca3af' */
  stroke?: string;
  /** px — panjang garis, default 18 */
  dash?: number;
  /** px — jarak antar garis, default 8 */
  gap?: number;
  /** class tambahan untuk wrapper */
  className?: string;
}>;

export default function DashedFrame({
  children,
  radius = 16,
  strokeWidth = 1.5,
  stroke = '#9ca3af',
  dash = 18,
  gap = 8,
  className = '',
}: DashedFrameProps) {
  return (
    <div className={`relative ${className}`} style={{ borderRadius: `${radius}px` }}>
      {children}

      {/* SVG untuk border dashed */}
      <svg
        className="pointer-events-none absolute inset-0"
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={`calc(100% - ${strokeWidth}px)`}
          height={`calc(100% - ${strokeWidth}px)`}
          rx={radius}
          ry={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          shapeRendering="geometricPrecision"
        />
      </svg>
    </div>
  );
}