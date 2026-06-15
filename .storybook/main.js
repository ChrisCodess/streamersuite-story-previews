import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

/** @type { import("@storybook/react-vite").StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
  ],
  staticDirs: ["../public"],
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-themes"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  viteFinal(config) {
    config.plugins ??= [];
    config.plugins.push(tailwindcss());
    config.resolve ??= {};
    config.resolve.alias = [
      {
        find: /^@streamersuite\/story-previews$/,
        replacement: resolve(rootDir, "src/index.ts"),
      },
      {
        find: /^@streamersuite\/story-previews\/globals\.css$/,
        replacement: resolve(rootDir, "src/styles/globals.css"),
      },
      {
        find: /^@streamersuite\/story-previews\/(.*)$/,
        replacement: resolve(rootDir, "src/$1"),
      },
      ...(Array.isArray(config.resolve.alias) ? config.resolve.alias : []),
    ];
    config.resolve.dedupe = [...new Set([...(config.resolve.dedupe ?? []), "react", "react-dom"])];
    config.build ??= {};
    config.build.rollupOptions ??= {};
    config.build.rollupOptions.external = (id) => id.startsWith("node:");
    return config;
  },
};

export default config;
