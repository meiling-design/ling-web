/**
 * 本地图片资源解析 — 通过 Vite glob 批量导入 assets 目录
 * 拆分为独立文件，方便 Cloudinary 层在上层叠加
 */

const images = import.meta.glob<{ default: string }>(
  "../assets/*.{jpg,png,jpeg,webp}",
  { eager: true, query: "?url", import: "default" },
);

/** 根据文件名（含扩展名）返回构建后的本地 URL */
export function local(filename: string): string {
  const key = `../assets/${filename}`;
  return (images as unknown as Record<string, string>)[key] ?? "";
}
