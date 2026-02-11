"use client";

import { type ReactNode, useMemo } from "react";

type StickerColor =
  | "lobster-red"
  | "crab-orange"
  | "deep-teal"
  | "neon-green"
  | "hot-pink";

interface StickerTagProps {
  children: ReactNode;
  color?: StickerColor;
  rotation?: number;
  className?: string;
}

const colorClasses: Record<StickerColor, string> = {
  "lobster-red": "bg-lobster-red",
  "crab-orange": "bg-crab-orange",
  "deep-teal": "bg-deep-teal",
  "neon-green": "bg-neon-green",
  "hot-pink": "bg-hot-pink",
};

export default function StickerTag({
  children,
  color = "lobster-red",
  rotation,
  className = "",
}: StickerTagProps) {
  const defaultRotation = useMemo(
    () => (rotation !== undefined ? rotation : Math.random() * 6 - 3),
    [rotation]
  );

  return (
    <span
      className={`
        inline-block px-4 py-1
        font-[family-name:var(--font-sticker)] font-bold text-white
        border-2 border-white
        shadow-[2px_2px_0px_rgba(0,0,0,0.3),3px_3px_6px_rgba(0,0,0,0.2)]
        transition-all duration-200 ease-in-out
        hover:!rotate-0 hover:scale-110
        hover:shadow-[3px_3px_0px_rgba(0,0,0,0.35),5px_5px_12px_rgba(0,0,0,0.25)]
        cursor-default select-none
        ${colorClasses[color]}
        ${className}
      `}
      style={{ transform: `rotate(${defaultRotation}deg)` }}
    >
      {children}
    </span>
  );
}
