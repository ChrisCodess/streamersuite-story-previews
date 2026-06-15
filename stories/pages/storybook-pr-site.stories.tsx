import type { Meta, StoryObj } from "@storybook/react-vite";

import { BranchStorybookPanel } from "@streamersuite/story-previews/features/branch-storybook-panel";

function StorybookPrSitePage() {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <BranchStorybookPanel
        repository="streamersuite-ui"
        pullRequestNumber={128}
        branchName="feature/broadcast-summary-card"
        siteUrl="https://pr-128.streamersuite-storybook.workers.dev"
        stories={[
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
        ]}
      />
    </main>
  );
}

const meta = {
  title: "Pages/Storybook PR Site",
  component: StorybookPrSitePage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof StorybookPrSitePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Screen: Story = {};
