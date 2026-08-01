import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Tiny Icons editor", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /<title>Tiny Icons \| Small by design<\/title>/i);
  assert.match(html, /Make it tiny/i);
  assert.match(html, /ICON LIBRARY/);
  assert.match(html, /LAYOUT/);
  assert.match(html, /Favicon/);
  assert.match(html, /Chrome icon pack/);
  assert.match(html, /lucide-glyph/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the editor and export contract in source", async () => {
  const [page, css, layout, packageJson, readme] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const iconLibrary/);
  assert.match(page, /const layoutOptions/);
  assert.match(page, /const fontOptions/);
  assert.match(page, /function createIco/);
  assert.match(page, /function createZip/);
  assert.match(page, /manifest-snippet\.json/);
  assert.match(page, /name: "icon\.svg"/);
  assert.match(page, /name: "icon-spec\.json"/);
  assert.match(css, /layout-(stack|corner|diagonal|inline|center)/);
  assert.match(css, /font-family: var\(--icon-font\)/);
  assert.match(layout, /title: "Tiny Icons \| Small by design"/);
  assert.match(packageJson, /"lucide"/);
  assert.match(packageJson, /@fontsource-variable\/space-grotesk/);
  assert.match(readme, /Lucide 开源图标/);
});
