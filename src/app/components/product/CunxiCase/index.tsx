import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { ProjectData } from "../../../projectDetailData";
import { useProjectNavigation } from "../../../../hooks/useProjectNavigation";
import { BackToHomeLink } from "../BackToHomeLink";
import { Lightbox } from "../../ui/Lightbox";
import { cunxiAssets } from "../../../cunxiAssets";
import { CUNXI_CHAPTERS } from "./chapters";
import { ChapterNav } from "./components/ChapterNav";
import { CaseFooterNav } from "./components/CaseFooterNav";
import { BrandHero } from "./sections/01BrandHero";
import { Overview } from "./sections/02Overview";
import { Problem } from "./sections/03Problem";
import { Strategy } from "./sections/04Strategy";
import { CoreExperience } from "./sections/05CoreExperience";
import { CapabilityGap } from "./sections/06CapabilityGap";
import { CareerAssets } from "./sections/07CareerAssets";
import { BrandSystem } from "./sections/08BrandSystem";
import { AiEngineering } from "./sections/09AiEngineering";
import { Reflection } from "./sections/10Reflection";
import "./cunxi-case.css";

interface CunxiCaseProps {
  project: ProjectData;
  id: string;
  allProjectIds: string[];
}

export function CunxiCase({ project, id, allProjectIds }: CunxiCaseProps) {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(CUNXI_CHAPTERS[0].id);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { currentIndex, prevId, nextId } = useProjectNavigation(id, allProjectIds, {
    isDisabled: isLightboxOpen,
  });

  /** 只有真实存在的图片才进入 Lightbox */
  const gallery = useMemo(() => {
    const screens = Object.values(cunxiAssets.screens);
    return [...screens, cunxiAssets.ip.nebula].filter((value): value is string => Boolean(value));
  }, []);

  // 章节高亮
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-32% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] },
    );

    for (const chapter of CUNXI_CHAPTERS) {
      const element = document.getElementById(chapter.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // DEV 断言：章节数量与 DOM 必须一致
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const missing = CUNXI_CHAPTERS.filter((chapter) => !document.getElementById(chapter.id));
    if (missing.length > 0) {
      console.warn(
        `[CunxiCase] 缺少 section: ${missing.map((chapter) => chapter.id).join(", ")}`,
      );
    }
  }, []);

  const navigateToChapter = (chapterId: string) => {
    const element = document.getElementById(chapterId);
    element?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  const openImage = (src: string) => {
    const index = gallery.indexOf(src);
    if (index < 0) return;
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="cunxi-case">
      <BackToHomeLink />
      <ChapterNav activeId={activeId} onNavigate={navigateToChapter} />

      <BrandHero />
      <Overview />
      <Problem />
      <Strategy />
      <CoreExperience onOpenImage={openImage} />
      <CapabilityGap />
      <CareerAssets onOpenImage={openImage} />
      <BrandSystem onOpenImage={openImage} />
      <AiEngineering />
      <Reflection />

      <CaseFooterNav
        project={project}
        prevId={prevId}
        nextId={nextId}
        currentIndex={currentIndex}
        totalCount={allProjectIds.length}
      />

      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={gallery}
        currentIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
        getAlt={(index) => `寸隙 CUNXI 界面 - ${index + 1}`}
      />
    </div>
  );
}
