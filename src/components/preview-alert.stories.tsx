import type { Meta, StoryObj } from "@storybook/react-vite";

import { PreviewAlert } from "./preview-alert";

const meta = {
  title: "Components/Preview Alert",
  component: PreviewAlert,
  args: {
    title: "Preview deployment is ready",
    children: "Storybook was built for this pull request and is available for review.",
  },
} satisfies Meta<typeof PreviewAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    tone: "success",
    title: "Preview updated",
    children: "The latest commit has been published to the branch preview.",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
    title: "Preview needs attention",
    children: "A deploy completed, but follow-up checks should be reviewed before merging.",
  },
};
