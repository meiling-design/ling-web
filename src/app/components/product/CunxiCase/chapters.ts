export interface CunxiChapter {
  id: string;
  index: string;
  label: string;
  enLabel: string;
}

/** 寸隙案例的唯一章节清单 —— 导航与页面 section 共用 */
export const CUNXI_CHAPTERS: CunxiChapter[] = [
  { id: "brand-hero", index: "01", label: "品牌开篇", enLabel: "Brand Hero" },
  { id: "overview", index: "02", label: "产品概览", enLabel: "Overview" },
  { id: "problem", index: "03", label: "问题定义", enLabel: "The Problem" },
  { id: "strategy", index: "04", label: "产品策略", enLabel: "Product Strategy" },
  { id: "core-experience", index: "05", label: "核心体验", enLabel: "Core Experience" },
  { id: "capability-gap", index: "06", label: "能力与差距", enLabel: "Capability & Gap" },
  { id: "career-assets", index: "07", label: "职业资产", enLabel: "Career Assets" },
  { id: "brand-system", index: "08", label: "品牌系统", enLabel: "Brand System" },
  { id: "ai-engineering", index: "09", label: "AI 与工程", enLabel: "AI & Engineering" },
  { id: "reflection", index: "10", label: "回顾与展望", enLabel: "Reflection" },
];
