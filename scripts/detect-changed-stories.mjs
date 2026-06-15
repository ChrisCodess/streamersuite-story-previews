import { appendFile, readFile } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const storybookIndexPath = path.resolve("storybook-static/index.json");

const baseSha = process.env.BASE_SHA;
const headSha = process.env.HEAD_SHA ?? "HEAD";
const repository = process.env.GITHUB_REPOSITORY;
const serverUrl = process.env.GITHUB_SERVER_URL ?? "https://github.com";

const storyIndex = JSON.parse(await readFile(storybookIndexPath, "utf8"));
const storyEntries = Object.values(storyIndex.entries ?? storyIndex.stories ?? {})
  .filter((entry) => entry.type === "story")
  .map((entry) => ({
    id: entry.id,
    title: entry.title,
    name: entry.name,
    importPath: normalizePath(entry.importPath),
    componentPath: normalizePath(entry.componentPath),
  }));

const changedFiles = listChangedFiles();
const storiesByImportPath = groupStoriesByPath(storyEntries, "importPath");
const storiesByComponentPath = groupStoriesByPath(storyEntries, "componentPath");
const storyResults = new Map();

for (const changedFile of changedFiles) {
  const matchedStories = findMatchedStories(changedFile);

  for (const story of matchedStories) {
    const previous = storyResults.get(story.id);
    const commitSha = findLatestCommit(changedFile.path);
    const commit = commitSha ? toCommitRef(commitSha) : undefined;

    storyResults.set(story.id, {
      id: story.id,
      title: story.title,
      name: story.name,
      status: getStoryStatus(previous?.status, changedFile.status, changedFile.path, story.importPath),
      matchedFiles: [...new Set([...(previous?.matchedFiles ?? []), changedFile.path])].sort(),
      ...(commit ? { commit } : previous?.commit ? { commit: previous.commit } : {}),
    });
  }
}

const changedStories = [...storyResults.values()].sort((left, right) => {
  const titleCompare = left.title.localeCompare(right.title);
  return titleCompare === 0 ? left.name.localeCompare(right.name) : titleCompare;
});

if (process.env.GITHUB_ENV) {
  const delimiter = `CHANGED_STORIES_${Date.now()}`;
  await appendFile(
    process.env.GITHUB_ENV,
    `CHANGED_STORIES_JSON<<${delimiter}\n${JSON.stringify(changedStories)}\n${delimiter}\n`,
  );
} else {
  process.stdout.write(`${JSON.stringify(changedStories, null, 2)}\n`);
}

function listChangedFiles() {
  const range = baseSha ? `${baseSha}...${headSha}` : `HEAD~1...${headSha}`;
  const output = execFileSync("git", ["diff", "--name-status", "--find-renames", range], {
    encoding: "utf8",
  });

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const [rawStatus, firstPath, secondPath] = line.split("\t");
      const status = rawStatus.startsWith("R") ? "R" : rawStatus;
      const filePath = status === "R" ? secondPath : firstPath;

      if (!filePath) {
        return [];
      }

      return [{ status, path: normalizePath(filePath) }];
    });
}

function findMatchedStories(changedFile) {
  const matches = [
    ...getStories(storiesByImportPath, changedFile.path),
    ...getStories(storiesByComponentPath, changedFile.path),
  ];

  for (const candidate of getConventionalStoryPaths(changedFile.path)) {
    matches.push(...getStories(storiesByImportPath, candidate));
  }

  if (matches.length === 0) {
    const changedDir = path.posix.dirname(changedFile.path);
    matches.push(...storyEntries.filter((story) => path.posix.dirname(story.importPath) === changedDir));
  }

  return [...new Map(matches.map((story) => [story.id, story])).values()];
}

function groupStoriesByPath(stories, key) {
  const groups = new Map();

  for (const story of stories) {
    const storyPath = story[key];

    if (!storyPath) {
      continue;
    }

    const group = groups.get(storyPath) ?? [];
    group.push(story);
    groups.set(storyPath, group);
  }

  return groups;
}

function getStories(groups, filePath) {
  return groups.get(filePath) ?? [];
}

function getConventionalStoryPaths(filePath) {
  if (!filePath.startsWith("src/") && !filePath.startsWith("stories/")) {
    return [];
  }

  if (filePath.includes(".stories.")) {
    return [filePath];
  }

  const extension = path.extname(filePath);

  if (![".ts", ".tsx", ".js", ".jsx"].includes(extension)) {
    return [];
  }

  return [`${filePath.slice(0, -extension.length)}.stories${extension}`];
}

function getStoryStatus(previousStatus, fileStatus, filePath, storyImportPath) {
  if (previousStatus === "added") {
    return "added";
  }

  if (fileStatus === "A" && filePath === storyImportPath) {
    return "added";
  }

  return "changed";
}

function findLatestCommit(filePath) {
  const range = baseSha ? `${baseSha}..${headSha}` : headSha;

  try {
    return execFileSync("git", ["log", "-1", "--format=%H", range, "--", filePath], {
      encoding: "utf8",
    }).trim();
  } catch {
    return "";
  }
}

function toCommitRef(sha) {
  const shortSha = sha.slice(0, 7);

  return {
    sha,
    shortSha,
    ...(repository ? { url: `${serverUrl}/${repository}/commit/${sha}` } : {}),
  };
}

function normalizePath(value) {
  return value?.replace(/\\/g, "/").replace(/^\.\//, "");
}
