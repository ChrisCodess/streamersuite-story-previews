import type { Meta, StoryObj } from "@storybook/react-vite";

import { BranchStorybookPanel } from "./branch-storybook-panel";

const meta = {
  title: "Features/Branch Storybook Panel",
  component: BranchStorybookPanel,
  args: {
    repository: "streamersuite-ui",
    pullRequestNumber: 128,
    branchName: "feature/broadcast-summary-card",
    siteUrl: "https://pr-128.streamersuite-storybook.workers.dev",
    stories: [
      {
        id: "components-card--default",
        name: "Card / Default",
        component: "src/components/card.tsx",
        href: "?path=/story/components-card--default",
        status: "changed",
      },
      {
        id: "features-broadcast-summary-card--default",
        name: "Broadcast Summary Card / Default",
        component: "src/features/broadcast-summary-card",
        href: "?path=/story/features-broadcast-summary-card--default",
        status: "added",
      },
    ],
  },
} satisfies Meta<typeof BranchStorybookPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
