import * as React from "react";

import { cn } from "@streamersuite/story-previews/lib/utils";

export type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonVariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantOptions {}

const baseClassName =
  "inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-disabled:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variantClassNames: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border-border bg-background hover:bg-input/50 hover:text-foreground",
  ghost: "hover:bg-muted hover:text-foreground",
  destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
};

const sizeClassNames: Record<ButtonSize, string> = {
  default: "h-7 gap-1 px-2",
  sm: "h-6 gap-1 px-2",
  lg: "h-8 gap-1 px-2.5",
  icon: "size-7",
};

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: ButtonVariantOptions = {}) {
  return cn(baseClassName, variantClassNames[variant], sizeClassNames[size], className);
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "default", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      data-slot="button"
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
});
