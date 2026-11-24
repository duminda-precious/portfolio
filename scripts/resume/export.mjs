/**
 * Prints scripts/resume/resume.html to the one-page resume PDF linked from
 * Work with me, using a local Chrome (or Edge) in headless mode.
 *
 *   pnpm resume:pdf               writes public/cv/duminda-madushan-resume.pdf
 *   pnpm resume:pdf <out.pdf>     writes somewhere else, e.g. to check a draft
 *
 * Set CHROME_PATH if Chrome isn't found. The fonts are inlined first, because
 * Chrome won't load font files next to a page opened from disk. The script
 * fails, leaving the current PDF alone, if the new one runs past one page.
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = resolve(
  process.argv[2] ?? join(root, "public/cv/duminda-madushan-resume.pdf"),
);

const browsers = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];
const browser = browsers.find((path) => path && existsSync(path));
if (!browser) {
  console.error("No Chrome or Edge found. Set CHROME_PATH and run it again.");
  process.exit(1);
}

const html = readFileSync(join(here, "resume.html"), "utf8").replace(
  /url\("([\w-]+\.ttf)"\)/g,
  (_, file) =>
    `url("data:font/ttf;base64,${readFileSync(join(here, file)).toString("base64")}")`,
);

const work = mkdtempSync(join(tmpdir(), "resume-"));
try {
  const page = join(work, "resume.html");
  const draft = join(work, "resume.pdf");
  writeFileSync(page, html);

  const run = spawnSync(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${join(work, "profile")}`,
      "--no-pdf-header-footer",
      "--virtual-time-budget=5000",
      `--print-to-pdf=${draft}`,
      pathToFileURL(page).href,
    ],
    { encoding: "utf8", timeout: 60_000 },
  );
  if (run.status !== 0 || !existsSync(draft)) {
    throw new Error(run.stderr || run.error || "Chrome didn't write the PDF.");
  }

  // Checked before copying, so a two-page draft never replaces a good file.
  const pages = (
    readFileSync(draft, "latin1").match(/\/Type\s*\/Page(?!s)/g) ?? []
  ).length;
  if (pages !== 1) {
    throw new Error(
      `The resume runs to ${pages} pages. It must fit on one: trim words, not spacing.`,
    );
  }
  copyFileSync(draft, out);
  console.log(`Wrote ${out} (1 page).`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  rmSync(work, { recursive: true, force: true });
}
