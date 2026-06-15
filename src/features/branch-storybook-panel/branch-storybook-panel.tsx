import { Badge } from "@streamersuite/story-previews/components/badge";
import { buttonVariants } from "@streamersuite/story-previews/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@streamersuite/story-previews/components/card";
import { cn } from "@streamersuite/story-previews/lib/utils";

export type ChangedStoryStatus = "added" | "changed" | "removed";

export interface ChangedStoryLink {
  id: string;
  name: string;
  href: string;
  component?: string;
  status: ChangedStoryStatus;
}

export interface BranchStorybookPanelProps {
  repository: string;
  pullRequestNumber: number;
  branchName: string;
  siteUrl: string;
  stories: ChangedStoryLink[];
  className?: string;
}

const statusVariant: Record<ChangedStoryStatus, "success" | "warning" | "destructive"> = {
  added: "success",
  changed: "warning",
  removed: "destructive",
};

export function BranchStorybookPanel({
  repository,
  pullRequestNumber,
  branchName,
  siteUrl,
  stories,
  className,
}: BranchStorybookPanelProps) {
  return (
    <Card className={cn("w-full max-w-3xl", className)}>
      <CardHeader>
        <CardTitle>{repository}</CardTitle>
        <CardDescription>
          PR #{pullRequestNumber} · {branchName}
        </CardDescription>
        <CardAction>
          <Badge variant="secondary">{stories.length} stories</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-border bg-muted px-3 py-2 text-[0.625rem] font-medium uppercase text-muted-foreground">
            <span>Story</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-border">
            {stories.map((story) => (
              <a
                key={story.id}
                className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2 text-xs/relaxed transition-colors hover:bg-muted/60"
                href={story.href}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground">{story.name}</span>
                  {story.component ? (
                    <span className="block truncate text-muted-foreground">{story.component}</span>
                  ) : null}
                </span>
                <Badge variant={statusVariant[story.status]}>{story.status}</Badge>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <a className={buttonVariants()} href={siteUrl}>
          Open Storybook
        </a>
      </CardFooter>
    </Card>
  );
}
