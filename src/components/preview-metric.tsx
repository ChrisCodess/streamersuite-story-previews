import * as React from "react";

import { cn } from "@streamersuite/story-previews/lib/utils";

export interface PreviewMetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  delta?: string;
}

export function PreviewMetric({ className, delta, label, value, ...props }: PreviewMetricProps) {
  return (
    <div
      data-slot="preview-metric"
      className={cn(
        "grid min-w-32 gap-1 rounded-md border border-border bg-card px-3 py-2 text-card-foreground",
        className,
      )}
      {...props}
    >
      <div className="text-[0.625rem] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-lg font-semibold">{value}</div>
        {delta ? <div className="text-xs/none text-success">{delta}</div> : null}
      </div>
    </div>
  );
}
