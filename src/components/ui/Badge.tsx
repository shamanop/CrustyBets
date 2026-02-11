"use client";

import { type ReactNode } from "react";

type BadgeVariant = "default" | "lobster" | "ocean" | "neon" | "gold";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-bg-wall text-sticker-white border border-white/20",
  lobster:
    "bg-lobster-red text-white",
  ocean:
    "bg-deep-teal text-white",
  neon:
    "bg-neon-green/10 text-neon-green border border-neon-green/50",
  gold:
    "bg-gold/20 text-gold border border-gold/50",
};

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5
        text-xs font-bold font-[family-name:var(--font-sticker)]
        rounded-full uppercase tracking-wider
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
