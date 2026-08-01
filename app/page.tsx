"use client";

import { CSSProperties, useMemo, useState } from "react";

type Shape = "circle" | "rounded" | "square";
type Mode = "templates" | "ai";
type ExportTarget = "chrome" | "favicon";

type Template = {
  id: string;
  name: string;
  detail: string;
  letter: string;
  symbol: string;
  background: string;
  foreground: string;
  shape: Shape;
  className: string;
};

const templates: Template[] = [
  {
    id: "orbit",
    name: "Orbit",
    detail: "symbol + letter",
    letter: "N",
    symbol: "✦",
    background: "#e6a55c",
    foreground: "#163f3a",
    shape: "circle",
    className: "template-orbit",
  },
  {
    id: "bracket",
    name: "Bracket",
    detail: "developer mark",
    letter: "AI",
    symbol: "<> ",
    background: "#31547c",
    foreground: "#f5ead9",
    shape: "rounded",
    className: "template-bracket",
  },
  {
    id: "signal",
    name: "Signal",
    detail: "single glyph",
    letter: "S",
    symbol: "⌁",
    background: "#d25e45",
    foreground: "#f6e8d6",
    shape: "square",
    className: "template-signal",
  },
  {
    id: "kernel",
    name: "Kernel",
    detail: "quiet monogram",
    letter: "K",
    symbol: "·",
    background: "#e8dfce",
    foreground: "#183e3b",
    shape: "circle",
    className: "template-kernel",
  },
];

const symbolOptions = ["✦", "<> ", "⌁", "◒", "＋", "·"];
const colorOptions = [
  { background: "#e6a55c", foreground: "#163f3a", label: "Amber" },
  { background: "#31547c", foreground: "#f5ead9", label: "Harbor" },
  { background: "#d25e45", foreground: "#f6e8d6", label: "Signal" },
  { background: "#183e3b", foreground: "#f3c96a", label: "Pine" },
  { background: "#e8dfce", foreground: "#183e3b", label: "Paper" },
];
const previewSizes = [16, 32, 48, 128] as const;

type IconState = {
  letter: string;
  symbol: string;
  background: string;
  foreground: string;
  shape: Shape;
};

const initialIcon: IconState = {
  letter: templates[0].letter,
  symbol: templates[0].symbol,
  background: templates[0].background,
  foreground: templates[0].foreground,
  shape: templates[0].shape,
};

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
  } as CSSProperties;

  return (
    <div
      className={`icon-artwork icon-${size} shape-${icon.shape}`}
      style={style}
      aria-label={`${icon.letter} icon`}
    >
      <span className="artwork-symbol">{icon.symbol.trim()}</span>
      <span className="artwork-letter">{icon.letter}</span>
      <span className="artwork-dot" />
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="${radius}" fill="${icon.background}"/>
  <text x="64" y="46" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="${icon.foreground}">${escapeXml(icon.symbol.trim())}</text>
  <text x="64" y="78" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="${letterSize}" font-weight="800" letter-spacing="-2" fill="${icon.foreground}">${escapeXml(icon.letter)}</text>
  <circle cx="94" cy="94" r="4" fill="${icon.foreground}"/>
</svg>`;
}

async function renderPng(icon: IconState, size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  const radius = icon.shape === "circle" ? size / 2 : icon.shape === "rounded" ? size * 0.22 : size * 0.12;
  context.clearRect(0, 0, size, size);
  context.fillStyle = icon.background;
  context.beginPath();
  context.roundRect(0, 0, size, size, radius);
  context.fill();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = icon.foreground;
  context.font = `700 ${Math.max(6, Math.round(size * 0.18))}px Arial, sans-serif`;
  context.fillText(icon.symbol.trim(), size / 2, size * 0.34);
  context.font = `800 ${Math.max(8, Math.round(size * (icon.letter.length > 1 ? 0.24 : 0.36)))}px Arial, sans-serif`;
  context.fillText(icon.letter, size / 2, size * 0.61);
  context.beginPath();
  context.arc(size * 0.73, size * 0.73, Math.max(1, size * 0.03), 0, Math.PI * 2);
  context.fill();

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
      symbol: template.symbol,
      background: template.background,
      foreground: template.foreground,
      shape: template.shape,
    });
    setNotice(`${template.name} 模板已应用`);
  };

  const generateConcept = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      const lower = prompt.toLowerCase();
      const isWarm = lower.includes("暖") || lower.includes("橙") || lower.includes("温柔");
      const isBlue = lower.includes("蓝") || lower.includes("冷") || lower.includes("海");
      const next = isBlue ? templates[1] : isWarm ? templates[2] : templates[3];
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
                    <span>{template.symbol.trim()}</span><b>{template.letter}</b>
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
              <div className="control-field"><span>SYMBOL</span><div className="symbol-options">{symbolOptions.map((symbol) => <button key={symbol} type="button" className={icon.symbol.trim() === symbol.trim() ? "selected" : ""} onClick={() => updateIcon({ symbol })}>{symbol.trim()}</button>)}</div></div>
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
