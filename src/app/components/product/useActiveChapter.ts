import { useEffect, useState } from "react";
import type { CaseChapter } from "./CaseChapterNav";

/**
 * 滚动到章节锚点。
 * 长页面里图片懒加载会在滚动途中改变布局，一次 smooth 滚动常常停在目标之前，
 * 因此滚动结束后做几次位置校正（最多 4 次，直接定位，不再平滑）。
 */
export function scrollToCaseChapter(chapterId: string, reduceMotion: boolean) {
  const element = document.getElementById(chapterId);
  if (!element) return;

  const offset = 96;
  const targetY = () => Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset);

  let attempts = 0;
  const step = () => {
    const y = targetY();
    if (Math.abs(y - window.scrollY) <= 4 || attempts > 4) return;
    window.scrollTo({
      top: y,
      behavior: reduceMotion ? "auto" : "smooth",
    });
    attempts += 1;
    window.setTimeout(step, 700);
  };

  step();
}

/**
 * 跟踪当前章节：取「顶部已经越过视口上沿」的最后一章。
 * 相比 IntersectionObserver，这个判定对矮锚点（只有章节标题）也成立，
 * 遗墨的折叠章节与寸隙的整段 section 都能正确高亮。
 */
export function useActiveChapter(chapters: readonly CaseChapter[]) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const probe = 140;
      let current = chapters[0]?.id ?? "";

      for (const chapter of chapters) {
        const element = document.getElementById(chapter.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= probe) current = chapter.id;
      }

      // 滚动到底部时高亮最后一章
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = chapters[chapters.length - 1]?.id ?? current;

      setActiveId(current);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // 章节折叠 / 展开或图片加载改变高度时，重新计算
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resizeObserver.disconnect();
    };
  }, [chapters]);

  return activeId;
}
