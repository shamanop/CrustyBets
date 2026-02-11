"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "neon" | "sticker";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-lobster-red hover:bg-crab-orange text-white font-bold",
  secondary:
    "bg-deep-teal hover:bg-bright-teal text-white font-bold",
  neon: [
    "bg-transparent border-2 border-neon-green text-neon-green font-bold",
    "shadow-[0_0_7px_var(--color-neon-green),0_0_10px_var(--color-neon-green)]",
    "hover:bg-neon-green/10",
  ].join(" "),
  sticker: [
    "bg-sticker-white text-bg-void font-[family-name:var(--font-sticker)] font-bold",
    "rotate-[-2deg] border-2 border-white",
    "shadow-[2px_2px_0px_rgba(0,0,0,0.3),4px_4px_8px_rgba(0,0,0,0.2)]",
    "hover:rotate-0 hover:scale-105",
    "hover:shadow-[3px_3px_0px_rgba(0,0,0,0.35),6px_6px_16px_rgba(0,0,0,0.25)]",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-lg font-bold
        transition-all duration-200 ease-in-out
        cursor-pointer select-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
        ${className}
      `}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
