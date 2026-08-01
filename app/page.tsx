"use client";

import { CSSProperties, useMemo, useState } from "react";
import {
  BadgeCheck,
  Bot,
  Brackets,
  ChevronDown,
  CircleDashed,
  Code,
  Command,
  Layers2,
  MousePointer2,
  Notebook,
  Orbit,
  Palette,
  Rocket,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Terminal,
  WandSparkles,
  Workflow,
  Zap,
  type IconNode,
} from "lucide";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";

type Shape = "circle" | "rounded" | "square";
type Mode = "templates" | "ai";
type ExportTarget = "chrome" | "favicon";
type Layout = "stack" | "corner" | "diagonal" | "inline" | "center";
type FontKey = "plus" | "space" | "plex" | "mono";

const iconLibrary = {
  Sparkles,
  Bot,
  Code,
  Brackets,
  ChevronDown,
  Palette,
  Terminal,
  Rocket,
  ShieldCheck,
  MousePointer2,
  Notebook,
  Orbit,
  Zap,
  Layers2,
  Workflow,
  ScanLine,
  CircleDashed,
  Command,
  BadgeCheck,
  WandSparkles,
} satisfies Record<string, IconNode>;

type IconName = keyof typeof iconLibrary;

const iconLabels: Record<IconName, string> = {
  Sparkles: "闪光",
  Bot: "助手",
  Code: "代码",
  Brackets: "括号",
  ChevronDown: "下箭头",
  Palette: "色板",
  Terminal: "终端",
  Rocket: "发布",
  ShieldCheck: "安全",
  MousePointer2: "交互",
  Notebook: "笔记",
  Orbit: "轨道",
  Zap: "速度",
  Layers2: "图层",
  Workflow: "流程",
  ScanLine: "扫描",
  CircleDashed: "聚焦",
  Command: "命令",
  BadgeCheck: "确认",
  WandSparkles: "魔法",
};

const iconNames = Object.keys(iconLibrary) as IconName[];
const layoutOptions: Array<{ id: Layout; label: string }> = [
  { id: "stack", label: "上下" },
  { id: "corner", label: "左上 / 右下" },
  { id: "diagonal", label: "右上 / 左下" },
  { id: "inline", label: "左右" },
  { id: "center", label: "居中" },
];
const fontOptions: Array<{ id: FontKey; label: string; sample: string }> = [
  { id: "plus", label: "Plus Jakarta", sample: "Aa" },
  { id: "space", label: "Space Grotesk", sample: "Aa" },
  { id: "plex", label: "IBM Plex Sans", sample: "Aa" },
  { id: "mono", label: "IBM Plex Mono", sample: "01" },
];

type Template = {
  id: string;
  name: string;
  detail: string;
  letter: string;
  iconName: IconName;
  background: string;
  foreground: string;
  shape: Shape;
  layout: Layout;
  fontKey: FontKey;
  className: string;
};

const templates: Template[] = [
  {
    id: "terminal",
    name: "Terminal",
    detail: "deep navy glyph",
    letter: "",
    iconName: "Terminal",
    background: "#071b43",
    foreground: "#58f4d1",
    shape: "rounded",
    layout: "center",
    fontKey: "mono",
    className: "template-terminal",
  },
  {
    id: "magic",
    name: "Magic",
    detail: "spark + letter",
    letter: "A",
    iconName: "Sparkles",
    background: "#e74687",
    foreground: "#fff8fc",
    shape: "rounded",
    layout: "stack",
    fontKey: "plus",
    className: "template-magic",
  },
  {
    id: "chevron",
    name: "Chevron",
    detail: "single clear mark",
    letter: "",
    iconName: "ChevronDown",
    background: "#df5a4d",
    foreground: "#fff9f3",
    shape: "rounded",
    layout: "center",
    fontKey: "plus",
    className: "template-chevron",
  },
  {
    id: "focus",
    name: "Focus",
    detail: "compact badge",
    letter: "A",
    iconName: "BadgeCheck",
    background: "#10274d",
    foreground: "#9affd9",
    shape: "square",
    layout: "center",
    fontKey: "mono",
    className: "template-focus",
  },
];

const colorOptions = [
  { background: "#071b43", foreground: "#58f4d1", label: "Midnight" },
  { background: "#e74687", foreground: "#fff8fc", label: "Rose" },
  { background: "#df5a4d", foreground: "#fff9f3", label: "Coral" },
  { background: "#0b4b61", foreground: "#d1ff59", label: "Aqua" },
  { background: "#f1eee7", foreground: "#173e3a", label: "Paper" },
];
const previewSizes = [16, 32, 48, 128] as const;

type IconState = {
  letter: string;
  iconName: IconName;
  background: string;
  foreground: string;
  shape: Shape;
  layout: Layout;
  fontKey: FontKey;
};

const initialIcon: IconState = {
  letter: templates[0].letter,
  iconName: templates[0].iconName,
  background: templates[0].background,
  foreground: templates[0].foreground,
  shape: templates[0].shape,
  layout: templates[0].layout,
  fontKey: templates[0].fontKey,
};

const fontFamilyFor = (fontKey: FontKey) => ({
  plus: "Plus Jakarta Sans, sans-serif",
  space: "Space Grotesk, sans-serif",
  plex: "IBM Plex Sans, sans-serif",
  mono: "IBM Plex Mono, monospace",
}[fontKey]);

function toReactAttrs(attrs: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(attrs).map(([key, value]) => [
      key.replace(/-([a-z])/g, (_, character: string) => character.toUpperCase()),
      value,
    ]),
  );
}

function IconGlyph({ name }: { name: IconName }) {
  const node = iconLibrary[name];
  return (
    <svg className="lucide-glyph" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {node.map(([tag, attrs], index) => {
        const Element = tag as keyof JSX.IntrinsicElements;
        return <Element key={`${tag}-${index}`} {...toReactAttrs(attrs)} />;
      })}
    </svg>
  );
}

function IconArtwork({
  icon,
  size = "large",
}: {
  icon: IconState;
  size?: "large" | "small";
}) {
  const style = {
    "--icon-background": icon.background,
    "--icon-foreground": icon.foreground,
    "--icon-font": fontFamilyFor(icon.fontKey),
  } as CSSProperties;

  return (
    <div
      className={`icon-artwork icon-${size} shape-${icon.shape} layout-${icon.layout} ${icon.letter ? "" : "icon-only"}`}
      style={style}
      aria-label={`${icon.letter ? `${icon.letter} ` : ""}${icon.iconName} icon`}
    >
      <span className="artwork-icon"><IconGlyph name={icon.iconName} /></span>
      <span className="artwork-letter">{icon.letter}</span>
    </div>
  );
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function iconSvg(icon: IconState) {
  const radius = icon.shape === "circle" ? 64 : icon.shape === "rounded" ? 28 : 15;
  const letterSize = icon.letter.length > 1 ? 31 : 46;
  const layout = {
    stack: { iconX: 64, iconY: 35, iconSize: 28, letterX: 64, letterY: 93, anchor: "middle" },
    corner: { iconX: 30, iconY: 30, iconSize: 28, letterX: 98, letterY: 100, anchor: "end" },
    diagonal: { iconX: 98, iconY: 30, iconSize: 28, letterX: 30, letterY: 100, anchor: "start" },
    inline: { iconX: 34, iconY: 64, iconSize: 28, letterX: 91, letterY: 72, anchor: "middle" },
    center: { iconX: 64, iconY: 42, iconSize: 34, letterX: 64, letterY: 96, anchor: "middle" },
  }[icon.layout];
  const composition = icon.letter
    ? layout
    : { ...layout, iconX: 64, iconY: 64, iconSize: 46 };
  const iconMarkup = iconNodeSvg(icon.iconName, composition.iconX, composition.iconY, composition.iconSize, icon.foreground);
  const letterMarkup = icon.letter
    ? `<text x="${composition.letterX}" y="${composition.letterY}" text-anchor="${composition.anchor}" dominant-baseline="middle" font-family="${escapeXml(fontFamilyFor(icon.fontKey))}" font-size="${letterSize}" font-weight="700" letter-spacing="-2" fill="${icon.foreground}">${escapeXml(icon.letter)}</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="${radius}" fill="${icon.background}"/>
  ${iconMarkup}
  ${letterMarkup}
</svg>`;
}

function iconNodeSvg(name: IconName, centerX: number, centerY: number, size: number, color: string) {
  const scale = size / 24;
  const node = iconLibrary[name];
  const content = node.map(([tag, attrs]) => {
    const attributes = Object.entries(attrs)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${escapeXml(String(value))}"`)
      .join(" ");
    return `<${tag} ${attributes}/>`;
  }).join("");
  return `<g transform="translate(${centerX - size / 2} ${centerY - size / 2}) scale(${scale})" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${content}</g>`;
}

async function renderPng(icon: IconState, size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  const image = new Image();
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSvg(icon))}`;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("SVG render failed"));
    image.src = svgUrl;
  });
  context.clearRect(0, 0, size, size);
  context.drawImage(image, 0, 0, size, size);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("PNG export failed"))), "image/png");
  });
  return new Uint8Array(await blob.arrayBuffer());
}

function concatBytes(chunks: Uint8Array[]) {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createIco(entries: Array<{ size: number; png: Uint8Array }>) {
  const header = new Uint8Array(6 + entries.length * 16);
  const headerView = new DataView(header.buffer);
  headerView.setUint16(0, 0, true);
  headerView.setUint16(2, 1, true);
  headerView.setUint16(4, entries.length, true);
  let offset = header.length;
  const chunks = [header];
  entries.forEach(({ size, png }, index) => {
    const entryOffset = 6 + index * 16;
    header[entryOffset] = size === 256 ? 0 : size;
    header[entryOffset + 1] = size === 256 ? 0 : size;
    header[entryOffset + 2] = 0;
    header[entryOffset + 3] = 0;
    headerView.setUint16(entryOffset + 4, 1, true);
    headerView.setUint16(entryOffset + 6, 32, true);
    headerView.setUint32(entryOffset + 8, png.length, true);
    headerView.setUint32(entryOffset + 12, offset, true);
    chunks.push(png);
    offset += png.length;
  });
  return concatBytes(chunks);
}

function createZip(files: Array<{ name: string; data: Uint8Array }>) {
  const encoder = new TextEncoder();
  const localChunks: Uint8Array[] = [];
  const centralChunks: Uint8Array[] = [];
  let localOffset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const checksum = crc32(file.data);
    const local = new Uint8Array(30 + name.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, 0, true);
    localView.setUint16(12, 0, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, file.data.length, true);
    localView.setUint32(22, file.data.length, true);
    localView.setUint16(26, name.length, true);
    localView.setUint16(28, 0, true);
    local.set(name, 30);
    localChunks.push(local, file.data);

    const central = new Uint8Array(46 + name.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, 0, true);
    centralView.setUint16(14, 0, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, file.data.length, true);
    centralView.setUint32(24, file.data.length, true);
    centralView.setUint16(28, name.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, localOffset, true);
    central.set(name, 46);
    centralChunks.push(central);
    localOffset += local.length + file.data.length;
  }

  const localData = concatBytes(localChunks);
  const centralData = concatBytes(centralChunks);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralData.length, true);
  endView.setUint32(16, localData.length, true);
  return concatBytes([localData, centralData, end]);
}

function download(data: Uint8Array, filename: string, type: string) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function statusForSize(size: number, letter: string) {
  if (size === 16 && letter.length > 1) return { label: "简化文字", tone: "warn" };
  return { label: "清晰", tone: "good" };
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [icon, setIcon] = useState<IconState>(initialIcon);
  const [prompt, setPrompt] = useState("一个安静、可靠的开发者工具图标");
  const [exportTarget, setExportTarget] = useState<ExportTarget>("chrome");
  const [notice, setNotice] = useState("已准备好一个基础方案");
  const [isGenerating, setIsGenerating] = useState(false);

  const selected = useMemo(
    () => templates.find((template) => template.id === selectedTemplate) ?? templates[0],
    [selectedTemplate],
  );

  const applyTemplate = (template: Template) => {
    setSelectedTemplate(template.id);
    setIcon({
      letter: template.letter,
      iconName: template.iconName,
      background: template.background,
      foreground: template.foreground,
      shape: template.shape,
      layout: template.layout,
      fontKey: template.fontKey,
    });
    setNotice(`${template.name} 模板已应用`);
  };

  const generateConcept = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      const lower = prompt.toLowerCase();
      const isWarm = lower.includes("暖") || lower.includes("橙") || lower.includes("温柔");
      const isBlue = lower.includes("蓝") || lower.includes("冷") || lower.includes("海");
      const next = isBlue ? templates[0] : isWarm ? templates[1] : templates[3];
      applyTemplate(next);
      setMode("templates");
      setNotice(`AI 草案已生成，基于「${prompt.slice(0, 18)}${prompt.length > 18 ? "…" : ""}」`);
      setIsGenerating(false);
    }, 520);
  };

  const updateIcon = (patch: Partial<IconState>) => {
    setIcon((current) => ({ ...current, ...patch }));
    setNotice("方案已更新");
  };

  const exportPack = async () => {
    setNotice("正在准备下载包…");
    const sizes = exportTarget === "chrome" ? [16, 32, 48, 128] : [16, 32, 48];
    const pngs = await Promise.all(sizes.map(async (size) => ({ size, png: await renderPng(icon, size) })));
    const encoder = new TextEncoder();
    const files: Array<{ name: string; data: Uint8Array }> = pngs.map(({ size, png }) => ({
      name: `icon${size}.png`,
      data: png,
    }));

    if (exportTarget === "favicon") {
      files.push({ name: "favicon.ico", data: createIco(pngs) });
    } else {
      const manifest = JSON.stringify(
        {
          icons: {
            "16": "icon16.png",
            "32": "icon32.png",
            "48": "icon48.png",
            "128": "icon128.png",
          },
        },
        null,
        2,
      );
      files.push({ name: "manifest-snippet.json", data: encoder.encode(manifest) });
    }

    files.push({ name: "icon.svg", data: encoder.encode(iconSvg(icon)) });
    files.push({
      name: "icon-spec.json",
      data: encoder.encode(JSON.stringify({ version: 1, ...icon }, null, 2)),
    });
    const zip = createZip(files);
    download(zip, `${exportTarget === "chrome" ? "chrome" : "favicon"}-icon-pack.zip`, "application/zip");
    setNotice(`${exportTarget === "chrome" ? "Chrome" : "Favicon"} 图标包已下载`);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <div className="brand-name">tiny icons</div>
            <div className="brand-caption">small by design</div>
          </div>
        </div>
        <div className="topbar-center">ICON / 001</div>
        <div className="topbar-actions">
          <span className="draft-status"><i /> 本地草稿</span>
          <button className="text-button" type="button" onClick={() => setNotice("所有修改会保留在当前设备")}>保存说明</button>
          <button className="top-export" type="button" onClick={exportPack}>导出图标包 <span>↗</span></button>
        </div>
      </header>

      <div className="workspace">
        <aside className="left-rail">
          <div className="rail-heading">
            <span>CREATE</span>
            <span className="rail-count">{mode === "templates" ? "04" : "AI"}</span>
          </div>
          <div className="mode-tabs" role="tablist" aria-label="创作方式">
            <button className={mode === "templates" ? "mode-tab active" : "mode-tab"} type="button" onClick={() => setMode("templates")} role="tab" aria-selected={mode === "templates"}>
              <span className="tab-index">01</span>
              <span><strong>模板</strong><small>从一个清晰的起点</small></span>
            </button>
            <button className={mode === "ai" ? "mode-tab active" : "mode-tab"} type="button" onClick={() => setMode("ai")} role="tab" aria-selected={mode === "ai"}>
              <span className="tab-index">02</span>
              <span><strong>AI 草案</strong><small>用一句话开始</small></span>
            </button>
          </div>

          {mode === "templates" ? (
            <div className="template-list">
              <div className="section-label">START WITH A TEMPLATE</div>
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className={`template-card ${selectedTemplate === template.id ? "selected" : ""}`}
                  onClick={() => applyTemplate(template)}
                >
                  <span className={`template-thumb ${template.className}`} style={{ "--thumb-bg": template.background, "--thumb-fg": template.foreground } as CSSProperties}>
                    <IconGlyph name={template.iconName} /><b>{template.letter}</b>
                  </span>
                  <span className="template-info"><strong>{template.name}</strong><small>{template.detail}</small></span>
                  <span className="template-arrow">{selectedTemplate === template.id ? "●" : "＋"}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="ai-panel">
              <div className="section-label">DESCRIBE YOUR ICON</div>
              <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label="描述你想要的图标" />
              <div className="prompt-hints">
                <button type="button" onClick={() => setPrompt("一个蓝色的浏览器工具图标")}>蓝色工具</button>
                <button type="button" onClick={() => setPrompt("一个暖橙色的效率工具图标")}>暖橙效率</button>
                <button type="button" onClick={() => setPrompt("一个安静的笔记图标")}>安静笔记</button>
              </div>
              <button className="generate-button" type="button" onClick={generateConcept} disabled={isGenerating}>
                {isGenerating ? "生成中…" : "生成 3 个草案"}<span>✦</span>
              </button>
              <p className="ai-note">AI 只负责给出清晰的图形方向，生成后仍可在右侧编辑。</p>
            </div>
          )}

          <div className="rail-footnote">
            <span className="footnote-number">02</span>
            <p>每一个方案都会先经过 16px 检查，再进入导出。</p>
          </div>
        </aside>

        <section className="canvas-column" aria-label="图标编辑区">
          <div className="canvas-intro">
            <div>
              <p className="eyebrow">MASTER CANVAS / 128 PX</p>
              <h1>Make it tiny<span>.</span></h1>
              <p className="intro-copy">一个适合浏览器工具栏，也适合浏览器标签页的图标。</p>
            </div>
            <div className="target-switcher" aria-label="导出目标">
              <span>OUTPUT</span>
              <button className={exportTarget === "chrome" ? "active" : ""} type="button" onClick={() => setExportTarget("chrome")}>Chrome</button>
              <button className={exportTarget === "favicon" ? "active" : ""} type="button" onClick={() => setExportTarget("favicon")}>Favicon</button>
            </div>
          </div>

          <div className="canvas-stage">
            <div className="stage-ruler top-ruler"><span>0</span><span>64</span><span>128</span></div>
            <div className="stage-ruler side-ruler"><span>0</span><span>64</span><span>128</span></div>
            <div className="artboard-wrap">
              <div className="artboard-shadow" />
              <IconArtwork icon={icon} />
              <span className="safe-zone safe-zone-top" />
              <span className="safe-zone safe-zone-bottom" />
            </div>
            <span className="stage-tag stage-tag-top">safe area / 96 px</span>
            <span className="stage-tag stage-tag-bottom">{selected.name.toUpperCase()} / EDITABLE</span>
          </div>

          <div className="controls-panel">
            <div className="controls-header"><span>EDIT MARK</span><span>{notice}</span></div>
            <div className="controls-grid">
              <label className="control-field text-field"><span>LETTER</span><input value={icon.letter} maxLength={2} onChange={(event) => updateIcon({ letter: event.target.value.toUpperCase() })} /></label>
              <div className="control-field icon-field"><span>ICON LIBRARY</span><div className="icon-options">{iconNames.map((name) => <button key={name} type="button" className={icon.iconName === name ? "selected" : ""} onClick={() => updateIcon({ iconName: name })} aria-label={iconLabels[name]} title={iconLabels[name]}><IconGlyph name={name} /></button>)}</div></div>
              <div className="control-field layout-field"><span>LAYOUT</span><div className="layout-options">{layoutOptions.map((option) => <button key={option.id} type="button" className={icon.layout === option.id ? "selected" : ""} onClick={() => updateIcon({ layout: option.id })} aria-label={option.label} title={option.label}><span className={`layout-sample sample-${option.id}`}><i /><b /></span></button>)}</div></div>
              <div className="control-field font-field"><span>TYPE</span><div className="font-options">{fontOptions.map((font) => <button key={font.id} type="button" className={icon.fontKey === font.id ? "selected" : ""} onClick={() => updateIcon({ fontKey: font.id })} style={{ "--font-sample": fontFamilyFor(font.id) } as CSSProperties} aria-label={font.label} title={font.label}><span>{font.sample}</span></button>)}</div></div>
              <div className="control-field"><span>SHAPE</span><div className="shape-options">{(["circle", "rounded", "square"] as Shape[]).map((shape) => <button key={shape} className={`shape-control shape-control-${shape} ${icon.shape === shape ? "selected" : ""}`} type="button" onClick={() => updateIcon({ shape })} aria-label={shape} />)}</div></div>
              <div className="control-field"><span>PALETTE</span><div className="color-options">{colorOptions.map((color) => <button key={color.label} className={icon.background === color.background ? "selected" : ""} type="button" style={{ "--swatch-bg": color.background, "--swatch-fg": color.foreground } as CSSProperties} onClick={() => updateIcon({ background: color.background, foreground: color.foreground })} aria-label={color.label} />)}</div></div>
            </div>
          </div>
        </section>

        <aside className="right-rail">
          <div className="preview-heading"><div><span className="eyebrow">SIZE CHECK</span><h2>Still clear?</h2></div><span className={`pass-badge ${icon.letter.length > 1 ? "has-warning" : ""}`}>{icon.letter.length > 1 ? "PASS / 03 + WARN / 01" : "PASS / 04"}</span></div>
          <div className="preview-list">
            {previewSizes.map((size) => {
              const status = statusForSize(size, icon.letter);
              return <div className="preview-row" key={size}>
                <div className={`preview-art preview-art-${size}`}><IconArtwork icon={icon} size="small" /></div>
                <div className="preview-meta"><strong>{size}<small>×</small>{size}</strong><span>{size === 128 ? "Chrome store" : size === 16 ? "Toolbar / tab" : "Browser UI"}</span></div>
                <span className={`preview-status ${status.tone}`}><i />{status.label}</span>
              </div>;
            })}
          </div>
          <div className="preview-tip"><span>TIP / 16 PX</span><p>{icon.letter.length > 1 ? "两个字符在最小尺寸会挤在一起，建议使用一个字母。" : "主体轮廓保持完整，16px 下不需要额外简化。"}</p></div>
          <div className="download-card"><div className="download-card-top"><span className="download-icon">↓</span><div><span>READY TO USE</span><strong>{exportTarget === "chrome" ? "Chrome icon pack" : "Favicon pack"}</strong></div></div><button type="button" onClick={exportPack}>下载 .ZIP <span>↗</span></button><small>含 PNG、SVG 与可编辑 spec</small></div>
        </aside>
      </div>

      <footer className="bottombar"><span><i /> NO ACCOUNT NEEDED</span><span>LOCAL DRAFTS ONLY</span><span>DESIGNED FOR 16 PX</span></footer>
    </main>
  );
}
