import type { ProjectData } from "../../projectDetailData";

interface ProjectMetadataProps {
  project: ProjectData;
  className?: string;
}

/**
 * 项目元数据网格：年份 / 类别 / 角色 / 地点
 *
 * 用于详情页底部，展示项目的关键元信息。
 * 在 YimoVRProductDetail 和 JobMatchingProductDetail 中共享。
 */
export function ProjectMetadata({ project, className = "" }: ProjectMetadataProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <div className="flex flex-col gap-1">
        <span className="text-[0.65rem] font-bold tracking-widest uppercase text-muted-foreground">年份 / YEAR</span>
        <span className="text-foreground">{project.year}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[0.65rem] font-bold tracking-widest uppercase text-muted-foreground">类别 / CATEGORY</span>
        <span className="text-foreground">{project.category}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[0.65rem] font-bold tracking-widest uppercase text-muted-foreground">角色 / ROLE</span>
        <span className="text-foreground">{project.role}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[0.65rem] font-bold tracking-widest uppercase text-muted-foreground">地点 / SITE</span>
        <span className="text-foreground">{project.location || "—"}</span>
      </div>
    </div>
  );
}
