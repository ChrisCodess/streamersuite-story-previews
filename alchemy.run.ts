import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

export default Alchemy.Stack(
  "streamersuite-story-previews",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const site = yield* Cloudflare.StaticSite("Storybook", {
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

    return {
      url: site.url,
      workerName: site.workerName,
    };
  }),
);
