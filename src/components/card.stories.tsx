import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

function CardExample() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Storybook stage</CardTitle>
        <CardDescription>PR #128 · feature/broadcast-summary-card</CardDescription>
        <CardAction>
          <Badge variant="success">live</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Static Storybook has 2 changed stories.</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button>Open</Button>
      </CardFooter>
    </Card>
  );
}

const meta = {
  title: "Components/Card",
  component: CardExample,
} satisfies Meta<typeof CardExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
