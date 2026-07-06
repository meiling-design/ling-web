/**
 * 图片资源管理 — 支持本地文件与 Cloudinary CDN 双模式
 *
 * 本地开发：默认使用 src/assets/ 下的本地文件
 * Cloudinary：设置环境变量 VITE_USE_CLOUDINARY=true，然后运行 upload 脚本
 *   node scripts/upload-to-cloudinary.js
 *   脚本会生成 src/data/cloudinary-urls.json，构建时自动使用 CDN URL
 */
import { local } from "./imageAssetsLocal";

/** Cloudinary URL 映射（构建时注入） */
let cloudinaryMap: Record<string, string> = {};

// 构建时导入 Cloudinary URL 映射（由 upload-to-cloudinary.js 生成）
// 当 images 为空对象时，使用本地文件
import cloudinaryData from "../data/cloudinary-urls.json";
if (cloudinaryData.images && Object.keys(cloudinaryData.images).length > 0) {
  cloudinaryMap = Object.fromEntries(
    Object.entries(cloudinaryData.images).map(([key, val]: [string, any]) => [key, val.url]),
  );
}

/**
 * 根据文件名获取图片 URL
 * VITE_USE_CLOUDINARY=true 且 cloudinary-urls.json 存在时返回 CDN URL
 * 否则返回本地构建后的 URL
 */
function resolveByFilename(filename: string): string {
  if (import.meta.env.VITE_USE_CLOUDINARY === "true" && cloudinaryMap[filename]) {
    return cloudinaryMap[filename];
  }
  return local(filename);
}

export const localImages = {
  ip01: resolveByFilename("IP01.webp"),
  ip02: resolveByFilename("IP02.webp"),
  ip03: resolveByFilename("IP03.webp"),
  ipDesign5: resolveByFilename("ipdesign-5.jpg"),
  ipDesign6: resolveByFilename("ipdesign-6.jpg"),
  ipDesign7: resolveByFilename("ipdesign-7.jpg"),
  ipDesign10: resolveByFilename("ipdesign-10.jpg"),
  profileImage: resolveByFilename("me.jpg"),
  researchImageA: resolveByFilename("container-homepage.webp"),
  researchImageB: resolveByFilename("site.jpg"),
  arcphoto1: resolveByFilename("arcphoto1.jpg"),
  arcphoto2: resolveByFilename("arcphoto2.jpg"),
  arcphoto3: resolveByFilename("arcphoto3.jpg"),
  arcphoto4: resolveByFilename("arcphoto4.jpg"),
  arcphoto5: resolveByFilename("arcphoto5.jpg"),
  landscape0: resolveByFilename("landscape0.jpg"),
  landscape1: resolveByFilename("landscape1.jpg"),
  landscape2: resolveByFilename("landscape2.jpg"),
  landscape3: resolveByFilename("landscape3.jpg"),
  landscape4: resolveByFilename("landscape4.jpg"),
  landscape5: resolveByFilename("landscape5.jpg"),
  research4: resolveByFilename("research4.jpg"),
  research5: resolveByFilename("research5.jpg"),
  research6: resolveByFilename("research6.jpg"),
  research7: resolveByFilename("research7.jpg"),
  research8: resolveByFilename("research8.jpg"),
  research9: resolveByFilename("research9.jpg"),
  research10: resolveByFilename("research10.jpg"),
  research11: resolveByFilename("research11.jpg"),
  research12: resolveByFilename("research12.jpg"),
  research13: resolveByFilename("research13.jpg"),
  research14: resolveByFilename("research14.jpg"),
  research15: resolveByFilename("research15.jpg"),
  research16: resolveByFilename("research16.jpg"),
  research17: resolveByFilename("research17.jpg"),
  research18: resolveByFilename("research18.jpg"),
  research19: resolveByFilename("research19.jpg"),
  research20: resolveByFilename("research20.jpg"),
  research21: resolveByFilename("research21.jpg"),
  research22: resolveByFilename("research22.jpg"),
  research23: resolveByFilename("research23.jpg"),
  research24: resolveByFilename("research24.jpg"),
  research25: resolveByFilename("research25.jpg"),
  research26: resolveByFilename("research26.jpg"),
  cover1: resolveByFilename("cover1.jpg"),
  cover2: resolveByFilename("cover2.jpg"),
  cover3: resolveByFilename("cover3.jpg"),
  cover3_12: resolveByFilename("cover3.12.jpg"),
  cover03_1: resolveByFilename("cover03.1.jpg"),
  cover4: resolveByFilename("cover4.jpg"),
  cover05_1: resolveByFilename("cover05.1.jpg"),
  cover5: resolveByFilename("cover5.jpg"),
  cover6: resolveByFilename("cover6.jpg"),
  cover6_1: resolveByFilename("cover6.1.webp"),
  cover7: resolveByFilename("cover7.webp"),
  cover8: resolveByFilename("cover8.jpg"),
  cover9: resolveByFilename("cover9.jpg"),
  cover10: resolveByFilename("cover10.jpg"),
  cover12: resolveByFilename("cover12.jpg"),
  coverip1: resolveByFilename("coverip1.webp"),
  coverip2_1: resolveByFilename("coverip2.1.jpg"),
  coverip3: resolveByFilename("coverip3.webp"),
  coverip4: resolveByFilename("coverip4.webp"),
  ipDesign13: resolveByFilename("ipdesign-13.webp"),
  ipZheng1: resolveByFilename("ipdesign-zheng1.webp"),
  ipNing1: resolveByFilename("ipdesign-ning1.webp"),
  practice04: resolveByFilename("practice04.jpg"),
  practice05: resolveByFilename("practice05.jpg"),
  practice06: resolveByFilename("practice06.jpg"),
  practice07: resolveByFilename("practice07.jpg"),
  practice08: resolveByFilename("practice08.jpg"),
  practice09: resolveByFilename("practice09.jpg"),
  practice10: resolveByFilename("practice10.jpg"),
  practice11: resolveByFilename("practice11.jpg"),
  practice12: resolveByFilename("practice12.jpg"),
  practice13: resolveByFilename("practice13.jpg"),
  practice14: resolveByFilename("practice14.jpg"),
  practice15: resolveByFilename("practice15.jpg"),
  practice16: resolveByFilename("practice16.jpg"),
  practice17: resolveByFilename("practice17.jpg"),
  practice18: resolveByFilename("practice18.jpg"),
  practice19: resolveByFilename("practice19.jpg"),
  practice20: resolveByFilename("practice20-1.webp"),
  practice21: resolveByFilename("practice21.jpg"),
  practice22: resolveByFilename("practice22.jpg"),
  practice23: resolveByFilename("practice23.jpg"),
  practice24: resolveByFilename("practice24.jpg"),
  practice25: resolveByFilename("practice25.jpg"),
  practice27: resolveByFilename("practice27.jpg"),
  hetao01: resolveByFilename("hetao01.jpg"),
  hetao02: resolveByFilename("hetao02.jpg"),
  hetao04: resolveByFilename("hetao04.jpg"),
  hetao05: resolveByFilename("hetao05.jpg"),
  hetao08: resolveByFilename("hetao08.jpg"),
  hetao10: resolveByFilename("hetao10.jpg"),
  hetao11: resolveByFilename("hetao11.jpg"),
  hetao15: resolveByFilename("hetao15.jpg"),
  hetao16: resolveByFilename("hetao16.jpg"),
  hetao17: resolveByFilename("hetao17.jpg"),

  // Product case new images
  productHeroCover: resolveByFilename("product_Hero_Cover.webp"),
  productPainPointMap: resolveByFilename("product_pain-point-map.webp"),
  productSolutionSystem: resolveByFilename("product_solution-system.webp"),
  cover00: resolveByFilename("cover00.webp"),
  vrExperience2: resolveByFilename("vr-immersive-interface-2.webp"),
  vrUgcDesign: resolveByFilename("VRugcdesign.webp"),
  vrCommunity: resolveByFilename("vr-community-interface.webp"),
  vrPlatformArchitecture: resolveByFilename("vr-platform-architecture.webp"),
  vrHomepage: resolveByFilename("vr-homepage.webp"),
  vrCmp: resolveByFilename("vr-CMP.webp"),
  vrChart: resolveByFilename("vr-chart.webp"),
  london4: resolveByFilename("london4.jpg"),
  london5: resolveByFilename("london5.jpg"),
  london6: resolveByFilename("london6.jpg"),
  london11: resolveByFilename("london11.jpg"),
  london12: resolveByFilename("london12.jpg"),

  // Job Matching AI Agent
  cover01: resolveByFilename("cover01.webp"),
  jobMatching: resolveByFilename("job-matching.webp"),
  aiWorkflowDiagram: resolveByFilename("AI Workflow Diagram.webp"),
  jobmatchingLanggraphWorkflow: resolveByFilename("langgraph-workflow.webp"),
  jobmatchingInterface: resolveByFilename("jobmatching-interface.webp"),
};
