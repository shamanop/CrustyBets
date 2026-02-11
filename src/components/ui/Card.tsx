"use client";

import { type CSSProperties, type ReactNode } from "react";

type CardVariant = "default" | "sticker" | "neon" | "glass";

interface CardProps {
  variant?: CardVariant;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    "bg-bg-wall/80 border border-white/10 rounded-xl p-6",
  sticker: [
    "bg-sticker-white text-bg-void rounded-sm p-6",
    "border-3 border-sticker-white",
    "shadow-[2px_2px_0px_rgba(0,0,0,0.3),4px_4px_8px_rgba(0,0,0,0.2)]",
  ].join(" "),
  neon: [
    "bg-transparent rounded-xl p-6",
    "border border-neon-green",
    "shadow-[0_0_7px_var(--color-neon-green),0_0_14px_var(--color-neon-green),inset_0_0_7px_var(--color-neon-green)]",
  ].join(" "),
  glass:
    "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6",
};

export default function Card({
  variant = "default",
  children,
  className = "",
  style,
}: CardProps) {
  return (
    <div
      className={`overflow-hidden ${variantClasses[variant]} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
