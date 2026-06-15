import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as GitHub from "alchemy/GitHub";
import * as Output from "alchemy/Output";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

export default Alchemy.Stack(
  "streamersuite-story-previews",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), GitHub.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const site = yield* Cloudflare.StaticSite("Storybook", {
      name: getWorkerName(),
      command: "bun run storybook:build",
      outdir: "storybook-static",
      main: "./alchemy/storybook-worker.ts",
      env: {
        STORYBOOK_PASSWORD: Config.redacted("STORYBOOK_PASSWORD"),
      },
      assets: {
        runWorkerFirst: true,
        htmlHandling: "auto-trailing-slash",
        notFoundHandling: "single-page-application",
      },
      dev: {
        command: "bun run dev",
        url: "http://localhost:6007",
      },
    });

    const pullRequestNumber = getPullRequestNumber();
    const repository = getGitHubRepository();

    if (pullRequestNumber && repository) {
      const previewPassword = process.env.STORYBOOK_PASSWORD;
      const changedStories = getChangedStories();
      const changedStoriesMarkdown = Output.map(site.url, (siteUrl) =>
        formatChangedStories(siteUrl, changedStories),
      );

      yield* GitHub.Comment("storybook-preview-comment", {
        owner: repository.owner,
        repository: repository.name,
        issueNumber: pullRequestNumber,
        body: Output.interpolate`
          ## Storybook Preview

          - **Stage:** \`${process.env.STAGE ?? `pr-${pullRequestNumber}`}\`
          - **Storybook:** ${site.url}
          - **Username:** \`admin\`
          - **Password:** \`${previewPassword ?? "not available"}\`

          ### Changed Stories

          ${changedStoriesMarkdown}

          Built from \`${process.env.GITHUB_SHA?.slice(0, 7) ?? "local"}\`.
        `,
      });
    }

    return {
      url: site.url,
      workerName: site.workerName,
    };
  }),
);

function getPullRequestNumber() {
  const rawPullRequestNumber = process.env.PULL_REQUEST;

  if (!rawPullRequestNumber) {
    return undefined;
  }

  const pullRequestNumber = Number(rawPullRequestNumber);

  return Number.isInteger(pullRequestNumber) ? pullRequestNumber : undefined;
}

function getWorkerName() {
  const stage = process.env.STAGE ?? "local";
  const normalizedStage = stage
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `streamersuite-story-previews-${normalizedStage || "local"}`;
}

interface ChangedStory {
  id: string;
  title: string;
  name: string;
  status: "added" | "changed";
  matchedFiles: string[];
  commit?: {
    sha: string;
    shortSha: string;
    url?: string;
  };
}

function getChangedStories() {
  const rawChangedStories = process.env.CHANGED_STORIES_JSON;

  if (!rawChangedStories) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(rawChangedStories);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isChangedStory);
  } catch {
    return [];
  }
}

function isChangedStory(value: unknown): value is ChangedStory {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.name === "string" &&
    (candidate.status === "added" || candidate.status === "changed") &&
    Array.isArray(candidate.matchedFiles) &&
    candidate.matchedFiles.every((file) => typeof file === "string") &&
    (candidate.commit === undefined || isCommitRef(candidate.commit))
  );
}

function isCommitRef(value: unknown) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.sha === "string" &&
    typeof candidate.shortSha === "string" &&
    (candidate.url === undefined || typeof candidate.url === "string")
  );
}

function formatChangedStories(siteUrl: string | undefined, stories: ChangedStory[]) {
  if (stories.length === 0) {
    return "- No changed stories detected.";
  }

  return stories
    .map((story) => {
      const label = `${story.title} / ${story.name}`;
      const storyUrl = siteUrl
        ? `${siteUrl}/?path=/story/${story.id}`
        : `?path=/story/${story.id}`;
      const commit = story.commit?.url
        ? ` in [${story.commit.shortSha}](${story.commit.url})`
        : story.commit
          ? ` in \`${story.commit.shortSha}\``
          : "";
      const files = story.matchedFiles.map((file) => `\`${file}\``).join(", ");

      return `- **${story.status}** [${label}](${storyUrl})${commit} — ${files}`;
    })
    .join("\n");
}

function getGitHubRepository() {
  const [owner, name] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];

  if (!owner || !name) {
    return undefined;
  }

  return { owner, name };
}
