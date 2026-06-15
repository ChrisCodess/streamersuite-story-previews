import type { Meta, StoryObj } from "@storybook/react-vite";

import { PreviewMetric } from "./preview-metric";

const meta = {
  title: "Components/Preview Metric",
  component: PreviewMetric,
  args: {
    label: "Changed stories",
    value: "7",
    delta: "+3",
  },
} satisfies Meta<typeof PreviewMetric>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutDelta: Story = {
  args: {
    label: "Checks passed",
    value: "12",
    delta: undefined,
  },
};
