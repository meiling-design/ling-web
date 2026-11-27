/**
 * 寸隙 CUNXI 资产入口
 *
 * 约定目录：src/app/assets/cunxi/
 *   brand/cunxi-logo.svg
 *   brand/cunxi-brand-hero.webp
 *   brand/cunxi-brand-system.webp
 *   brand/cunxi-cover.webp
 *   app-screens/home.webp | analysis.webp | matching-detail.webp
 *                gap-analysis.webp | ai-chat.webp | career-assets.webp
 *   ip/nebula.svg
 *
 * 用 import.meta.glob 自动接管：用户把文件放进对应目录即可生效，
 * 不需要改任何章节代码。缺图时保持 null，由 AssetFrame 渲染明确占位。
 */
import { local } from "./imageAssetsLocal";

const modules = import.meta.glob<{ default: string }>(
  "./assets/cunxi/**/*.{svg,png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" },
);

const files = modules as unknown as Record<string, string>;

function find(...names: string[]): string | null {
  for (const name of names) {
    const url = files[`./assets/cunxi/${name}`];
    if (url) return url;
  }
  return null;
}

/** 用户已提供的品牌主视觉（位于 src/assets/） */
const providedBrandHero = local("01cunxi_brand_hero.jpg") || null;

export interface CunxiAssets {
  brand: {
    logo: string | null;
    hero: string | null;
    system: string | null;
    cover: string | null;
    coverPlaceholder: string | null;
  };
  ip: {
    nebula: string | null;
  };
  screens: {
    home: string | null;
    analysis: string | null;
    match: string | null;
    gap: string | null;
    ai: string | null;
    assets: string | null;
  };
}

export const cunxiAssets: CunxiAssets = {
  brand: {
    logo: find("brand/cunxi-logo.svg", "brand/cunxi-logo.png", "brand/cunxi-logo.webp"),
    hero:
      find("brand/cunxi-brand-hero.webp", "brand/cunxi-brand-hero.jpg", "brand/cunxi-brand-hero.png") ??
      providedBrandHero,
    system: find("brand/cunxi-brand-system.webp", "brand/cunxi-brand-system.jpg", "brand/cunxi-brand-system.png"),
    cover: find("brand/cunxi-cover.webp", "brand/cunxi-cover.jpg", "brand/cunxi-cover.png"),
    coverPlaceholder: find("brand/cunxi-cover-placeholder.svg"),
  },
  ip: {
    nebula: find("ip/nebula.svg", "ip/nebula.png"),
  },
  screens: {
    home: find("app-screens/home.webp", "app-screens/home.png", "app-screens/home.jpg"),
    analysis: find("app-screens/analysis.webp", "app-screens/analysis.png", "app-screens/analysis.jpg"),
    match: find("app-screens/matching-detail.webp", "app-screens/matching-detail.png", "app-screens/matching-detail.jpg"),
    gap: find("app-screens/gap-analysis.webp", "app-screens/gap-analysis.png", "app-screens/gap-analysis.jpg"),
    ai: find("app-screens/ai-chat.webp", "app-screens/ai-chat.png", "app-screens/ai-chat.jpg"),
    assets: find("app-screens/career-assets.webp", "app-screens/career-assets.png", "app-screens/career-assets.jpg"),
  },
};

/** 首页卡片封面：优先真实图，其次静态占位 SVG */
export const cunxiCover = cunxiAssets.brand.cover ?? cunxiAssets.brand.coverPlaceholder;
