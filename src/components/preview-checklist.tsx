import * as React from "react";

import { cn } from "@streamersuite/story-previews/lib/utils";

export interface PreviewChecklistItem {
  label: string;
  isComplete: boolean;
}

export interface PreviewChecklistProps extends React.HTMLAttributes<HTMLDivElement> {
  items: PreviewChecklistItem[];
  title: string;
}

export function PreviewChecklist({ className, items, title, ...props }: PreviewChecklistProps) {
  return (
    <div
      data-slot="preview-checklist"
      className={cn(
        "grid w-72 gap-2 rounded-md border border-border bg-card p-3 text-card-foreground",
        className,
      )}
      {...props}
    >
      <div className="text-sm font-medium">{title}</div>
      <ul className="grid gap-1.5 text-xs/relaxed">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              data-complete={item.isComplete}
              className="size-2 rounded-full bg-muted-foreground/40 data-[complete=true]:bg-success"
            />
            <span className={cn(item.isComplete ? "text-foreground" : "text-muted-foreground")}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
