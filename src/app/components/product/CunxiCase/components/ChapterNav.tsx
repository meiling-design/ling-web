import { useState } from "react";
import { List, X } from "lucide-react";
import { CUNXI_CHAPTERS } from "../chapters";

interface ChapterNavProps {
  activeId: string;
  onNavigate: (id: string) => void;
}

export function ChapterNav({ activeId, onNavigate }: ChapterNavProps) {
  const [open, setOpen] = useState(false);
  const active = CUNXI_CHAPTERS.find((chapter) => chapter.id === activeId) ?? CUNXI_CHAPTERS[0];

  const go = (id: string) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <>
      {/* 桌面：左侧固定紧凑目录 */}
      <nav className="cunxi-chapter-nav" aria-label="寸隙案例章节导航">
        {CUNXI_CHAPTERS.map((chapter) => (
          <button
            key={chapter.id}
            type="button"
            onClick={() => go(chapter.id)}
            className={`cunxi-chapter-item${chapter.id === activeId ? " is-active" : ""}`}
            aria-current={chapter.id === activeId ? "true" : undefined}
          >
            <span>{chapter.index}</span>
            <em>{chapter.label}</em>
          </button>
        ))}
      </nav>

      {/* 窄屏：右下角浮动目录 */}
      <div className="cunxi-mobile-nav">
        {open && (
          <div className="cunxi-mobile-panel" role="dialog" aria-label="章节目录">
            {CUNXI_CHAPTERS.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => go(chapter.id)}
                className={`cunxi-chapter-item${chapter.id === activeId ? " is-active" : ""}`}
              >
                <span>{chapter.index}</span>
                <em>{chapter.label}</em>
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          className="cunxi-mobile-trigger"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "关闭章节目录" : "打开章节目录"}
        >
          {open ? <X size={14} /> : <List size={14} />}
          {open ? "关闭" : `${active.index} / ${CUNXI_CHAPTERS.length} · 目录`}
        </button>
      </div>
    </>
  );
}
