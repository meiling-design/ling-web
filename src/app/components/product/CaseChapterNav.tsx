import { useState } from "react";
import { List, X } from "lucide-react";

export interface CaseChapter {
  id: string;
  index: string;
  label: string;
  enLabel?: string;
}

interface CaseChapterNavProps {
  chapters: readonly CaseChapter[];
  activeId: string;
  onNavigate: (id: string) => void;
  ariaLabel?: string;
}

/**
 * 案例详情页通用章节导航。
 * 桌面（≥1440px）：左侧固定紧凑目录；窄屏：右下角浮动目录。
 * 颜色由页面级 CSS 变量 --cn-* 决定，寸隙与遗墨各自覆盖。
 */
export function CaseChapterNav({
  chapters,
  activeId,
  onNavigate,
  ariaLabel = "案例章节导航",
}: CaseChapterNavProps) {
  const [open, setOpen] = useState(false);
  const active = chapters.find((chapter) => chapter.id === activeId) ?? chapters[0];

  if (!active) return null;

  const go = (id: string) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <>
      {/* 桌面：左侧固定紧凑目录 */}
      <nav className="case-chapter-nav" aria-label={ariaLabel}>
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            type="button"
            onClick={() => go(chapter.id)}
            className={`case-chapter-item${chapter.id === activeId ? " is-active" : ""}`}
            aria-current={chapter.id === activeId ? "true" : undefined}
          >
            <span>{chapter.index}</span>
            <em>{chapter.label}</em>
          </button>
        ))}
      </nav>

      {/* 窄屏：右下角浮动目录 */}
      <div className="case-nav-mobile">
        {open && (
          <div className="case-nav-panel" role="dialog" aria-label="章节目录">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => go(chapter.id)}
                className={`case-chapter-item${chapter.id === activeId ? " is-active" : ""}`}
              >
                <span>{chapter.index}</span>
                <em>{chapter.label}</em>
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          className="case-nav-trigger"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "关闭章节目录" : "打开章节目录"}
        >
          {open ? <X size={14} /> : <List size={14} />}
          {open ? "关闭" : `${active.index} / ${chapters.length} · 目录`}
        </button>
      </div>
    </>
  );
}
