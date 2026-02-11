"use client";

interface GrungeOverlayProps {
  opacity?: number;
  className?: string;
}

/**
 * Noise/grunge texture overlay for containers.
 * Place inside a relative-positioned parent. Renders an absolutely positioned
 * layer with a repeating SVG noise pattern and mix-blend-mode: overlay.
 */
export default function GrungeOverlay({
  opacity = 0.15,
  className = "",
}: GrungeOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={`
        absolute inset-0 z-10
        pointer-events-none
        mix-blend-overlay
        ${className}
      `}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}
