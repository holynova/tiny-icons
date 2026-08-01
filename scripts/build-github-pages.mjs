import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "dist", "client");
const pagesDir = path.join(root, "docs");
const port = 4179;
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) return response;
    } catch {
      // The server is still starting.
    }
    await delay(250);
  }
  throw new Error("vinext start did not become ready in time");
}

let server;
try {
  server = spawn(npmCommand, ["run", "start", "--", "--port", String(port)], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const response = await waitForServer();
  let html = await response.text();
  html = html
    .replaceAll("/assets/", "./assets/")
    .replaceAll("/favicon.svg", "./favicon.svg")
    .replaceAll("/file.svg", "./file.svg")
    .replaceAll("/globe.svg", "./globe.svg")
    .replaceAll("/window.svg", "./window.svg");

  await rm(pagesDir, { recursive: true, force: true });
  await mkdir(pagesDir, { recursive: true });
  await cp(clientDir, pagesDir, { recursive: true });
  const assetFiles = await readdir(path.join(pagesDir, "assets"));
  for (const assetFile of assetFiles.filter((file) => file.endsWith(".css"))) {
    const assetPath = path.join(pagesDir, "assets", assetFile);
    const assetSource = await readFile(assetPath, "utf8");
    const relativeAssetSource = assetSource.replaceAll("url(/assets/", "url(");
    if (relativeAssetSource !== assetSource) {
      await writeFile(assetPath, relativeAssetSource, "utf8");
    }
  }
  for (const assetFile of assetFiles.filter((file) => file.endsWith(".js"))) {
    const assetPath = path.join(pagesDir, "assets", assetFile);
    const assetSource = await readFile(assetPath, "utf8");
    const relativeAssetLoader = 'function(e){return new URL(e.replace(/^assets\\//,""),import.meta.url).pathname}';
    const relativeAssetSource = assetSource
      .replace('function(e){return"/"+e}', relativeAssetLoader)
      .replace('function(e){return`/`+e}', relativeAssetLoader);
    if (relativeAssetSource === assetSource) continue;
    await writeFile(assetPath, relativeAssetSource, "utf8");
  }
  await writeFile(path.join(pagesDir, "index.html"), html, "utf8");
  await writeFile(path.join(pagesDir, ".nojekyll"), "", "utf8");
  console.log(`GitHub Pages output written to ${path.relative(root, pagesDir)}/`);
} finally {
  if (server) server.kill("SIGTERM");
}
