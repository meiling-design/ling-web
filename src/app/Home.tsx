import { motion } from "motion/react";
import { HorizontalSection } from "./components/ui/HorizontalSection";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { projectGroups, getGroupProjects } from "../services/projectService";

export function Home() {
  const { hash } = useLocation();

  const sections = useMemo(
    () => projectGroups.map((group) => ({
      ...group,
      projects: getGroupProjects(group.projectIds),
    })),
    [],
  );

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      let cancelled = false;

      const rafId = requestAnimationFrame(() => {
        if (cancelled) return;
        // setTimeout 兜底确保 motion 动画渲染完成后才滚动
        setTimeout(() => {
          if (cancelled) return;
          const element = document.getElementById(id);
          element?.scrollIntoView({ behavior: "instant", block: "start" });
        }, 100);
      });

      return () => {
        cancelled = true;
        cancelAnimationFrame(rafId);
      };
    }
  }, [hash]);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center container mx-auto px-6 max-w-[1440px] py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <motion.h1 
            whileHover={{ 
              letterSpacing: "0.55em",
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
            }}
            className="text-[3.5rem] md:text-[5rem] font-medium tracking-[0.4em] text-[#1A1A1A] leading-tight select-none cursor-default inline-block origin-left"
          >
            LING.<br />DESIGN
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            whileHover={{ x: 10 }}
            className="text-[1.2rem] md:text-[1.5rem] text-[#666] tracking-[0.2em] font-light transition-all duration-500"
          >
            空间与时间的旅行者
          </motion.p>
        </motion.div>
      </section>

      {/* Grid Sections — 由 projectService 中的 groups 驱动 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {sections.map((group) => (
          <HorizontalSection
            key={group.id}
            id={group.id}
            title={group.title}
            subtitle={group.subtitle}
            projects={group.projects}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-medium tracking-widest text-[#1A1A1A] mb-4">404</h1>
      <p className="text-[#666] mb-8 tracking-widest uppercase text-sm">页面未找到 / PAGE NOT FOUND</p>
      <a href="/" className="px-10 py-4 border border-[#1A1A1A] text-[0.8rem] tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all uppercase">
        返回首页 / BACK HOME
      </a>
    </div>
  );
}
