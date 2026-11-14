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
  assert.match(html, /图标库/);
  assert.match(html, /布局/);
  assert.match(html, /Favicon/);
  assert.match(html, /Chrome 图标包/);
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
  assert.match(page, /AlarmClock/);
  assert.match(page, /function compositionFor/);
  assert.match(page, /iconMarks: IconMark\[\]/);
  assert.match(page, /letterMarks: LetterMark\[\]/);
  assert.match(page, /type QuadSlot/);
  assert.match(page, /quadSlots: QuadSlot\[\]/);
  assert.match(page, /function isQuadLayout/);
  assert.match(page, /function letterSizeFor/);
  assert.match(page, /function normalizeLetter/);
  assert.match(page, /onCompositionEnd/);
  assert.match(page, /corner-bl/);
  assert.match(page, /corner-br/);
  assert.match(page, /const SAFE_INSET = 16/);
  assert.match(page, /className="artwork-safe"/);
  assert.match(page, /clipPath id="safe-area"/);
  assert.match(page, /iconScale: number/);
  assert.match(page, /letterScale: number/);
  assert.match(page, /type="range"/);
  assert.match(page, /aria-label="图标大小"/);
  assert.match(page, /aria-label="字母大小"/);
  assert.match(page, /aria-label="字母或汉字"/);
  assert.match(page, /type LetterShadow/);
  assert.match(page, /letterOffsetX: number/);
  assert.match(page, /letterOffsetY: number/);
  assert.match(page, /letterRotation: number/);
  assert.match(page, /letter-shadow/);
  assert.match(page, /文字效果/);
  assert.match(page, /文字水平偏移/);
  assert.match(page, /文字垂直偏移/);
  assert.match(page, /文字旋转/);
  assert.match(page, /const DEFAULT_MARK_SCALE = 125/);
  assert.match(page, /tiny-icons-draft-v1/);
  assert.match(page, /localStorage/);
  assert.match(page, /const MARK_SCALE_MIN = 20/);
  assert.match(page, /const MARK_SCALE_MAX = 400/);
  assert.match(page, /"quad-grid"/);
  assert.match(page, /label: "四角交错"/);
  assert.match(page, /label: "横向四列"/);
  assert.match(page, /4 个位置/);
  assert.match(page, /updateQuadSlot/);
  assert.match(page, /位置 \$\{activeQuadSlot \+ 1\}/);
  assert.match(page, /connectorStyle/);
  assert.match(page, /quadMargin/);
  assert.match(page, /quadSpacing/);
  assert.match(page, /connectorLines/);
  assert.match(page, /QUAD_MARGIN_MIN/);
  assert.match(page, /QUAD_SPACING_MAX/);
  assert.match(page, /位置 \$\{activeQuadSlot \+ 1\} 的大小/);
  assert.match(page, /label: "鸢尾"/);
  assert.match(page, /label: "钴蓝"/);
  assert.match(page, /label: "柑橘"/);
  assert.match(page, /label: "青柠"/);
  assert.match(page, /label: "淡紫"/);
  assert.match(page, /label: "梅子"/);
  assert.match(page, /label: "冰川"/);
  assert.match(page, /label: "苔藓"/);
  assert.match(page, /label: "樱桃"/);
  assert.match(page, /label: "牛仔"/);
  assert.match(page, /label: "杏色"/);
  assert.match(page, /const layoutOptions/);
  assert.match(page, /const fontOptions/);
  assert.match(page, /function createIco/);
  assert.match(page, /function createZip/);
  assert.match(page, /manifest-snippet\.json/);
  assert.match(page, /name: "icon\.svg"/);
  assert.match(page, /name: "icon-spec\.json"/);
  assert.match(page, /version: 3/);
  assert.match(css, /layout-(stack|corner-tl|corner-tr|corner-bl|corner-br|inline|center)/);
  assert.match(css, /sample-quad-grid/);
  assert.match(css, /layout-sample em/);
  assert.match(css, /quad-slot-card/);
  assert.match(css, /artwork-connectors/);
  assert.match(css, /quad-geometry/);
  assert.match(css, /connector-options/);
  assert.match(css, /font-family: var\(--icon-font\)/);
  assert.match(layout, /title: "Tiny Icons \| Small by design"/);
  assert.match(packageJson, /"lucide"/);
  assert.match(packageJson, /@fontsource-variable\/space-grotesk/);
  assert.match(readme, /Lucide 开源图标/);
});
