/**
 * Careerly —— AI Career Growth 产品详情页（Scroll Story）
 *
 * 前身是 JobInsight AI（AI Job Matching Tool），本次重构为职业成长产品叙事：
 * 不变的是「同一份简历 × 目标岗位 × 能力」的底层逻辑，
 * 变的是产品要回答的问题 —— 从「我配得上哪个岗位」到「我正在成为什么样的人」。
 *
 * 与遗墨保持统一设计语言：
 * 单页纵向滚动 · 一屏一核心信息 · 大标题 + 大留白 + 大图
 * 滚动触发动画 · 浅色背景（米白）+ 科技蓝点缀
 * 产品思考先于技术实现
 */

import type { ReactNode } from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { ProjectData } from "../../projectDetailData";
import { BackToHomeLink, ProjectMetadata } from "./index";
import { LiveDemo } from "./LiveDemo";

/* ================================================================
   Types
   ================================================================ */

interface ScreenWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** 最小高度，默认 100vh */
  minH?: string;
}

interface SectionTitleProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

interface AnimatedCardProps {
  icon?: string;
  title: string;
  desc?: string;
  delay?: number;
  className?: string;
  children?: ReactNode;
  /** 内边距 Tailwind 类，默认 p-6。用 prop 而非 className 覆盖，同属性工具类谁生效取决于样式表顺序 */
  padding?: string;
}

/* ================================================================
   Shared Helpers
   ================================================================ */

function ScreenWrapper({ children, id, className = "", minH = "100vh" }: ScreenWrapperProps) {
  return (
    <section
      id={id}
      className={`ji-screen ${className}`}
      style={{ minHeight: minH }}
    >
      <div className="max-w-6xl mx-auto w-full py-20 md:py-28">
        {children}
      </div>
    </section>
  );
}

function SectionTitle({ label, title, subtitle, align = "left" }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : ""}`}
    >
      <span className="text-[0.6rem] font-bold text-[var(--ji-muted)] uppercase tracking-[0.3em]">
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--ji-text)] mt-4 leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-[var(--ji-muted)] mt-4 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function AnimatedCard({ icon, title, desc, delay = 0, className = "", children, padding = "p-6" }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`rounded-xl border border-black/5 bg-white ${padding} shadow-sm ${className}`}
    >
      {icon && <span className="text-2xl block mb-3">{icon}</span>}
      <h3 className="text-base font-semibold text-[var(--ji-text)] mb-2">{title}</h3>
      {desc && <p className="text-sm text-[var(--ji-muted)] leading-relaxed">{desc}</p>}
      {children}
    </motion.div>
  );
}

function ArrowIcon() {
  return (
    <div className="ji-arrow">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div className="ji-scroll-indicator">
      <span className="text-[0.5rem] font-bold text-[var(--ji-muted)] uppercase tracking-[0.2em]">Scroll</span>
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--ji-muted)]">
        <rect x="1" y="1" width="14" height="22" rx="7" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}

/* ---------- 手机外框（纯 Tailwind，零 CSS 改动） ----------
 * 屏内列表复用 .ji-mockup-step / .ji-mockup-icon —— 这两个类无定位、无固定宽度、
 * 不依赖父选择器，可安全脱离 .ji-mockup 使用。
 */
function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative w-[248px] shrink-0 ${className}`}>
      {/* 机身 */}
      <div className="relative rounded-[2.25rem] bg-[#1c1c1c] p-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
        {/* 侧键 */}
        <span className="absolute -left-[1px] top-24 h-10 w-[3px] rounded-l-full bg-[#0f0f0f]" />
        <span className="absolute -right-[1px] top-28 h-14 w-[3px] rounded-r-full bg-[#0f0f0f]" />
        {/* 屏幕 */}
        <div className="relative flex h-[496px] flex-col overflow-hidden rounded-[1.9rem] bg-white">
          {/* 灵动岛 */}
          <div className="absolute left-1/2 top-[10px] z-20 h-[18px] w-[74px] -translate-x-1/2 rounded-full bg-[#1c1c1c]" />
          {/* 状态栏 */}
          <div className="flex items-center justify-between px-5 pb-2 pt-[22px] text-[0.55rem] font-semibold text-[var(--ji-text)]">
            <span>9:41</span>
            <span className="text-[0.5rem] text-[var(--ji-muted)]">5G ▮</span>
          </div>
          {/* 内容区 */}
          <div className="flex min-h-0 flex-1 flex-col px-3 pb-1">{children}</div>
          {/* Home indicator */}
          <div className="flex justify-center pb-2 pt-1">
            <span className="h-[3px] w-24 rounded-full bg-black/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 进度条 ---------- */
function ProgressBar({ totalSections }: { totalSections: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="ji-progress-bar"
      style={{ width: `${progress * 100}%` }}
    />
  );
}

/* ---------- 侧边导航 ---------- */
function SideNav({ activeIndex, totalScreens, onNav }: {
  activeIndex: number;
  totalScreens: number;
  onNav: (i: number) => void;
}) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3">
      {Array.from({ length: totalScreens }).map((_, i) => (
        <button
          key={i}
          onClick={() => onNav(i)}
          className={`ji-nav-dot ${i === activeIndex ? "active" : ""}`}
          aria-label={`Go to screen ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ================================================================
   Screen 01 · Hero
   ================================================================ */
function HeroSection({ project }: { project: ProjectData }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const mockupSteps = [
    { icon: "📄", label: "简历", desc: "Resume" },
    { icon: "🧬", label: "能力", desc: "Capability" },
    { icon: "🎯", label: "岗位", desc: "Job" },
    { icon: "📐", label: "距离", desc: "Distance" },
    { icon: "📈", label: "成长", desc: "Growth" },
  ];

  return (
    <section
      ref={ref}
      className="ji-screen min-h-screen"
    >
      <div className="max-w-6xl mx-auto w-full py-16 md:py-20 flex flex-col md:flex-row items-center gap-12 md:gap-16">
        {/* 左侧文字 */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 space-y-6"
        >
          <span className="text-[0.6rem] font-bold text-[var(--ji-muted)] uppercase tracking-[0.3em]">
            0→1 · Web Prototype → Mobile Product
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--ji-text)] leading-tight tracking-tight">
            Careerly
          </h1>
          <p className="text-lg md:text-xl font-medium text-[var(--ji-blue)] tracking-wide">
            AI Career Growth Companion
          </p>
          <p className="text-base md:text-lg text-[var(--ji-muted)] leading-relaxed max-w-xl">
            看见能力 · 跨越 Gap · 记录成长。把简历、项目与技能转化为可理解的能力画像，看见与目标岗位的真实距离，并在每一次更新中记录成长。
          </p>

          {/* 流程图 Mockup 动画 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden md:block"
          >
            <div className="flex items-center gap-2 flex-wrap">
              {mockupSteps.map((step, i) => (
                <span key={step.label} className="inline-flex items-center gap-1.5">
                  <span className="ji-mockup-step rounded-lg px-3 py-1.5 text-[0.7rem] font-medium bg-white/70 border border-black/5">
                    <span>{step.icon}</span>
                    <span className="text-[var(--ji-text)]">{step.desc}</span>
                  </span>
                  {i < mockupSteps.length - 1 && (
                    <span className="text-[var(--ji-muted)] text-xs">→</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 元数据 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <div>
              <span className="text-[0.5rem] font-bold text-[var(--ji-muted)] uppercase tracking-widest block">Role</span>
              <span className="text-sm text-[var(--ji-text)]">{project.role}</span>
            </div>
            <div>
              <span className="text-[0.5rem] font-bold text-[var(--ji-muted)] uppercase tracking-widest block">Year</span>
              <span className="text-sm text-[var(--ji-text)]">{project.year}</span>
            </div>
            <div>
              <span className="text-[0.5rem] font-bold text-[var(--ji-muted)] uppercase tracking-widest block">Stack</span>
              <span className="text-sm text-[var(--ji-text)]">Flutter · FastAPI · LangGraph · LLM</span>
            </div>
          </motion.div>
        </motion.div>

        {/* 右侧产品 Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="flex-1 w-full max-w-lg"
        >
          <div className="ji-mockup">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-black/5 bg-white/50">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-[0.55rem] text-[var(--ji-muted)] ml-2 font-mono">careerly.app — Dashboard</span>
            </div>
            {/* Steps */}
            {mockupSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
                className="ji-mockup-step"
              >
                <span className="ji-mockup-icon">{step.icon}</span>
                <span className="text-sm text-[var(--ji-text)]">{step.desc}</span>
                {i < mockupSteps.length - 1 && (
                  <span className="ml-auto text-[0.55rem] text-[var(--ji-muted)]">↓</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

/* ================================================================
   Screen 03 · From JobInsight AI → Careerly
   ================================================================ */
function ReframeSection() {
  const before = {
    name: "JobInsight AI",
    tagline: "AI Job Matching",
    items: ["分数 · 一个匹配度数字", "排序 · 把岗位排成一列", "单次 · 一次查询就结束"],
  };
  const after = {
    name: "Careerly",
    tagline: "AI Career Growth",
    items: ["能力 · 简历被拆成能力项", "Gap · 距离被逐项指出来", "变化 · 版本之间可以对比"],
  };

  return (
    <ScreenWrapper id="reframe" minH="100vh">
      <SectionTitle
        label="Reframing"
        title="同一个模型，问了一个不同的问题。"
        subtitle="技术没有换，换的是它要回答什么。"
        align="center"
      />

      <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-stretch justify-center gap-6 md:gap-4">
        {/* Before */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 rounded-2xl border border-black/5 bg-white p-7 shadow-sm"
        >
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-[var(--ji-muted)]">
            Before
          </span>
          <h3 className="mt-3 text-xl font-semibold text-[var(--ji-muted)]">{before.name}</h3>
          <p className="mt-1 text-[0.7rem] font-medium text-[var(--ji-muted)]">{before.tagline}</p>
          <ul className="mt-6 space-y-3">
            {before.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-[var(--ji-muted)]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-black/20" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Rethink 枢纽 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex shrink-0 flex-row md:flex-col items-center justify-center gap-3"
        >
          <span className="hidden md:block">
            <ArrowIcon />
          </span>
          <span className="rounded-full border border-[var(--ji-blue-mid)] bg-[var(--ji-blue-light)] px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--ji-blue)]">
            Rethink
          </span>
          <span className="max-w-[150px] text-[0.6rem] leading-relaxed text-[var(--ji-muted)] md:text-center">
            问题变了，产品才跟着变
          </span>
          <span className="md:hidden">
            <ArrowIcon />
          </span>
        </motion.div>

        {/* After */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          className="flex-1 rounded-2xl border border-[var(--ji-blue-mid)] bg-[var(--ji-blue-light)] p-7"
        >
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-[var(--ji-blue)]">
            After
          </span>
          <h3 className="mt-3 text-xl font-semibold text-[var(--ji-text)]">{after.name}</h3>
          <p className="mt-1 text-[0.7rem] font-medium text-[var(--ji-blue)]">{after.tagline}</p>
          <ul className="mt-6 space-y-3">
            {after.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-[var(--ji-text)]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ji-blue)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* 收束 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="ji-layer mt-12 text-center"
      >
        <span className="ji-layer-label">Rethink</span>
        <h3 className="ji-layer-title">从「这个岗位适合我吗」，到「我正在成为什么样的人」。</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ji-muted)]">
          同一份简历，本来就可以回答不止一个问题。
        </p>
      </motion.div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 04 · The Question
   ================================================================ */
function QuestionSection() {
  const hypotheses = [
    {
      icon: "📡",
      title: "更多岗位",
      desc: "把「看得更多」当成答案。\n但岗位再多，也只是把选择的压力推回给用户。",
    },
    {
      icon: "⏱️",
      title: "更快筛选",
      desc: "把「筛得更快」当成答案。\n但更快地拿到结果，不等于更懂这个结果。",
    },
    {
      icon: "🎯",
      title: "更准推荐",
      desc: "把「推得更准」当成答案。\n但一个更准的分数，依然回答不了「我差在哪」。",
    },
  ];

  return (
    <ScreenWrapper id="question" minH="80vh">
      <SectionTitle
        label="The Question"
        title="我们真的缺少一个更好的岗位搜索工具吗？"
        subtitle="搜索、筛选、推荐——过去十年，岗位侧的工具已经足够多了。"
        align="center"
      />

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {hypotheses.map((p, i) => (
          <AnimatedCard key={p.title} icon={p.icon} title={p.title} desc={p.desc} delay={i * 0.12} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center mt-12"
      >
        <span className="inline-block px-6 py-3 rounded-full bg-[var(--ji-blue-light)] border border-[var(--ji-blue-mid)] text-sm font-medium text-[var(--ji-blue)]">
          用户真正缺少的，<br/>是看见自己能力变化的方式。
        </span>
      </motion.div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 05 · Insight
   ================================================================ */
function InsightSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const questions = [
    {
      en: "Why?",
      zh: "为什么是 82%",
      desc: "这个分数由哪些能力项决定？哪一项贡献最大，哪一项拖了后腿？",
    },
    {
      en: "What's missing?",
      zh: "差的是什么",
      desc: "差的那部分具体是技能、项目，还是经历的深度？它需要被逐项指出来。",
    },
    {
      en: "What changed?",
      zh: "有什么变化",
      desc: "相比上一版简历，同一个岗位的匹配是变好了还是变差了？变化了多少？",
    },
  ];

  return (
    <ScreenWrapper id="insight" minH="85vh">
      <SectionTitle
        label="Insight"
        title="Match Score is not the answer."
        subtitle="一个分数只能说明「够不够」，说明不了「为什么」。"
      />

      <div ref={ref} className="grid md:grid-cols-5 gap-8 md:gap-12 mt-8">
        {/* 左：分数卡 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="md:col-span-2 rounded-2xl border border-black/5 bg-white p-8 shadow-sm flex flex-col justify-center"
        >
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-[var(--ji-muted)]">
            Match Score
          </span>
          <p className="mt-4 text-6xl md:text-7xl font-bold text-[var(--ji-text)] leading-none">
            82<span className="text-3xl md:text-4xl align-top">%</span>
          </p>
          <p className="mt-4 text-sm text-[var(--ji-muted)] leading-relaxed">
            分数告诉你「够不够」，然后就没有然后了。
          </p>
          <div className="mt-6 pt-4 border-t border-black/5">
            <span className="text-sm text-[var(--ji-muted)]">一个结论，到此为止。</span>
          </div>
        </motion.div>

        {/* 右：分数回答不了的三个问题 */}
        <div className="md:col-span-3 space-y-4">
          {questions.map((q, i) => (
            <motion.div
              key={q.en}
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="flex items-start gap-4 rounded-2xl border border-[var(--ji-blue-mid)] bg-[var(--ji-blue-light)] p-5"
            >
              <span className="w-7 h-7 shrink-0 rounded-full bg-[var(--ji-blue)] text-white flex items-center justify-center text-[0.65rem] font-bold mt-0.5">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-[var(--ji-blue)]">
                  {q.en}
                  <span className="ml-2 text-sm font-medium text-[var(--ji-text)]">{q.zh}</span>
                </h3>
                <p className="mt-1.5 text-sm text-[var(--ji-muted)] leading-relaxed">{q.desc}</p>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="pt-2 text-sm font-medium text-[var(--ji-text)]"
          >
            一个分数回答不了这三个问题。
            <span className="text-[var(--ji-blue)]">Careerly 要回答的是这三个。</span>
          </motion.div>
        </div>
      </div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 06 · Product Strategy — 成长闭环
   ================================================================ */
function ProductStrategySection() {
  const flow = [
    { icon: "👁️", label: "See\n看见当前匹配" },
    { icon: "🧭", label: "Understand\n理解差距构成" },
    { icon: "🎯", label: "Act\n针对 Gap 行动" },
    { icon: "📝", label: "Record\n记录变化" },
    { icon: "🔁", label: "See Again\n再次看见" },
  ];

  return (
    <ScreenWrapper id="strategy" minH="100vh">
      <SectionTitle
        label="Product Strategy"
        title="产品要解决的不是「选哪个」，而是「怎么变好」。"
        subtitle="把一次性的匹配，变成一条持续的成长闭环。"
        align="center"
      />

      {/* Flow diagram - horizontal on desktop, vertical on mobile */}
      <div className="mt-8 hidden md:flex items-center justify-center gap-0">
        {flow.map((step, i) => (
          <span key={step.label} className="inline-flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center gap-2 px-3 py-4 min-w-[90px]"
            >
              <span className="w-12 h-12 rounded-xl bg-white border border-black/5 shadow-sm flex items-center justify-center text-xl">
                {step.icon}
              </span>
              <span className="text-[0.55rem] font-medium text-[var(--ji-text)] text-center whitespace-pre-line leading-tight">
                {step.label}
              </span>
            </motion.div>
            {i < flow.length - 1 && <ArrowIcon />}
          </span>
        ))}
      </div>

      {/* Mobile: stacked */}
      <div className="mt-8 md:hidden space-y-3">
        {flow.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-black/5"
          >
            <span className="w-10 h-10 rounded-lg bg-[var(--ji-blue-light)] flex items-center justify-center text-lg">
              {step.icon}
            </span>
            <span className="text-sm font-medium text-[var(--ji-text)] whitespace-pre-line">{step.label}</span>
            {i < flow.length - 1 && <span className="ml-auto text-[var(--ji-muted)]">↓</span>}
          </motion.div>
        ))}
      </div>

      {/* 闭环说明 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center mt-12"
      >
        <span className="inline-block px-6 py-3 rounded-full bg-[var(--ji-blue-light)] border border-[var(--ji-blue-mid)] text-sm font-medium text-[var(--ji-blue)]">
          这是一条闭环——<br/>每一次 Record，都会让下一次 See 更准确。
        </span>
      </motion.div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 07 · Core Experience — 两个「看见」
   ================================================================ */

/** 手机屏内的匹配行：标签 + 百分比 + 迷你条 */
function PhoneMatchRow({ icon, label, percent }: { icon: string; label: string; percent: number }) {
  return (
    <div className="ji-mockup-step" style={{ padding: "9px 10px", gap: "8px" }}>
      <span className="ji-mockup-icon" style={{ width: 24, height: 24, fontSize: 11 }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[0.7rem] font-medium text-[var(--ji-text)]">{label}</span>
          <span className="text-[0.7rem] font-bold text-[var(--ji-blue)]">{percent}%</span>
        </div>
        <div className="mt-1.5 h-[4px] overflow-hidden rounded-full" style={{ background: "#e8e4dc" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${percent}%`, background: "linear-gradient(90deg, var(--ji-blue), #6c8cff)" }}
          />
        </div>
      </div>
    </div>
  );
}

function CoreExperienceSection() {
  const current = [
    { icon: "💼", label: "AI 产品经理", percent: 82 },
    { icon: "📊", label: "数据产品经理", percent: 64 },
    { icon: "📈", label: "增长产品经理", percent: 48 },
  ];
  const growth = [
    { icon: "📄", label: "Resume v1", percent: 48 },
    { icon: "📄", label: "Resume v2", percent: 65 },
    { icon: "📄", label: "Resume v3", percent: 82 },
  ];

  return (
    <ScreenWrapper id="core-experience" minH="110vh">
      <SectionTitle
        label="Core Experience"
        title="产品只做两件事：看见现在，看见变化。"
        subtitle="一个是横向的比较，一个是纵向的比较。"
        align="center"
      />

      <div className="mt-8 flex flex-col items-center justify-center gap-14 md:flex-row md:items-start md:gap-16">
        {/* 01 · See */}
        <div className="flex flex-col items-center gap-5">
          <PhoneFrame>
            <div className="px-1 pb-3 pt-1">
              <span className="text-[0.5rem] font-bold uppercase tracking-[0.2em] text-[var(--ji-muted)]">
                01 · See
              </span>
              <h4 className="mt-1 text-[0.85rem] font-semibold text-[var(--ji-text)]">看见当前匹配</h4>
              <p className="mt-0.5 text-[0.58rem] text-[var(--ji-muted)]">Resume × Multiple Jobs</p>
            </div>
            <div className="mt-1">
              {current.map((row) => (
                <PhoneMatchRow key={row.label} {...row} />
              ))}
            </div>
          </PhoneFrame>
          <p className="max-w-[248px] text-center text-xs leading-relaxed text-[var(--ji-muted)]">
            同一份简历，对着多个目标岗位，逐个看清距离。
          </p>
        </div>

        {/* 02 · See Again */}
        <div className="flex flex-col items-center gap-5">
          <PhoneFrame>
            <div className="px-1 pb-3 pt-1">
              <span className="text-[0.5rem] font-bold uppercase tracking-[0.2em] text-[var(--ji-blue)]">
                02 · See Again
              </span>
              <h4 className="mt-1 text-[0.85rem] font-semibold text-[var(--ji-text)]">看见成长变化</h4>
              <p className="mt-0.5 text-[0.58rem] text-[var(--ji-muted)]">
                Resume Version × Historical Jobs
              </p>
            </div>
            <div className="mt-1">
              {growth.map((row) => (
                <PhoneMatchRow key={row.label} {...row} />
              ))}
            </div>
          </PhoneFrame>
          <p className="max-w-[248px] text-center text-xs leading-relaxed text-[var(--ji-muted)]">
            同一个目标岗位，对着不同时期的简历，看见自己走了多远。
          </p>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[var(--ji-muted)]"
      >
        界面示意 · UI mockup
      </motion.p>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 08 · Career Gap — Show the distance, not the score
   ================================================================ */
function CareerGapSection() {
  const tiers = [
    {
      no: "01",
      name: "Strength",
      zh: "已具备",
      width: 100,
      fill: "linear-gradient(90deg, var(--ji-blue), #6c8cff)",
      badgeBg: "rgba(45,91,255,0.08)",
      badgeColor: "var(--ji-blue)",
      badge: "能主张",
      next: "可以直接写进简历与作品集，作为下一步的凭据。",
    },
    {
      no: "02",
      name: "Partial",
      zh: "部分具备",
      width: 55,
      fill: "linear-gradient(90deg, #d9a441, #e8c37a)",
      badgeBg: "rgba(217,164,65,0.12)",
      badgeColor: "#9a7420",
      badge: "要补产出",
      next: "还差一层可展示的产出，需要把它落到一个具体项目里。",
    },
    {
      no: "03",
      name: "Gap",
      zh: "尚未具备",
      width: 20,
      fill: "linear-gradient(90deg, #a89f92, #c9c2b6)",
      badgeBg: "rgba(168,159,146,0.14)",
      badgeColor: "#7d766b",
      badge: "要建证据",
      next: "还没有可以证明的经历，需要先找到入口去积累。",
    },
  ];

  return (
    <ScreenWrapper id="career-gap" minH="120vh">
      <SectionTitle
        label="Career Gap"
        title="Don't just show the score. Show the distance."
        subtitle="分数告诉你够不够，距离告诉你往哪走。"
      />

      {/* ① 分数 vs 距离 */}
      <div className="flex flex-col gap-4 md:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex-1 rounded-2xl border border-black/5 bg-white p-7 shadow-sm"
        >
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-[var(--ji-muted)]">
            What a score tells you
          </span>
          <p className="mt-4 text-5xl font-semibold tracking-tight text-[var(--ji-muted)]">82%</p>
          <p className="mt-3 text-sm text-[var(--ji-muted)]">你在哪</p>
          <p className="mt-1 text-xs text-[var(--ji-muted)]">一个结论，到此为止。</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="flex-1 rounded-2xl border border-[var(--ji-blue-mid)] bg-[var(--ji-blue)] p-7"
        >
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-white/70">
            What a distance tells you
          </span>
          <p className="mt-4 text-5xl font-semibold tracking-tight text-white">−45%</p>
          <p className="mt-3 text-sm text-white/90">往哪走</p>
          <p className="mt-1 text-xs text-white/70">一个动作，可以开始。</p>
        </motion.div>
      </div>

      {/* ② 三档距离 */}
      <div className="mt-6 space-y-3">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="ji-rank-item"
          >
            <span className={`ji-rank-number${i === 0 ? " top" : ""}`}>{tier.no}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[var(--ji-text)]">{tier.name}</span>
                <span className="text-[0.7rem] text-[var(--ji-muted)]">{tier.zh}</span>
                <span
                  className="ji-rank-score ml-auto"
                  style={{ background: tier.badgeBg, color: tier.badgeColor }}
                >
                  {tier.badge}
                </span>
              </div>
              <div className="ji-weight-bar mt-2" style={{ height: 6, cursor: "default" }}>
                <div className="ji-weight-fill" style={{ width: `${tier.width}%`, background: tier.fill }} />
              </div>
              <p className="mt-2 text-[0.7rem] leading-relaxed text-[var(--ji-muted)]">{tier.next}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ③ 收束 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-12 text-center"
      >
        <span className="inline-block rounded-full border border-[var(--ji-blue-mid)] bg-[var(--ji-blue-light)] px-6 py-3 text-sm font-medium text-[var(--ji-blue)]">
          分数是结论，距离是动作。<br />
          知道还差什么，才知道下一步做什么。
        </span>
      </motion.div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 09 · Career Asset — Your career is an asset
   ================================================================ */
function CareerAssetSection() {
  const assets = [
    {
      icon: "💼",
      title: "Work 工作经历",
      fields: ["公司", "角色", "时间", "职责", "成果"],
    },
    {
      icon: "🧩",
      title: "Projects 项目",
      fields: ["项目名", "你的角色", "调用能力", "产出物", "链接"],
    },
    {
      icon: "🧠",
      title: "Skills 技能",
      fields: ["技能", "熟练度", "证据"],
    },
    {
      icon: "🏆",
      title: "Awards 奖项",
      fields: ["奖项", "级别", "时间", "关联作品"],
    },
    {
      icon: "📄",
      title: "Resumes 简历版本",
      fields: ["版本", "时间", "变更点", "对应匹配"],
    },
  ];

  return (
    <ScreenWrapper id="career-asset" minH="110vh">
      <SectionTitle
        label="Career Asset"
        title="简历是快照，职业资产是可累积的记录。"
        subtitle="把散在简历、作品集和记忆里的东西，拆成结构化的、能反复使用的字段。"
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {assets.map((asset, i) => (
          <AnimatedCard
            key={asset.title}
            icon={asset.icon}
            title={asset.title}
            delay={i * 0.07}
            padding="p-5"
          >
            {/* .ji-layer-items 自带 margin-top，Tailwind 覆盖不掉 → 内联 */}
            <div className="ji-layer-items" style={{ marginTop: 0 }}>
              {asset.fields.map((field) => (
                <span key={field} className="ji-layer-item">
                  {field}
                </span>
              ))}
            </div>
          </AnimatedCard>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="ji-layer mt-12 text-center"
      >
        <span className="ji-layer-label">Career Asset</span>
        <h3 className="ji-layer-title">Your career is an asset.</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ji-muted)]">
          每一次更新都留在档案里——上一版的你，是这一版的起点。
        </p>
      </motion.div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 11 · Product Architecture — AI behind the experience
   ================================================================ */
function ProductArchitectureSection() {
  const layers = [
    {
      label: "Experience",
      title: "体验层 · 用户看见什么",
      items: ["看见当前匹配", "看见能力距离", "看见成长变化", "职业资产库"],
      color: "border-l-[var(--ji-blue)]",
    },
    {
      label: "Product Logic",
      title: "产品逻辑层 · 产品如何组织",
      items: ["能力模型", "岗位要求拆解", "距离定义", "版本化记录"],
      color: "border-l-blue-400",
    },
    {
      label: "AI Agent",
      title: "Agent 层 · AI 如何协作",
      items: ["简历解析 Agent", "能力抽取 Agent", "岗位理解 Agent", "Gap 分析 Agent"],
      color: "border-l-blue-500",
    },
    {
      label: "Reasoning",
      title: "推理层 · 判断如何产生",
      items: ["结构化能力图谱", "Embedding 语义对齐", "LLM 打分与解释"],
      color: "border-l-blue-600",
    },
    {
      label: "Data",
      title: "数据层 · 输入从哪里来",
      items: ["简历导入", "手动粘贴 JD", "作品与经历补充"],
      color: "border-l-gray-400",
    },
  ];

  return (
    <ScreenWrapper id="architecture" minH="120vh">
      <SectionTitle
        label="Product Architecture"
        title="AI behind the experience."
        subtitle="用户只看见三件事：我在哪、还差什么、我走了多远。背后是四层系统在承担复杂度。"
      />

      <div className="space-y-3 mt-8">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`ji-layer border-l-4 ${layer.color}`}
          >
            <span className="ji-layer-label">{layer.label}</span>
            <h3 className="ji-layer-title">{layer.title}</h3>
            <div className="ji-layer-items">
              {layer.items.map((item) => (
                <span key={item} className="ji-layer-item">{item}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 层间箭头：方向与行的视觉顺序相反 —— 复杂度从下长上来，用户只看见最上面一层 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="flex justify-center mt-6 text-[var(--ji-muted)]"
      >
        <div className="flex flex-wrap items-center justify-center gap-4 text-[0.6rem] font-medium uppercase tracking-wider">
          {["Data", "Reasoning", "Agent", "Product Logic", "Experience"].map((name, i, arr) => (
            <span key={name} className="inline-flex items-center gap-4">
              <span>{name}</span>
              {i < arr.length - 1 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              )}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
        className="text-center text-sm text-[var(--ji-muted)] mt-8"
      >
        AI 不替用户做职业决定——它把「为什么」讲清楚，决定权仍在用户手里。
      </motion.p>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 10 · AI Workflow (LangGraph)
   ================================================================ */
function WorkflowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const nodes = [
    { icon: "📄", label: "Resume", desc: "简历导入" },
    { icon: "🔧", label: "Parse", desc: "解析结构与段落" },
    { icon: "🧹", label: "Normalize", desc: "统一字段与格式" },
    { icon: "🧬", label: "Capability Extraction", desc: "抽取结构化能力项" },
    { icon: "🎯", label: "Job Understanding", desc: "拆解岗位要求" },
    { icon: "🔀", label: "Matching", desc: "能力与要求对齐" },
    { icon: "📐", label: "Gap Analysis", desc: "计算逐项距离" },
    { icon: "📝", label: "Report", desc: "输出可理解的能力报告" },
  ];

  return (
    <ScreenWrapper id="workflow" minH="120vh">
      <SectionTitle
        label="AI Workflow"
        title="从一份简历，到一份可理解的能力报告。"
        subtitle="不是把简历丢给一个大模型——每一步都有明确的输入、输出与状态。"
      />

      <div ref={ref} className="mt-8 max-w-2xl mx-auto">
        <div className="ji-node-flow">
          {nodes.map((node, i) => {
            // Calculate normalized progress for each node
            const nodeStart = i / nodes.length;
            const nodeEnd = (i + 1) / nodes.length;

            return (
              <motion.div
                key={node.label}
                className="ji-node-row"
                style={{
                  opacity: useTransform(scrollYProgress, [nodeStart, nodeEnd], [0.3, 1]),
                }}
              >
                {/* Connector line */}
                {i > 0 && (
                  <motion.div
                    className="ji-node-connector"
                    style={{
                      background: useTransform(
                        scrollYProgress,
                        [nodeStart, nodeEnd],
                        ["#ddd", "var(--ji-blue)"]
                      ),
                    }}
                  />
                )}
                <div className="flex items-center gap-4 w-full">
                  <motion.div
                    className="ji-node-dot"
                    style={{
                      borderColor: useTransform(
                        scrollYProgress,
                        [nodeStart, nodeEnd],
                        ["#ddd", "var(--ji-blue)"]
                      ),
                      backgroundColor: useTransform(
                        scrollYProgress,
                        [nodeStart, nodeEnd],
                        ["white", "var(--ji-blue)"]
                      ),
                    }}
                  >
                    {i + 1}
                  </motion.div>
                  <motion.div
                    style={{
                      opacity: useTransform(scrollYProgress, [nodeStart, nodeEnd], [0.4, 1]),
                    }}
                  >
                    <div className="ji-node-label flex items-center gap-2">
                      <span className="text-lg">{node.icon}</span>
                      <span>{node.label}</span>
                    </div>
                    <div className="ji-node-desc">→ {node.desc}</div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-[var(--ji-muted)] mt-10"
      >
        每一步都可观察、可恢复、可优化。同一条 Workflow，既服务于当前匹配，也服务于成长记录。
      </motion.p>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 02 · Live Demo — 在线体验能力匹配
   ================================================================ */
function LiveDemoSection() {
  return (
    <ScreenWrapper id="experience" minH="100vh">
      <SectionTitle
        label="Live Demo"
        title="输入简历与目标岗位，体验一次能力匹配。"
        subtitle="前后端真实调用 · 后端基于 FastAPI + LangGraph 构建，部署后实时返回能力匹配结果。"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        {/* 说明标签 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["🔗 输入职位链接", "📄 粘贴简历内容", "⚙️ 一键运行 Workflow", "📊 查看能力匹配报告"].map((step) => (
            <span key={step} className="ji-tech-pill text-[0.65rem]">
              {step}
            </span>
          ))}
        </div>

        {/* Live Demo Container */}
        <div className="rounded-2xl border border-black/5 bg-white/60 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-white/80 border-b border-black/5 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-[0.6rem] text-[var(--ji-muted)] ml-2 font-mono">demo.careerly.app ~</span>
          </div>
          <div className="p-5">
            <LiveDemo />
          </div>
        </div>
      </motion.div>

    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 12 · From Prototype → Product
   ================================================================ */
function EvolutionSection() {
  const stages = [
    {
      icon: "🧪",
      label: "JobInsight AI",
      tag: "Web / Agent",
      desc: "一个能跑的匹配原型：Streamlit Web + LangGraph Agent，验证 AI 能否理解简历与岗位。",
    },
    {
      icon: "🔁",
      label: "Product Reframing",
      tag: "重新定义问题",
      desc: "原型成立，但问题问错了。从「匹配一个岗位」转向「看见能力与成长」。",
    },
    {
      icon: "🌱",
      label: "Careerly",
      tag: "Mobile Product",
      desc: "把能力匹配变成可以日常使用、可以累积记录的产品，而不是一次性查询。",
    },
    {
      icon: "📱",
      label: "Flutter",
      tag: "移动端实现",
      desc: "同一套 AI 能力，换一个产品容器：从浏览器窗口，到随身携带。",
    },
  ];

  const stackGroups = [
    { label: "Product", items: ["Flutter"] },
    { label: "Backend", items: ["FastAPI"] },
    { label: "AI", items: ["LangGraph", "LLM"] },
  ];

  return (
    <ScreenWrapper id="evolution" minH="100vh">
      <SectionTitle
        label="From Prototype → Product"
        title="从 Web 原型，到移动产品。"
        subtitle="AI 能力没有变，变的是它被组织进什么样的产品。"
      />

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-8">
        {/* 左侧：演进时间线 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-[0.55rem] font-bold text-[var(--ji-muted)] uppercase tracking-[0.25em] mb-3">
            Evolution
          </h3>
          <div className="relative pl-12 space-y-0">
            <div className="ji-roadmap-line" />
            {stages.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative py-4"
              >
                <div className="ji-roadmap-dot active absolute left-[-22px] top-4">
                  {item.icon}
                </div>
                <div className="ml-2">
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-sm font-semibold text-[var(--ji-text)]">{item.label}</h4>
                    <span className="text-[0.55rem] font-medium text-[var(--ji-blue)] uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-[var(--ji-muted)] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 右侧：技术栈分组 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-[0.55rem] font-bold text-[var(--ji-muted)] uppercase tracking-[0.25em] mb-3">
            Stack
          </h3>
          <div className="space-y-4">
            {stackGroups.map((group) => (
              <div key={group.label} className="ji-layer">
                <span className="ji-layer-label">{group.label}</span>
                <div className="ji-layer-items">
                  {group.items.map((item) => (
                    <span key={item} className="ji-tech-pill">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <p className="text-[0.7rem] text-[var(--ji-muted)] leading-relaxed">
              原型阶段的 Streamlit Web 界面保留为第 02 屏的可交互 Demo——
              AI 能力在那里已经被验证过，产品化要解决的是它如何被日常使用。
            </p>
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-[var(--ji-muted)] mt-10"
      >
        同一条 AI 能力，换一个产品容器。
      </motion.p>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 13 · Reflection — What changed in my thinking
   ================================================================ */
function ReflectionSection({ project }: { project: ProjectData }) {
  const conclusions = [
    {
      index: "01",
      en: "AI is not the product.",
      zh: "AI 不是产品",
      desc: "AI 能算出匹配度，但匹配度不是用户要的东西。产品是把 AI 的输出，翻译成用户能理解、能行动的判断。",
    },
    {
      index: "02",
      en: "A score is not insight.",
      zh: "分数不是洞察",
      desc: "82% 不是洞察。洞察是「差在哪里、为什么差、怎么补上」——分数只是这条线索的起点。",
    },
    {
      index: "03",
      en: "Growth needs a memory.",
      zh: "成长需要记忆",
      desc: "没有历史版本，就没有成长。产品必须记得你上一次是什么样，才谈得上「你变好了多少」。",
    },
  ];

  return (
    <ScreenWrapper id="reflection" minH="85vh">
      <SectionTitle
        label="Reflection"
        title="What changed in my thinking."
        subtitle="比做出来什么更重要的，是这次做下来改变了什么判断。"
        align="center"
      />

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {conclusions.map((c, i) => (
          <AnimatedCard key={c.index} icon={c.index} title={c.en} delay={i * 0.12}>
            <p className="text-[0.7rem] font-medium text-[var(--ji-blue)] mb-2">{c.zh}</p>
            <p className="text-sm text-[var(--ji-muted)] leading-relaxed">{c.desc}</p>
          </AnimatedCard>
        ))}
      </div>

      {/* 收束 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="ji-layer mt-12 text-center"
      >
        <span className="ji-layer-label">Closing</span>
        <h3 className="ji-layer-title">
          See where you are. Understand the gap. Keep moving.
        </h3>
      </motion.div>

      {/* Project metadata + nav */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-16 pt-8 border-t border-black/5"
      >
        <ProjectMetadata project={project} hideLocation />
      </motion.div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Main Component
   ================================================================ */
export function JobInsightCase({
  project,
  id,
}: {
  project: ProjectData;
  id: string;
}) {
  const totalScreens = 13;
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScreen, setActiveScreen] = useState(0);

  // 监听滚动位置确定当前屏幕
  const handleScroll = useCallback(() => {
    const sections = document.querySelectorAll(".ji-screen");
    let current = 0;
    sections.forEach((section, i) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.3) {
        current = i;
      }
    });
    setActiveScreen(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 导航圆点按 DOM 顺序取索引，屏数错位会静默失效 —— DEV 下断言
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const n = document.querySelectorAll(".ji-screen").length;
    if (n !== totalScreens) {
      console.warn(`[JobInsightCase] .ji-screen ${n} ≠ totalScreens ${totalScreens}`);
    }
  }, []);

  const scrollTo = (index: number) => {
    const sections = document.querySelectorAll(".ji-screen");
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={containerRef} className="jobinsight-case min-h-screen bg-background text-foreground">
      <ProgressBar totalSections={totalScreens} />
      <BackToHomeLink anchor="product-cases" />

      <SideNav
        activeIndex={activeScreen}
        totalScreens={totalScreens}
        onNav={scrollTo}
      />

      {/* ======================== */}
      {/* Screen 01 · Hero          */}
      {/* ======================== */}
      <HeroSection project={project} />

      {/* ======================== */}
      {/* Screen 02 · Live Demo    */}
      {/* ======================== */}
      <LiveDemoSection />

      {/* ======================== */}
      {/* Screen 03 · Reframe      */}
      {/* ======================== */}
      <ReframeSection />

      {/* ======================== */}
      {/* Screen 04 · The Question */}
      {/* ======================== */}
      <QuestionSection />

      {/* ======================== */}
      {/* Screen 05 · Insight      */}
      {/* ======================== */}
      <InsightSection />

      {/* ======================== */}
      {/* Screen 06 · Strategy     */}
      {/* ======================== */}
      <ProductStrategySection />

      {/* ======================== */}
      {/* Screen 07 · Experience   */}
      {/* ======================== */}
      <CoreExperienceSection />

      {/* ======================== */}
      {/* Screen 08 · Career Gap   */}
      {/* ======================== */}
      <CareerGapSection />

      {/* ======================== */}
      {/* Screen 09 · Career Asset */}
      {/* ======================== */}
      <CareerAssetSection />

      {/* ======================== */}
      {/* Screen 10 · Workflow     */}
      {/* ======================== */}
      <WorkflowSection />

      {/* ======================== */}
      {/* Screen 11 · Architecture */}
      {/* ======================== */}
      <ProductArchitectureSection />

      {/* ======================== */}
      {/* Screen 12 · Evolution    */}
      {/* ======================== */}
      <EvolutionSection />

      {/* ======================== */}
      {/* Screen 13 · Reflection   */}
      {/* ======================== */}
      <ReflectionSection project={project} />

      {/* 底部留白 */}
      <div className="h-16" />
    </div>
  );
}
