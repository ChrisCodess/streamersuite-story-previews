import type { Meta, StoryObj } from "@storybook/react-vite";

import { PreviewChecklist } from "./preview-checklist";

const meta = {
  title: "Components/Preview Checklist",
  component: PreviewChecklist,
  args: {
    title: "PR preview readiness",
    items: [
      { label: "Storybook built", isComplete: true },
      { label: "Preview deployed", isComplete: true },
      { label: "Designer reviewed", isComplete: false },
    ],
  },
} satisfies Meta<typeof PreviewChecklist>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Complete: Story = {
  args: {
    title: "Ready to merge",
    items: [
      { label: "Storybook built", isComplete: true },
      { label: "Preview deployed", isComplete: true },
      { label: "Designer reviewed", isComplete: true },
    ],
  },
};
