# streamersuite-story-previews

Minimal Storybook PR site prototype for StreamerSuite UI work.

## Shape

- `alchemy.run.ts` declares one Cloudflare `StaticSite`.
- `alchemy/storybook-worker.ts` gates the static Storybook assets with Basic Auth.
- Each PR can get its own deployed site by using an isolated Alchemy stage, for example `pr-42`.
- `.github/workflows/pr-preview.yml` deploys `pr-{number}` on PR open/sync and destroys it on PR close.

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
STORYBOOK_PASSWORD=unused bun alchemy destroy --stage pr-42
```

## GitHub Actions

The PR preview workflow expects these repository secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

`GITHUB_TOKEN` is provided by GitHub Actions and is used to post/update the PR preview comment.
The Storybook Basic Auth password is generated per deploy with `openssl rand -hex 24` and posted in the PR comment.
