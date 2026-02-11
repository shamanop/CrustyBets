"use client";

import { type ReactNode, type ElementType } from "react";

type NeonColor = "green" | "pink" | "purple" | "yellow";

interface NeonTextProps {
  color?: NeonColor;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  flicker?: boolean;
}

const colorClasses: Record<NeonColor, string> = {
  green: "neon-text-green",
  pink: "neon-text-pink",
  purple: "neon-text-purple",
  yellow: "neon-text-yellow",
};

export default function NeonText({
  color = "green",
  as: Tag = "span",
  children,
  className = "",
  flicker = true,
}: NeonTextProps) {
  return (
    <Tag
      className={`
        font-[family-name:var(--font-display)]
        ${colorClasses[color]}
        ${flicker ? "animate-[neon-flicker_3s_infinite]" : ""}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
}
