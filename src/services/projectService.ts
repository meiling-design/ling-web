/**
 * 项目数据服务 — 统一管理「作品列表展示」与「项目详情」两层数据。
 *
 * ## 职责
 * - 提供首页作品卡片所需的轻量展示数据（title / homeTags / image）
 * - 提供分组（research / practice / photography / IP / product-cases）
 * - 透传项目详情数据（projectDetailData）
 * - 提供项目 ID 列表与前后导航辅助
 *
 * ## 设计原则
 * - projectDetailData 是**详情数据**的唯一真实来源
 * - listingOverrides 仅存放「展示层」与「详情层」不一致的字段覆写
 * - 新增项目：① 在 projectDetailData 中写完整数据 ② 在对应分组的 projectIds 追加 id
 *   ③ 如展示层与详情层的 title/image 不同，在 listingOverrides 中覆写
 */
import { ProjectData, projectDetailData } from "../app/projectDetailData";
import { localImages } from "../app/imageAssets";

// ---- 透传详情数据 ----

export type { ProjectData } from "../app/projectDetailData";
export { projectDetailData };

// ---- Listing 类型 ----

export interface ProjectListing {
  id: string;
  title: string;
  /** 首页卡片标签（homeTags 拼接） */
  category: string;
  subtitle: string;
  image?: string;
  homeDescription?: string;
}

// ---- Listing 覆写表 ----
// 仅当「首页卡片」与「详情页」的 title / image 不同时才需配置。
// 标题不填则复用 projectDetailData 中的 title。
// 封面图不填则取 project.images[0]。
// 首页标签使用 project.homeTags，无需在此覆写。
// ────────────────────────────────────────────

interface ListingOverride {
  title?: string;
  subtitle?: string;
  image?: string;
}

const listingOverrides: Record<string, ListingOverride> = {
  // ====== Research ======
  "memory-narrator":      { image: localImages.researchImageA },
  "yaowan-cultural":      { image: localImages.researchImageB },
  "huxiang-dwellings":    { image: localImages.cover03_1 },
  "bolivia-kindergarten": { image: localImages.cover4 },
  "laoximen-renewal":     { image: localImages.cover05_1 },

  // ====== Practice ======
  "toronto-phoenix-club":       { image: localImages.cover1 },
  "shenzhen-29-high-school":    { image: localImages.cover2 },
  "nmpa-dawanqu-center":        { image: localImages.cover3_12 },
  "london-book-fair-2025":      { image: localImages.london11 },
  "shangye-future-farm":        { image: localImages.cover3 },
  "mountain-river-poem":        { image: localImages.cover6 },
  "shilu-culture-gallery":      { image: localImages.cover5 },
  "tongxin-reception-hall":     { image: localImages.cover6_1 },
  "juvenile-law-base":          { image: localImages.cover7 },
  "rizhao-dongfang-jiuli-qingchuan": { image: localImages.cover8 },
  "dongfang-jiuli-pianqu":      { image: localImages.cover9 },
  "kaikudala-camp":             { image: localImages.cover10 },
  "racstudio-6f":               { image: localImages.cover12 },

  // ====== Photography ======
  "ancient-village":            { image: localImages.arcphoto4 },

  // ====== IP ======
  "gong-xiaoxin":                { image: localImages.coverip1 },
  "new-energy-vehicle-competition": { image: localImages.coverip2_1 },
  "shanhaijing-beasts":          { image: localImages.coverip3 },
  "tujia-bro编织-pattern":       { image: localImages.coverip4 },

  // ====== Product Case Studies ======
  "yimo-vr-platform":            { image: localImages.cover00 },
  "job-matching-ai-agent":       { title: "Careerly —— AI Career Growth", image: localImages.cover01 },
};

// ---- 内部函数 ----

const listingCache = new Map<string, ProjectListing>();
const projectGroupById = new Map<string, ProjectGroup>();
const projectGroupIndex = new Map<string, string>();

function toListing(id: string): ProjectListing {
  const cached = listingCache.get(id);
  if (cached) return cached;

  const project = projectDetailData[id];
  if (!project) {
    const fallback = { id, title: id, subtitle: "", category: "" };
    listingCache.set(id, fallback);
    return fallback;
  }

  const override = listingOverrides[id];
  const listing: ProjectListing = {
    id,
    title: override?.title ?? project.title,
    subtitle: override?.subtitle ?? project.subtitle,
    category: project.homeTags.join(" · "),
    image: override?.image ?? project.images?.[0],
    homeDescription: project.homeDescription,
  };

  listingCache.set(id, listing);
  return listing;
}

// ---- 分组定义 ----
// 新增项目时在此追加 id，Home.tsx 会自动渲染
// ────────────────────────────────────────────

export interface ProjectGroup {
  id: string;
  title: string;
  subtitle: string;
  projectIds: string[];
  /** 详情页是否显示 detailTags（product-cases 类项目为 false） */
  showDetailTags?: boolean;
}

export const projectGroups: ProjectGroup[] = [
  {
    id: "product-cases",
    title: "Product Case Studies",
    subtitle: "产品设计 / 用户体验 · 技术探索",
    // job-matching-ai-agent（Careerly）暂时隐藏入口：移出 projectIds 后首页卡片不再渲染它，
    // allProjectIds 也随之不含它（上下页导航一并排除），但 /project/job-matching-ai-agent
    // 路由仍可直达 —— 详情数据来自 projectDetailData，不依赖分组。
    // 要恢复显示，把 "job-matching-ai-agent" 加回本数组即可（listingOverrides 里的配置仍在）。
    projectIds: ["yimo-vr-platform"],
    showDetailTags: false,
  },
  {
    id: "research",
    title: "RESEARCH",
    subtitle: "研究性项目 / 设计竞赛与学术探索",
    projectIds: [
      "memory-narrator",
      "yaowan-cultural",
      "huxiang-dwellings",
      "bolivia-kindergarten",
      "laoximen-renewal",
    ],
  },
  {
    id: "practice",
    title: "PRACTICE",
    subtitle: "实际项目 / 落地项目与社会实践",
    projectIds: [
      "toronto-phoenix-club",
      "shenzhen-29-high-school",
      "nmpa-dawanqu-center",
      "london-book-fair-2025",
      "shangye-future-farm",
      "mountain-river-poem",
      "shilu-culture-gallery",
      "tongxin-reception-hall",
      "juvenile-law-base",
      "rizhao-dongfang-jiuli-qingchuan",
      "dongfang-jiuli-pianqu",
      "kaikudala-camp",
      "racstudio-6f",
    ],
  },
  {
    id: "ip-culture",
    title: "IP 文创 / IP & Cultural Creative",
    subtitle: "原创IP · 文创产品 · 非遗创新",
    projectIds: [
      "gong-xiaoxin",
      "new-energy-vehicle-competition",
      "shanhaijing-beasts",
      "tujia-bro编织-pattern",
    ],
  },
  {
    id: "photography",
    title: "PHOTOGRAPHY",
    subtitle: "摄影 / 建筑摄影与光影叙事",
    projectIds: ["yangtze-bridge", "ancient-village"],
  },
];

// ---- 全量有序 ID 列表 ----
// 与 projectGroups 顺序一致，保证详情页导航顺序与首页卡片顺序相同
const allProjectIds = projectGroups.flatMap(group => group.projectIds);

// ---- 反向索引缓存 ----

for (const group of projectGroups) {
  projectGroupById.set(group.id, group);
  for (const pid of group.projectIds) {
    projectGroupIndex.set(pid, group.id);
  }
}

// ---- 对外 API ----

/** 获取某个分组下的所有项目列表（用于 Home 页） */
export function getGroupProjects(ids: string[]): ProjectListing[] {
  return ids.map(toListing);
}

/** 获取所有项目 ID（有序） */
export function getAllProjectIds(): string[] {
  return allProjectIds;
}

/** 根据 ID 获取完整项目详情数据 */
export function getProjectById(id: string): ProjectData | undefined {
  return projectDetailData[id];
}

/** 根据项目 ID 查找所属分组 ID（O(1) 缓存查询） */
export function getProjectGroup(id: string): string | undefined {
  return projectGroupIndex.get(id);
}

/** 根据分组 ID 获取完整分组信息 */
export function getGroupById(groupId: string): ProjectGroup | undefined {
  return projectGroupById.get(groupId);
}

/** 指定分组是否应在详情页显示 detailTags */
export function groupHasDetailTags(groupId: string): boolean {
  const group = getGroupById(groupId);
  return group?.showDetailTags ?? true;
}
