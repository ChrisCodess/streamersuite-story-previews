import * as React from "react";

import { cn } from "@streamersuite/story-previews/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm";
}

export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, size = "default", ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-lg bg-card py-4 text-xs/relaxed text-card-foreground ring-1 ring-foreground/10 data-[size=sm]:gap-3 data-[size=sm]:py-3",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardSectionProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-1 px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: CardSectionProps) {
  return <div data-slot="card-title" className={cn("text-sm font-medium", className)} {...props} />;
}

export function CardDescription({ className, ...props }: CardSectionProps) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-xs/relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export function CardAction({ className, ...props }: CardSectionProps) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: CardSectionProps) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: CardSectionProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  );
}
