"use client";

import { CSSProperties, useMemo, useState } from "react";
import {
  BadgeCheck,
  AlarmClock,
  Archive,
  Bell,
  BookOpen,
  Camera,
  Cloud,
  Coffee,
  Compass,
  Bot,
  Brackets,
  ChevronDown,
  Download,
  CircleDashed,
  Code,
  Command,
  Eye,
  FileText,
  Heart,
  Home as HomeIcon,
  Image as ImageIcon,
  KeyRound,
  Layers2,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  MousePointer2,
  Music2,
  Notebook,
  Orbit,
  Palette,
  Search,
  Settings2,
  Rocket,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Wifi,
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
type Layout = "stack" | "corner-tl" | "corner-tr" | "corner-bl" | "corner-br" | "inline" | "center" | "quad-grid" | "quad-top" | "quad-side" | "quad-diamond" | "quad-cross" | "quad-stack" | "quad-inline" | "quad-drift";
type FontKey = "plus" | "space" | "plex" | "mono";
type LetterShadow = "none" | "soft" | "hard";

const iconLibrary = {
  AlarmClock,
  Archive,
  Bell,
  BookOpen,
  Camera,
  Cloud,
  Coffee,
  Compass,
  Sparkles,
  Bot,
  Code,
  Brackets,
  ChevronDown,
  Download,
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
  Eye,
  FileText,
  Heart,
  Home: HomeIcon,
  Image: ImageIcon,
  KeyRound,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  Music2,
  Search,
  Settings2,
  Star,
  UserRound,
  Wifi,
} satisfies Record<string, IconNode>;

type IconName = keyof typeof iconLibrary;

const iconLabels: Record<IconName, string> = {
  AlarmClock: "闹钟",
  Archive: "归档",
  Bell: "提醒",
  BookOpen: "阅读",
  Camera: "相机",
  Cloud: "云端",
  Coffee: "咖啡",
  Compass: "指南针",
  Sparkles: "闪光",
  Bot: "助手",
  Code: "代码",
  Brackets: "括号",
  ChevronDown: "下箭头",
  Download: "下载",
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
  Eye: "查看",
  FileText: "文档",
  Heart: "喜欢",
  Home: "主页",
  Image: "图片",
  KeyRound: "密钥",
  Link2: "链接",
  Mail: "邮件",
  MapPin: "位置",
  MessageCircle: "消息",
  Monitor: "显示器",
  Music2: "音乐",
  Search: "搜索",
  Settings2: "设置",
  Star: "收藏",
  UserRound: "用户",
  Wifi: "网络",
};

const iconNames = Object.keys(iconLibrary) as IconName[];
const layoutOptions: Array<{ id: Layout; label: string }> = [
  { id: "stack", label: "上下" },
  { id: "corner-tl", label: "图形左上 / 字母右下" },
  { id: "corner-tr", label: "图形右上 / 字母左下" },
  { id: "corner-bl", label: "图形左下 / 字母右上" },
  { id: "corner-br", label: "图形右下 / 字母左上" },
  { id: "inline", label: "左右" },
  { id: "center", label: "居中" },
  { id: "quad-grid", label: "四角交错" },
  { id: "quad-top", label: "上下分组" },
  { id: "quad-side", label: "左右分组" },
  { id: "quad-diamond", label: "菱形四点" },
  { id: "quad-cross", label: "十字四点" },
  { id: "quad-stack", label: "纵向四列" },
  { id: "quad-inline", label: "横向四列" },
  { id: "quad-drift", label: "阶梯四点" },
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
    layout: "corner-tl",
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
    layout: "corner-tr",
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
  { background: "#56459b", foreground: "#f7f2ff", label: "Iris" },
  { background: "#f3b84b", foreground: "#173e3a", label: "Sun" },
  { background: "#c7eadc", foreground: "#0b4b61", label: "Mint" },
  { background: "#f0d1c1", foreground: "#6c2f3d", label: "Clay" },
  { background: "#242a31", foreground: "#f3cf59", label: "Graphite" },
  { background: "#2446d8", foreground: "#f7f2df", label: "Cobalt" },
  { background: "#ed7d31", foreground: "#fff8ed", label: "Tangerine" },
  { background: "#d8f56a", foreground: "#1e3329", label: "Lime" },
  { background: "#ddd4ff", foreground: "#45307a", label: "Lavender" },
  { background: "#6e315f", foreground: "#ffe0f0", label: "Plum" },
  { background: "#d8f3f0", foreground: "#0b5960", label: "Glacier" },
  { background: "#718355", foreground: "#fff5d6", label: "Moss" },
  { background: "#971f3f", foreground: "#fff0f2", label: "Cherry" },
  { background: "#2f5d8c", foreground: "#f9e8a8", label: "Denim" },
  { background: "#f4b183", foreground: "#4a2d27", label: "Apricot" },
];
const previewSizes = [16, 32, 48, 128] as const;
const DEFAULT_MARK_SCALE = 125;
const DEFAULT_QUAD_MARGIN = 18;
const DEFAULT_QUAD_SPACING = 0;
const DEFAULT_CONNECTOR_WIDTH = 2;
const QUAD_SLOT_SCALE_MIN = 50;
const QUAD_SLOT_SCALE_MAX = 160;
const QUAD_MARGIN_MIN = 12;
const QUAD_MARGIN_MAX = 30;
const QUAD_SPACING_MIN = -8;
const QUAD_SPACING_MAX = 20;

type IconState = {
  letter: string;
  iconName: IconName;
  background: string;
  foreground: string;
  shape: Shape;
  layout: Layout;
  fontKey: FontKey;
  iconScale: number;
  letterScale: number;
  letterShadow: LetterShadow;
  letterOffsetX: number;
  letterOffsetY: number;
  letterRotation: number;
  quadSlots: QuadSlot[];
  connectorStyle: ConnectorStyle;
  connectorWidth: number;
  quadMargin: number;
  quadSpacing: number;
};

type MarkKind = "icon" | "text";
type ConnectorStyle = "none" | "solid" | "dashed";
type QuadSlot = {
  enabled: boolean;
  kind: MarkKind;
  iconName: IconName;
  text: string;
  scale: number;
};

function quadSlotsForTemplate(template: Template): QuadSlot[] {
  return [
    { enabled: true, kind: "icon", iconName: template.iconName, text: "", scale: 100 },
    { enabled: Boolean(template.letter), kind: "text", iconName: template.iconName, text: template.letter, scale: 100 },
    { enabled: true, kind: "icon", iconName: template.iconName, text: "", scale: 100 },
    { enabled: Boolean(template.letter), kind: "text", iconName: template.iconName, text: template.letter, scale: 100 },
  ];
}

const initialIcon: IconState = {
  letter: templates[0].letter,
  iconName: templates[0].iconName,
  background: templates[0].background,
  foreground: templates[0].foreground,
  shape: templates[0].shape,
  layout: templates[0].layout,
  fontKey: templates[0].fontKey,
  iconScale: DEFAULT_MARK_SCALE,
  letterScale: DEFAULT_MARK_SCALE,
  letterShadow: "none",
  letterOffsetX: 0,
  letterOffsetY: 0,
  letterRotation: 0,
  quadSlots: quadSlotsForTemplate(templates[0]),
  connectorStyle: "none",
  connectorWidth: DEFAULT_CONNECTOR_WIDTH,
  quadMargin: DEFAULT_QUAD_MARGIN,
  quadSpacing: DEFAULT_QUAD_SPACING,
};

type MarkPoint = { x: number; y: number };
type IconMark = MarkPoint & { size: number; iconName: IconName };
type LetterMark = MarkPoint & { size: number; text: string };
type ConnectorLine = { x1: number; y1: number; x2: number; y2: number };
type MarkComposition = {
  iconMarks: IconMark[];
  letterMarks: LetterMark[];
  connectorLines: ConnectorLine[];
  strokeWidth: number;
};
type LayoutDefinition = {
  iconPoints?: MarkPoint[];
  letterPoints?: MarkPoint[];
  quadPoints?: MarkPoint[];
  density: number;
};

const CANVAS_SIZE = 128;
const SAFE_INSET = 16;
const SAFE_SIZE = CANVAS_SIZE - SAFE_INSET * 2;
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const GOLDEN_NEAR = Number((SAFE_INSET + (SAFE_SIZE * (1 - 1 / GOLDEN_RATIO)) / 2).toFixed(2));
const GOLDEN_FAR = Number((CANVAS_SIZE - GOLDEN_NEAR).toFixed(2));
const PAIR_ICON_SIZE = 29;
const SINGLE_ICON_SIZE = 46;
const MARK_SCALE_MIN = 20;
const MARK_SCALE_MAX = 400;
const OFFSET_MIN = -12;
const OFFSET_MAX = 12;
const ROTATION_MIN = -15;
const ROTATION_MAX = 15;
const letterShadowOptions: Array<{ id: LetterShadow; label: string }> = [
  { id: "none", label: "无" },
  { id: "soft", label: "柔和" },
  { id: "hard", label: "硬边" },
];

const layoutCompositions: Record<Layout, LayoutDefinition> = {
  stack: { iconPoints: [{ x: 64, y: GOLDEN_NEAR }], letterPoints: [{ x: 64, y: GOLDEN_FAR }], density: 1 },
  "corner-tl": { iconPoints: [{ x: GOLDEN_NEAR, y: GOLDEN_NEAR }], letterPoints: [{ x: GOLDEN_FAR, y: GOLDEN_FAR }], density: 1 },
  "corner-tr": { iconPoints: [{ x: GOLDEN_FAR, y: GOLDEN_NEAR }], letterPoints: [{ x: GOLDEN_NEAR, y: GOLDEN_FAR }], density: 1 },
  "corner-bl": { iconPoints: [{ x: GOLDEN_NEAR, y: GOLDEN_FAR }], letterPoints: [{ x: GOLDEN_FAR, y: GOLDEN_NEAR }], density: 1 },
  "corner-br": { iconPoints: [{ x: GOLDEN_FAR, y: GOLDEN_FAR }], letterPoints: [{ x: GOLDEN_NEAR, y: GOLDEN_NEAR }], density: 1 },
  inline: { iconPoints: [{ x: GOLDEN_NEAR, y: 64 }], letterPoints: [{ x: GOLDEN_FAR, y: 64 }], density: 1 },
  center: { iconPoints: [{ x: 64, y: GOLDEN_NEAR }], letterPoints: [{ x: 64, y: GOLDEN_FAR }], density: 1 },
  "quad-grid": {
    quadPoints: [{ x: GOLDEN_NEAR, y: GOLDEN_NEAR }, { x: GOLDEN_FAR, y: GOLDEN_NEAR }, { x: GOLDEN_FAR, y: GOLDEN_FAR }, { x: GOLDEN_NEAR, y: GOLDEN_FAR }],
    density: 0.78,
  },
  "quad-top": {
    quadPoints: [{ x: GOLDEN_NEAR, y: GOLDEN_NEAR }, { x: GOLDEN_NEAR, y: GOLDEN_FAR }, { x: GOLDEN_FAR, y: GOLDEN_NEAR }, { x: GOLDEN_FAR, y: GOLDEN_FAR }],
    density: 0.78,
  },
  "quad-side": {
    quadPoints: [{ x: GOLDEN_NEAR, y: GOLDEN_NEAR }, { x: GOLDEN_FAR, y: GOLDEN_NEAR }, { x: GOLDEN_NEAR, y: GOLDEN_FAR }, { x: GOLDEN_FAR, y: GOLDEN_FAR }],
    density: 0.78,
  },
  "quad-diamond": {
    quadPoints: [{ x: 64, y: GOLDEN_NEAR }, { x: GOLDEN_NEAR, y: 64 }, { x: 64, y: GOLDEN_FAR }, { x: GOLDEN_FAR, y: 64 }],
    density: 0.78,
  },
  "quad-cross": {
    quadPoints: [{ x: GOLDEN_NEAR, y: 64 }, { x: 64, y: GOLDEN_NEAR }, { x: GOLDEN_FAR, y: 64 }, { x: 64, y: GOLDEN_FAR }],
    density: 0.78,
  },
  "quad-stack": {
    quadPoints: [{ x: 64, y: 30 }, { x: 64, y: 54 }, { x: 64, y: 78 }, { x: 64, y: 102 }],
    density: 0.68,
  },
  "quad-inline": {
    quadPoints: [{ x: 30, y: 64 }, { x: 54, y: 64 }, { x: 78, y: 64 }, { x: 102, y: 64 }],
    density: 0.68,
  },
  "quad-drift": {
    quadPoints: [{ x: 34, y: 34 }, { x: 66, y: 50 }, { x: 62, y: 78 }, { x: 96, y: 96 }],
    density: 0.78,
  },
};

function letterSizeFor(letter: string) {
  if (letter.length === 0) return 0;
  if (/[\u3400-\u9fff]/.test(letter)) return 36;
  if (/[MW]/.test(letter)) return 35;
  if (/[I1]/.test(letter)) return 41;
  return 38;
}

function normalizeLetter(value: string) {
  return Array.from(value).slice(0, 1).join("").toUpperCase();
}

function letterWidthFactor(letter: string) {
  if (/[\u3400-\u9fff]/.test(letter)) return 0.94;
  if (/[MW]/.test(letter)) return 0.92;
  if (/[I1]/.test(letter)) return 0.36;
  return 0.76;
}

function clampWithinSafe(value: number, halfSize: number) {
  return Math.max(SAFE_INSET + halfSize, Math.min(CANVAS_SIZE - SAFE_INSET - halfSize, value));
}

function clampScale(value: number) {
  return Math.max(MARK_SCALE_MIN, Math.min(MARK_SCALE_MAX, value));
}

function clampOffset(value: number) {
  return Math.max(OFFSET_MIN, Math.min(OFFSET_MAX, value));
}

function clampRotation(value: number) {
  return Math.max(ROTATION_MIN, Math.min(ROTATION_MAX, value));
}

function clampSlotScale(value: number) {
  return Math.max(QUAD_SLOT_SCALE_MIN, Math.min(QUAD_SLOT_SCALE_MAX, value));
}

function clampQuadMargin(value: number) {
  return Math.max(QUAD_MARGIN_MIN, Math.min(QUAD_MARGIN_MAX, value));
}

function clampQuadSpacing(value: number) {
  return Math.max(QUAD_SPACING_MIN, Math.min(QUAD_SPACING_MAX, value));
}

function quadPointFor(point: MarkPoint, icon: IconState) {
  const marginScale = (64 - clampQuadMargin(icon.quadMargin)) / (64 - DEFAULT_QUAD_MARGIN);
  const spacingScale = 1 + clampQuadSpacing(icon.quadSpacing) / 64;
  const scale = marginScale * spacingScale;
  return {
    x: 64 + (point.x - 64) * scale,
    y: 64 + (point.y - 64) * scale,
  };
}

function connectorLinesFor(points: MarkPoint[], style: ConnectorStyle): ConnectorLine[] {
  if (style === "none" || points.length < 2) return [];
  return points.slice(1).map((point, index) => ({
    x1: points[index].x,
    y1: points[index].y,
    x2: point.x,
    y2: point.y,
  }));
}

function letterShadowCss(shadow: LetterShadow) {
  return {
    none: "none",
    soft: "1px 2px 2px rgba(0, 0, 0, .22)",
    hard: "2px 2px 0 rgba(0, 0, 0, .34)",
  }[shadow];
}

function isQuadLayout(layout: Layout) {
  return layout.startsWith("quad-");
}

function fitLetterMark(point: MarkPoint, text: string, baseSize: number, icon: IconState): LetterMark {
  const desiredLetterX = point.x + clampOffset(icon.letterOffsetX);
  const desiredLetterY = point.y + clampOffset(icon.letterOffsetY);
  const letterHalf = Math.min(desiredLetterX - SAFE_INSET, CANVAS_SIZE - SAFE_INSET - desiredLetterX);
  const letterVerticalHalf = Math.min(desiredLetterY - SAFE_INSET, CANVAS_SIZE - SAFE_INSET - desiredLetterY);
  const maxLetterByWidth = (letterHalf * 2) / letterWidthFactor(text);
  const maxLetterByHeight = (letterVerticalHalf * 2) / 0.86;
  const letterSize = Number(Math.min(baseSize, maxLetterByWidth, maxLetterByHeight).toFixed(2));
  return {
    x: clampWithinSafe(desiredLetterX, (letterSize * letterWidthFactor(text)) / 2),
    y: clampWithinSafe(desiredLetterY, (letterSize * 0.86) / 2),
    size: letterSize,
    text,
  };
}

function compositionFor(icon: IconState): MarkComposition {
  const iconScale = clampScale(icon.iconScale) / 100;
  const letterScale = clampScale(icon.letterScale) / 100;
  const layout = layoutCompositions[icon.layout];
  if (isQuadLayout(icon.layout)) {
    const density = layout.density;
    const iconSize = PAIR_ICON_SIZE * iconScale * density;
    const strokeWidth = 2.35;
    const iconHalf = iconSize / 2 + strokeWidth;
    const iconMarks: IconMark[] = [];
    const letterMarks: LetterMark[] = [];
    const activePoints: MarkPoint[] = [];
    const slots = icon.quadSlots.length === 4 ? icon.quadSlots : quadSlotsForTemplate(templates[0]);
    (layout.quadPoints ?? []).forEach((point, index) => {
      const slot = slots[index];
      if (!slot?.enabled) return;
      const positionedPoint = quadPointFor(point, icon);
      if (slot.kind === "icon") {
        activePoints.push(positionedPoint);
        iconMarks.push({
          x: clampWithinSafe(positionedPoint.x, iconHalf),
          y: clampWithinSafe(positionedPoint.y, iconHalf),
          size: iconSize * clampSlotScale(slot.scale) / 100,
          iconName: slot.iconName,
        });
        return;
      }
      if (slot.text) {
        activePoints.push(positionedPoint);
        letterMarks.push(fitLetterMark(positionedPoint, slot.text, letterSizeFor(slot.text) * letterScale * density * clampSlotScale(slot.scale) / 100, icon));
      }
    });
    return { iconMarks, letterMarks, connectorLines: connectorLinesFor(activePoints, icon.connectorStyle), strokeWidth };
  }
  if (!icon.letter) {
    const strokeWidth = 2.3;
    const iconSize = Math.min(SINGLE_ICON_SIZE * iconScale, SAFE_SIZE - strokeWidth * 2);
    return { iconMarks: [{ x: 64, y: 64, size: iconSize, iconName: icon.iconName }], letterMarks: [], connectorLines: [], strokeWidth };
  }
  const density = layout.density;
  const iconSize = PAIR_ICON_SIZE * iconScale * density;
  const letterBaseSize = letterSizeFor(icon.letter) * letterScale * density;
  const strokeWidth = isQuadLayout(icon.layout) ? 2.35 : 2.55;
  const iconHalf = iconSize / 2 + strokeWidth;
  const iconPoints = (layout.iconPoints ?? []).map((point) => quadPointFor(point, icon));
  const letterPoints = (layout.letterPoints ?? []).map((point) => quadPointFor(point, icon));
  const iconMarks = iconPoints.map((point) => ({
    x: clampWithinSafe(point.x, iconHalf),
    y: clampWithinSafe(point.y, iconHalf),
    size: iconSize,
    iconName: icon.iconName,
  }));
  const letterMarks = letterPoints.map((point) => fitLetterMark(point, icon.letter, letterBaseSize, icon));
  return {
    iconMarks,
    letterMarks,
    connectorLines: connectorLinesFor([...iconPoints, ...letterPoints], icon.connectorStyle),
    strokeWidth,
  };
}

function iconStateFromTemplate(template: Template): IconState {
  return {
    letter: template.letter,
    iconName: template.iconName,
    background: template.background,
    foreground: template.foreground,
    shape: template.shape,
    layout: template.layout,
    fontKey: template.fontKey,
    iconScale: DEFAULT_MARK_SCALE,
    letterScale: DEFAULT_MARK_SCALE,
    letterShadow: "none",
    letterOffsetX: 0,
    letterOffsetY: 0,
    letterRotation: 0,
    quadSlots: quadSlotsForTemplate(template),
    connectorStyle: "none",
    connectorWidth: DEFAULT_CONNECTOR_WIDTH,
    quadMargin: DEFAULT_QUAD_MARGIN,
    quadSpacing: DEFAULT_QUAD_SPACING,
  };
}

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

function iconNodeFor(name: IconName) {
  const node = iconLibrary[name];
  if (!Array.isArray(node)) throw new Error(`Icon ${name} is not a Lucide node`);
  return node;
}

function IconGlyph({ name }: { name: IconName }) {
  const node = iconNodeFor(name);
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
  const composition = compositionFor(icon);
  const hasLetters = composition.letterMarks.length > 0;
  const style = {
    "--icon-background": icon.background,
    "--icon-foreground": icon.foreground,
    "--icon-font": fontFamilyFor(icon.fontKey),
    "--mark-letter-rotation": `${clampRotation(icon.letterRotation)}deg`,
    "--mark-letter-shadow": letterShadowCss(icon.letterShadow),
    "--mark-stroke-width": composition.strokeWidth,
  } as CSSProperties;

  return (
    <div
      className={`icon-artwork icon-${size} shape-${icon.shape} layout-${icon.layout} ${hasLetters ? "" : "icon-only"}`}
      style={style}
      aria-label={`${hasLetters ? `${composition.letterMarks.map((mark) => mark.text).join(" ")} ` : ""}${icon.iconName} icon`}
    >
      <span className="artwork-safe">
        {composition.connectorLines.length > 0 ? (
          <svg
            className="artwork-connectors"
            viewBox={`0 0 ${SAFE_SIZE} ${SAFE_SIZE}`}
            aria-hidden="true"
            fill="none"
            style={{ color: icon.foreground }}
          >
            {composition.connectorLines.map((line, index) => (
              <line
                key={`connector-${index}`}
                x1={line.x1 - SAFE_INSET}
                y1={line.y1 - SAFE_INSET}
                x2={line.x2 - SAFE_INSET}
                y2={line.y2 - SAFE_INSET}
                stroke="currentColor"
                strokeWidth={icon.connectorWidth}
                strokeLinecap="round"
                strokeDasharray={icon.connectorStyle === "dashed" ? "3 3" : undefined}
              />
            ))}
          </svg>
        ) : null}
        {composition.iconMarks.map((mark, index) => (
          <span
            key={`icon-${index}`}
            className="artwork-icon"
            style={{
              "--mark-icon-x-local": `${((mark.x - SAFE_INSET) / SAFE_SIZE) * 100}%`,
              "--mark-icon-y-local": `${((mark.y - SAFE_INSET) / SAFE_SIZE) * 100}%`,
              "--mark-icon-size-local": `${(mark.size / SAFE_SIZE) * 100}%`,
            } as CSSProperties}
          >
            <IconGlyph name={mark.iconName} />
          </span>
        ))}
        {composition.letterMarks.map((mark, index) => (
          <span
            key={`letter-${index}`}
            className="artwork-letter"
            style={{
              "--mark-letter-x-local": `${((mark.x - SAFE_INSET) / SAFE_SIZE) * 100}%`,
              "--mark-letter-y-local": `${((mark.y - SAFE_INSET) / SAFE_SIZE) * 100}%`,
              "--mark-letter-size-local": `${(mark.size / SAFE_SIZE) * 100}cqw`,
            } as CSSProperties}
          >
            {mark.text}
          </span>
        ))}
      </span>
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
  const composition = compositionFor(icon);
  const iconMarkup = composition.iconMarks.map((mark) => {
    const iconNodes = iconNodeFor(mark.iconName).map(([tag, attrs]) => {
      const attributes = Object.entries(attrs)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}="${escapeXml(String(value))}"`)
        .join(" ");
      return `<${tag} ${attributes}/>`;
    }).join("");
    const scale = mark.size / 24;
    return `<g transform="translate(${mark.x - mark.size / 2} ${mark.y - mark.size / 2}) scale(${scale})" fill="none" stroke="${icon.foreground}" stroke-width="${composition.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${iconNodes}</g>`;
  }).join("");
  const connectorMarkup = composition.connectorLines.map((line) => (
    `<line x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}" stroke="${icon.foreground}" stroke-width="${icon.connectorWidth}" stroke-linecap="round"${icon.connectorStyle === "dashed" ? ' stroke-dasharray="3 3"' : ""}/>`
  )).join("");
  const letterShadowMarkup = icon.letterShadow === "none"
    ? ""
    : `<filter id="letter-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="${icon.letterShadow === "hard" ? 2 : 1}" dy="${icon.letterShadow === "hard" ? 2 : 2}" stdDeviation="${icon.letterShadow === "hard" ? 0 : 1.8}" flood-color="#000000" flood-opacity="${icon.letterShadow === "hard" ? 0.34 : 0.22}"/></filter>`;
  const letterMarkup = composition.letterMarks.map((mark) => (
    `<text x="${mark.x}" y="${mark.y}"${icon.letterRotation ? ` transform="rotate(${clampRotation(icon.letterRotation)} ${mark.x} ${mark.y})"` : ""}${icon.letterShadow === "none" ? "" : ' filter="url(#letter-shadow)"'} text-anchor="middle" dominant-baseline="middle" font-family="${escapeXml(fontFamilyFor(icon.fontKey))}" font-size="${mark.size}" font-weight="720" letter-spacing="-2" fill="${icon.foreground}">${escapeXml(mark.text)}</text>`
  )).join("");
  const safeMarkup = `<defs><clipPath id="safe-area"><rect x="${SAFE_INSET}" y="${SAFE_INSET}" width="${SAFE_SIZE}" height="${SAFE_SIZE}"/></clipPath>${letterShadowMarkup}</defs>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  ${safeMarkup}
  <rect width="128" height="128" rx="${radius}" fill="${icon.background}"/>
  <g clip-path="url(#safe-area)">
    ${connectorMarkup}
    ${iconMarkup}
    ${letterMarkup}
  </g>
</svg>`;
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

function statusForSize() {
  return { label: "清晰", tone: "good" };
}

function GeometryControls({
  icon,
  onUpdate,
}: {
  icon: IconState;
  onUpdate: (patch: Partial<IconState>) => void;
}) {
  return (
    <div className="control-field quad-geometry">
      <label className="quad-geometry-control">
        <span>外边距 <output>{icon.quadMargin}px</output></span>
        <input type="range" min={QUAD_MARGIN_MIN} max={QUAD_MARGIN_MAX} step="1" value={icon.quadMargin} onChange={(event) => onUpdate({ quadMargin: Number(event.target.value) })} aria-label="构图外边距" />
      </label>
      <label className="quad-geometry-control">
        <span>元素距离 <output>{icon.quadSpacing > 0 ? `+${icon.quadSpacing}` : icon.quadSpacing}px</output></span>
        <input type="range" min={QUAD_SPACING_MIN} max={QUAD_SPACING_MAX} step="1" value={icon.quadSpacing} onChange={(event) => onUpdate({ quadSpacing: Number(event.target.value) })} aria-label="元素距离" />
      </label>
      <div className="quad-connector-control">
        <span>连线</span>
        <div className="connector-options">
          {([[
            "none",
            "无",
          ], [
            "solid",
            "实线",
          ], [
            "dashed",
            "虚线",
          ]] as Array<[ConnectorStyle, string]>).map(([style, label]) => (
            <button key={style} type="button" className={icon.connectorStyle === style ? "selected" : ""} onClick={() => onUpdate({ connectorStyle: style })} aria-label={`连线${label}`}>{label}</button>
          ))}
        </div>
      </div>
      <label className="quad-geometry-control">
        <span>线宽 <output>{icon.connectorWidth}px</output></span>
        <input type="range" min="1" max="4" step="1" value={icon.connectorWidth} disabled={icon.connectorStyle === "none"} onChange={(event) => onUpdate({ connectorWidth: Number(event.target.value) })} aria-label="连线宽度" />
      </label>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [icon, setIcon] = useState<IconState>(initialIcon);
  const [prompt, setPrompt] = useState("一个安静、可靠的开发者工具图标");
  const [exportTarget, setExportTarget] = useState<ExportTarget>("chrome");
  const [notice, setNotice] = useState("已准备好一个基础方案");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComposingLetter, setIsComposingLetter] = useState(false);
  const [activeQuadSlot, setActiveQuadSlot] = useState(0);

  const selected = useMemo(
    () => templates.find((template) => template.id === selectedTemplate) ?? templates[0],
    [selectedTemplate],
  );
  const currentQuadSlot = icon.quadSlots[activeQuadSlot] ?? icon.quadSlots[0];

  const applyTemplate = (template: Template) => {
    setSelectedTemplate(template.id);
    setIcon(iconStateFromTemplate(template));
    setActiveQuadSlot(0);
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
    setIcon((current) => {
      const next = { ...current, ...patch };
      if (typeof patch.letter === "string") {
        next.quadSlots = current.quadSlots.map((slot) => slot.kind === "text" ? { ...slot, text: patch.letter ?? "" } : slot);
      }
      return next;
    });
    setNotice("方案已更新");
  };

  const updateQuadSlot = (index: number, patch: Partial<QuadSlot>) => {
    setIcon((current) => {
      const quadSlots = current.quadSlots.map((slot, slotIndex) => slotIndex === index ? { ...slot, ...patch } : slot);
      const firstText = quadSlots.find((slot) => slot.enabled && slot.kind === "text" && slot.text)?.text ?? "";
      const firstIcon = quadSlots.find((slot) => slot.enabled && slot.kind === "icon")?.iconName ?? current.iconName;
      return { ...current, quadSlots, letter: firstText, iconName: firstIcon };
    });
    setNotice(`位置 ${String(index + 1).padStart(2, "0")} 已更新`);
  };

  const selectIcon = (name: IconName) => {
    if (isQuadLayout(icon.layout)) {
      updateQuadSlot(activeQuadSlot, { kind: "icon", iconName: name, enabled: true });
      return;
    }
    updateIcon({ iconName: name });
  };

  const updateActiveQuadText = (value: string) => {
    updateQuadSlot(activeQuadSlot, { kind: "text", text: value, enabled: true });
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
      data: encoder.encode(JSON.stringify({ version: 3, ...icon }, null, 2)),
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
          <a className="repo-link" href="https://github.com/holynova/tiny-icons" target="_blank" rel="noreferrer">GitHub Repo</a>
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
                    <IconArtwork icon={iconStateFromTemplate(template)} size="small" />
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
              <p className="intro-copy">图形和字母共用一套光学尺寸，先看 16px，再看 128px。</p>
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
              {isQuadLayout(icon.layout) ? (
                <div className="control-field quad-field">
                  <span>4 ELEMENTS / 四位置</span>
                  <div className="quad-slot-list">
                    {icon.quadSlots.map((slot, index) => (
                      <div className={`quad-slot-card ${activeQuadSlot === index ? "active" : ""} ${slot.enabled ? "" : "disabled"}`} key={`slot-${index}`}>
                        <button className="quad-slot-select" type="button" onClick={() => setActiveQuadSlot(index)} aria-label={`编辑位置 ${index + 1}`}>
                          <span className="quad-slot-index">0{index + 1}</span>
                          <strong>{slot.kind === "icon" ? iconLabels[slot.iconName] : slot.text || "文字"}</strong>
                        </button>
                        <button className="quad-slot-toggle" type="button" onClick={() => updateQuadSlot(index, { enabled: !slot.enabled })} aria-label={`${slot.enabled ? "关闭" : "打开"}位置 ${index + 1}`}>{slot.enabled ? "显示" : "关闭"}</button>
                        <div className="quad-slot-kind">
                          <button className={slot.kind === "icon" ? "selected" : ""} type="button" onClick={() => { setActiveQuadSlot(index); updateQuadSlot(index, { kind: "icon", enabled: true }); }}>图标</button>
                          <button className={slot.kind === "text" ? "selected" : ""} type="button" onClick={() => { setActiveQuadSlot(index); updateQuadSlot(index, { kind: "text", enabled: true }); }}>文字</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="quad-slot-detail">
                    <span>当前位置 0{activeQuadSlot + 1}</span>
                    <span>{currentQuadSlot?.kind === "icon" ? "选择图标" : "输入文字"}</span>
                    {currentQuadSlot?.kind === "text" ? <input value={currentQuadSlot.text} lang="zh-CN" inputMode="text" placeholder="A / 字 / 留空" aria-label={`位置 ${activeQuadSlot + 1} 的文字`} onCompositionStart={() => setIsComposingLetter(true)} onCompositionEnd={(event) => { setIsComposingLetter(false); updateActiveQuadText(normalizeLetter(event.currentTarget.value)); }} onChange={(event) => { const value = event.target.value; updateActiveQuadText(isComposingLetter || event.nativeEvent.isComposing ? value : normalizeLetter(value)); }} /> : <small>从下方图标库选择当前图形</small>}
                    {currentQuadSlot ? (
                      <label className="quad-slot-scale">
                        <span>大小 <output>{currentQuadSlot.scale}%</output></span>
                        <input type="range" min={QUAD_SLOT_SCALE_MIN} max={QUAD_SLOT_SCALE_MAX} step="5" value={currentQuadSlot.scale} onChange={(event) => updateQuadSlot(activeQuadSlot, { scale: Number(event.target.value) })} aria-label={`位置 ${activeQuadSlot + 1} 的大小`} />
                      </label>
                    ) : null}
                  </div>
                </div>
              ) : (
                <label className="control-field text-field"><span>LETTER / 汉字</span><input value={icon.letter} lang="zh-CN" inputMode="text" placeholder="A / 字" aria-label="字母或汉字" onCompositionStart={() => setIsComposingLetter(true)} onCompositionEnd={(event) => { setIsComposingLetter(false); updateIcon({ letter: normalizeLetter(event.currentTarget.value) }); }} onChange={(event) => { const value = event.target.value; updateIcon({ letter: isComposingLetter || event.nativeEvent.isComposing ? value : normalizeLetter(value) }); }} /></label>
              )}
              <GeometryControls icon={icon} onUpdate={updateIcon} />
              <div className="control-field icon-field"><span>ICON LIBRARY{isQuadLayout(icon.layout) ? ` / POSITION ${String(activeQuadSlot + 1).padStart(2, "0")}` : ""}</span><div className="icon-options">{iconNames.map((name) => <button key={name} type="button" className={(isQuadLayout(icon.layout) ? currentQuadSlot?.kind === "icon" && currentQuadSlot.iconName === name : icon.iconName === name) ? "selected" : ""} onClick={() => selectIcon(name)} aria-label={iconLabels[name]} title={iconLabels[name]}><IconGlyph name={name} /></button>)}</div></div>
              <div className="control-field layout-field"><span>LAYOUT</span><div className="layout-options">{layoutOptions.map((option) => <button key={option.id} type="button" className={icon.layout === option.id ? "selected" : ""} onClick={() => updateIcon({ layout: option.id })} aria-label={option.label} title={option.label}><span className={`layout-sample sample-${option.id}`}><i /><b />{isQuadLayout(option.id) ? <><em /><strong /></> : null}</span></button>)}</div></div>
              <div className="control-field font-field"><span>TYPE</span><div className="font-options">{fontOptions.map((font) => <button key={font.id} type="button" className={icon.fontKey === font.id ? "selected" : ""} onClick={() => updateIcon({ fontKey: font.id })} style={{ "--font-sample": fontFamilyFor(font.id) } as CSSProperties} aria-label={font.label} title={font.label}><span>{font.sample}</span></button>)}</div></div>
              <div className="control-field scale-field">
                <span>SIZE</span>
                <div className="scale-controls">
                  <label className="scale-control">
                    <span>图形 <output>{icon.iconScale}%</output></span>
                    <input type="range" min={MARK_SCALE_MIN} max={MARK_SCALE_MAX} step="5" value={icon.iconScale} onChange={(event) => updateIcon({ iconScale: Number(event.target.value) })} aria-label="图标大小" />
                  </label>
                  <label className="scale-control">
                    <span>字母 <output>{icon.letterScale}%</output></span>
                    <input type="range" min={MARK_SCALE_MIN} max={MARK_SCALE_MAX} step="5" value={icon.letterScale} disabled={!icon.letter} onChange={(event) => updateIcon({ letterScale: Number(event.target.value) })} aria-label="字母大小" />
                  </label>
                </div>
              </div>
              <div className="control-field text-style-field">
                <span>TEXT EFFECTS</span>
                <div className="text-effects">
                  <div className="effect-group shadow-effect-group">
                    <span>阴影</span>
                    <div className="shadow-options">{letterShadowOptions.map((option) => <button key={option.id} type="button" className={icon.letterShadow === option.id ? "selected" : ""} disabled={!icon.letter} onClick={() => updateIcon({ letterShadow: option.id })} aria-label={`文字${option.label}阴影`} title={`文字${option.label}阴影`}>{option.label}</button>)}</div>
                  </div>
                  <label className="offset-control"><span>水平 <output>{icon.letterOffsetX > 0 ? `+${icon.letterOffsetX}` : icon.letterOffsetX}</output></span><input type="range" min={OFFSET_MIN} max={OFFSET_MAX} step="1" value={icon.letterOffsetX} disabled={!icon.letter} onChange={(event) => updateIcon({ letterOffsetX: Number(event.target.value) })} aria-label="文字水平偏移" /></label>
                  <label className="offset-control"><span>垂直 <output>{icon.letterOffsetY > 0 ? `+${icon.letterOffsetY}` : icon.letterOffsetY}</output></span><input type="range" min={OFFSET_MIN} max={OFFSET_MAX} step="1" value={icon.letterOffsetY} disabled={!icon.letter} onChange={(event) => updateIcon({ letterOffsetY: Number(event.target.value) })} aria-label="文字垂直偏移" /></label>
                  <label className="offset-control"><span>旋转 <output>{icon.letterRotation > 0 ? `+${icon.letterRotation}` : icon.letterRotation}°</output></span><input type="range" min={ROTATION_MIN} max={ROTATION_MAX} step="1" value={icon.letterRotation} disabled={!icon.letter} onChange={(event) => updateIcon({ letterRotation: Number(event.target.value) })} aria-label="文字旋转" /></label>
                </div>
              </div>
              <div className="control-field"><span>SHAPE</span><div className="shape-options">{(["circle", "rounded", "square"] as Shape[]).map((shape) => <button key={shape} className={`shape-control shape-control-${shape} ${icon.shape === shape ? "selected" : ""}`} type="button" onClick={() => updateIcon({ shape })} aria-label={shape} />)}</div></div>
              <div className="control-field"><span>PALETTE</span><div className="color-options">{colorOptions.map((color) => <button key={color.label} className={icon.background === color.background ? "selected" : ""} type="button" style={{ "--swatch-bg": color.background, "--swatch-fg": color.foreground } as CSSProperties} onClick={() => updateIcon({ background: color.background, foreground: color.foreground })} aria-label={color.label} />)}</div></div>
            </div>
          </div>
        </section>

        <aside className="right-rail">
          <div className="preview-heading"><div><span className="eyebrow">SIZE CHECK</span><h2>Still clear?</h2></div><span className={`pass-badge ${icon.letter.length > 1 ? "has-warning" : ""}`}>{icon.letter.length > 1 ? "PASS / 03 + WARN / 01" : "PASS / 04"}</span></div>
          <div className="preview-list">
            {previewSizes.map((size) => {
              const status = statusForSize();
              return <div className="preview-row" key={size}>
                <div className={`preview-art preview-art-${size}`}><IconArtwork icon={icon} size="small" /></div>
                <div className="preview-meta"><strong>{size}<small>×</small>{size}</strong><span>{size === 128 ? "Chrome store" : size === 16 ? "Toolbar / tab" : "Browser UI"}</span></div>
                <span className={`preview-status ${status.tone}`}><i />{status.label}</span>
              </div>;
            })}
          </div>
          <div className="preview-tip"><span>TIP / 16 PX</span><p>{icon.letter ? "图形与字母共享同一组视觉尺寸，16px 下仍保持清晰。" : "单一图形保持完整轮廓，16px 下不需要额外简化。"}</p></div>
          <div className="download-card"><div className="download-card-top"><span className="download-icon">↓</span><div><span>READY TO USE</span><strong>{exportTarget === "chrome" ? "Chrome icon pack" : "Favicon pack"}</strong></div></div><button type="button" onClick={exportPack}>下载 .ZIP <span>↗</span></button><small>含 PNG、SVG 与可编辑 spec</small></div>
        </aside>
      </div>

      <footer className="bottombar"><span><i /> NO ACCOUNT NEEDED</span><span>LOCAL DRAFTS ONLY</span><span>DESIGNED FOR 16 PX</span></footer>
    </main>
  );
}
