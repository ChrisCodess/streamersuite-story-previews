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

      yield* GitHub.Comment("storybook-preview-comment", {
        owner: repository.owner,
        repository: repository.name,
        issueNumber: pullRequestNumber,
        body: Output.interpolate`
          ## Storybook Preview

          - **Stage:** \`${process.env.STAGE ?? `pr-${pullRequestNumber}`}\`
          - **Storybook:** ${site.url}
          - **Page story:** ${site.url}/?path=/story/pages-storybook-pr-site--screen
          - **Username:** \`admin\`
          - **Password:** \`${previewPassword ?? "not available"}\`

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

function getGitHubRepository() {
  const [owner, name] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];

  if (!owner || !name) {
    return undefined;
  }

  return { owner, name };
}
