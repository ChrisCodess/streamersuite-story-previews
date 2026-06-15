# streamersuite-story-previews

Minimal Storybook PR site prototype for StreamerSuite UI work.

## Shape

- `alchemy.run.ts` declares one Cloudflare `StaticSite`.
- `alchemy/storybook-worker.ts` gates the static Storybook assets with Basic Auth.
- Each PR can get its own deployed site by using an isolated Alchemy stage, for example `pr-42`.

## Commands

Install dependencies:

```bash
bun install
```

Run Storybook locally:

```bash
bun run dev
```

Build the static Storybook output:

```bash
bun run storybook:build
```

Deploy a PR stage after confirming the deploy:

```bash
STORYBOOK_PASSWORD=change-me bun alchemy deploy --stage pr-42
```

Destroy that PR stage after confirming cleanup:

```bash
bun alchemy destroy --stage pr-42
```
