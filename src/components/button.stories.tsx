import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Deploy",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Open Storybook",
  },
};

export const Compact: Story = {
  args: {
    size: "compact",
    children: "PR ready",
  },
};
