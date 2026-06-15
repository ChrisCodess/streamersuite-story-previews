import "@streamersuite/story-previews/globals.css";
import { withThemeByClassName } from "@storybook/addon-themes";

/** @type { import("@storybook/react-vite").Preview } */
const preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
