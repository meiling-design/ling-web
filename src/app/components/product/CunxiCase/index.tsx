import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { ProjectData } from "../../../projectDetailData";
import { useProjectNavigation } from "../../../../hooks/useProjectNavigation";
import { BackToHomeLink } from "../BackToHomeLink";
import { Lightbox } from "../../ui/Lightbox";
import { cunxiAssets } from "../../../cunxiAssets";
import { CUNXI_CHAPTERS } from "./chapters";
import { CaseChapterNav } from "../CaseChapterNav";
import { scrollToCaseChapter, useActiveChapter } from "../useActiveChapter";
import { CaseFooterNav } from "./components/CaseFooterNav";
import { BrandHero } from "./sections/01BrandHero";
import { Overview } from "./sections/02Overview";
import { Problem } from "./sections/03Problem";
import { UserResearch } from "./sections/04UserResearch";
import { Strategy } from "./sections/05Strategy";
import { CoreExperience } from "./sections/06CoreExperience";
import { CapabilityGap } from "./sections/07CapabilityGap";
import { CareerAssets } from "./sections/08CareerAssets";
import { BrandSystem } from "./sections/09BrandSystem";
import { AiEngineering } from "./sections/10AiEngineering";
import { Reflection } from "./sections/11Reflection";
import "./cunxi-case.css";

interface CunxiCaseProps {
  project: ProjectData;
  id: string;
  allProjectIds: string[];
}

export function CunxiCase({ project, id, allProjectIds }: CunxiCaseProps) {
  const reduce = useReducedMotion();
  const activeId = useActiveChapter(CUNXI_CHAPTERS);
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
    scrollToCaseChapter(chapterId, Boolean(reduce));
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
      <CaseChapterNav
        chapters={CUNXI_CHAPTERS}
        activeId={activeId}
        onNavigate={navigateToChapter}
        ariaLabel="寸隙案例章节导航"
      />

      <BrandHero />
      <Overview />
      <Problem />
      <UserResearch />
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
