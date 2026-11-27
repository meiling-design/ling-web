import { Link } from "react-router";
import type { ProjectData } from "../../../../projectDetailData";
import { ProjectMetadata } from "../../ProjectMetadata";

interface CaseFooterNavProps {
  project: ProjectData;
  prevId?: string;
  nextId?: string;
  currentIndex: number;
  totalCount: number;
}

/** 案例页脚：元数据 + 上一项/下一项。props 驱动，不自行监听键盘。 */
export function CaseFooterNav({
  project,
  prevId,
  nextId,
  currentIndex,
  totalCount,
}: CaseFooterNavProps) {
  return (
    <footer className="cunxi-footer">
      <div className="cunxi-shell">
        <ProjectMetadata project={project} hideLocation className="cunxi-footer-meta" />

        <nav className="cunxi-footer-nav" aria-label="项目切换">
          {prevId ? (
            <Link to={`/project/${prevId}`}>← PREV</Link>
          ) : (
            <span className="is-disabled">← PREV</span>
          )}
          <span className="cunxi-footer-counter">
            {currentIndex + 1} / {totalCount}
          </span>
          {nextId ? (
            <Link to={`/project/${nextId}`}>NEXT →</Link>
          ) : (
            <span className="is-disabled">NEXT →</span>
          )}
        </nav>
      </div>
    </footer>
  );
}
