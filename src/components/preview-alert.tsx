import * as React from "react";

import { cn } from "@streamersuite/story-previews/lib/utils";

export type PreviewAlertTone = "info" | "success" | "warning";

export interface PreviewAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  tone?: PreviewAlertTone;
}

const toneClassNames: Record<PreviewAlertTone, string> = {
  info: "border-primary/20 bg-primary/10 text-primary",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  warning: "border-amber-500/25 bg-amber-500/10 text-amber-800",
};

const dotClassNames: Record<PreviewAlertTone, string> = {
  info: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
};

export function PreviewAlert({
  className,
  children,
  title,
  tone = "info",
  ...props
}: PreviewAlertProps) {
  return (
    <div
      data-slot="preview-alert"
      data-tone={tone}
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2 text-xs/relaxed",
        toneClassNames[tone],
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("mt-1 size-1.5 shrink-0 rounded-full", dotClassNames[tone])}
      />
      <div className="grid min-w-0 gap-0.5">
        <div className="font-medium text-foreground">{title}</div>
        {children ? <div className="text-muted-foreground">{children}</div> : null}
      </div>
    </div>
  );
}
