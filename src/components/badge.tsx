import * as React from "react";

import { cn } from "@streamersuite/story-previews/lib/utils";

export type BadgeVariant = "default" | "secondary" | "success" | "warning" | "destructive";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClassNames: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-sm px-1.5 text-[0.625rem] font-medium",
        variantClassNames[variant],
        className,
      )}
      {...props}
    />
  );
}
