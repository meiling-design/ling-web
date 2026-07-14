/**
 * AI 智能职位分析助手 —— Scroll Story 产品详情页
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
import { localImages } from "../../imageAssets";

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

function AnimatedCard({ icon, title, desc, delay = 0, className = "", children }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`rounded-xl border border-black/5 bg-white p-6 shadow-sm ${className}`}
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
    { icon: "👤", label: "个人背景", desc: "Background" },
    { icon: "📋", label: "职位理解", desc: "Understanding" },
    { icon: "📊", label: "能力分析", desc: "Analysis" },
    { icon: "🔍", label: "匹配推理", desc: "Reasoning" },
    { icon: "💡", label: "职业建议", desc: "Suggestion" },
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
            0→1 可运行 MVP
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--ji-text)] leading-tight tracking-tight">
            AI 智能职位分析助手
          </h1>
          <p className="text-base md:text-lg text-[var(--ji-muted)] leading-relaxed max-w-xl">
            从寻找岗位，到做出更好的职业决策。AI 智能职位分析助手 利用 AI 理解职位、分析能力匹配、解释推荐原因，帮助求职者找到真正适合自己的机会。
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
              <span className="text-sm text-[var(--ji-text)]">LangGraph · LLM · Streamlit</span>
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
              <span className="text-[0.55rem] text-[var(--ji-muted)] ml-2 font-mono">AI 智能职位分析助手 — Dashboard</span>
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
   Screen 02 · Problem
   ================================================================ */
function ProblemSection() {
  const problems = [
    {
      icon: "📡",
      title: "信息过载",
      desc: "每天面对大量岗位，\n却不知道哪个值得投入时间。",
    },
    {
      icon: "📋",
      title: "需求难懂",
      desc: "JD 中隐藏大量能力要求，\n用户难以判断真正匹配点。",
    },
    {
      icon: "🔄",
      title: "缺少反馈",
      desc: "投递失败后，\n不知道问题在哪里，也无法持续优化。",
    },
  ];

  return (
    <ScreenWrapper id="problem" minH="80vh">
      <SectionTitle
        label="Problem"
        title="求职的难点，不是找到岗位，而是判断选择。"
        align="center"
      />

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {problems.map((p, i) => (
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
          用户真正需要的，<br/>不是更多岗位，而是更好的决策依据。
        </span>
      </motion.div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 03 · Metrics
   ================================================================ */
function MetricsSection() {
  const metrics = [
    { stat: "90%", label: "匹配精度", desc: "AI 理解职位核心要求与用户能力匹配度" },
    { stat: "60%", label: "效率提升", desc: "从人工筛选数小时到 AI 分钟级分析" },
    { stat: "85%", label: "决策信心", desc: "用户获得可解释匹配原因后的选择确定性" },
  ];

  return (
    <ScreenWrapper id="metrics" minH="60vh">
      <SectionTitle
        label="Metrics"
        title="用数据验证决策价值"
        align="center"
      />

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="text-center rounded-2xl border border-black/5 bg-white p-8 shadow-sm"
          >
            <span className="text-4xl md:text-5xl font-bold text-[var(--ji-blue)] block">
              {m.stat}
            </span>
            <h3 className="text-base font-semibold text-[var(--ji-text)] mt-3">{m.label}</h3>
            <p className="text-sm text-[var(--ji-muted)] mt-2 leading-relaxed">{m.desc}</p>
          </motion.div>
        ))}
      </div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 04 · Persona
   ================================================================ */
function PersonaSection() {
  const persona = {
    initial: "A",
    name: "Alex",
    age: "—",
    title: "AI 产品经理候选人",
    tags: ["🎯 求职中", "🤖 AI 领域", "📱 产品思维"],
    bgGradient: "from-[var(--ji-blue-light)]/60 to-[var(--ji-blue)]/5",
    quadrants: [
      { icon: "🎯", label: "目标", text: "进入 AI 行业，找到更匹配的产品岗位" },
      { icon: "⚡", label: "挑战", text: "岗位太多，不知道选哪个值得投入时间" },
      { icon: "❌", label: "痛点", text: "投递后没有反馈，不知道自己与岗位的差距" },
      { icon: "💡", label: "需求", text: "需要一个理解我、能帮我做判断的 AI 顾问" },
    ],
    path: [
      { icon: "🔍", label: "浏览岗位" },
      { icon: "📄", label: "上传简历" },
      { icon: "🤖", label: "AI 分析" },
      { icon: "📊", label: "匹配评估" },
      { icon: "🚀", label: "优化投递" },
    ],
  };

  return (
    <ScreenWrapper id="persona" minH="90vh">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border border-border rounded-2xl bg-card overflow-hidden max-w-5xl mx-auto"
      >
        {/* ─── 左右布局：左侧个人信息 + 右侧四象限 ─── */}
        <div className="flex flex-col md:flex-row">
          {/* 左侧：头像 + 身份标签 */}
          <div
            className={`
              md:w-[260px] shrink-0 p-6 md:p-8
              flex flex-col items-center md:items-start justify-center
              bg-gradient-to-br ${persona.bgGradient}
              border-r-0 md:border-r border-border
            `}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-white to-white/60 border-2 border-border flex items-center justify-center mb-4 shadow-sm">
              <span className="text-3xl font-bold text-[var(--ji-text)]">{persona.initial}</span>
            </div>
            <h3 className="text-xl font-bold text-foreground text-center md:text-left">
              {persona.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 text-center md:text-left">
              {persona.age}{persona.age ? " · " : ""}{persona.title}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              {persona.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[0.6rem] font-medium bg-background/70 rounded-full text-muted-foreground border border-border/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 右侧：四宫格 */}
          <div className="flex-1 p-6 md:p-8">
            <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-5">
              求职决策画像 · 用户画像
            </p>
            <div className="grid grid-cols-2 gap-4">
              {persona.quadrants.map((q) => (
                <div
                  key={q.label}
                  className="p-4 border border-border rounded-xl bg-background/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm leading-none">{q.icon}</span>
                    <h4 className="text-[0.80rem] font-bold text-foreground uppercase tracking-wider">
                      {q.label}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {q.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部：行为路径 */}
        <div className="border-t border-border px-6 md:px-8 py-4">
          <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-3 text-left">
            求职行为路径 · 用户流程
          </p>
          <div className="flex items-center w-full gap-1 justify-between">
            {persona.path.map((step, i) => (
              <span key={step.label} className="inline-flex items-center gap-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-border rounded-lg bg-background/50 text-[0.6rem] font-medium text-foreground/70 whitespace-nowrap">
                  <span className="text-xs leading-none">{step.icon}</span>
                  <span>{step.label}</span>
                </span>
                {i < persona.path.length - 1 && (
                  <span className="text-muted-foreground/20 text-sm shrink-0 ml-2">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
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

  const beforeAfterData = {
    before: {
      title: "传统岗位匹配",
      steps: ["职位描述", "关键词提取", "匹配分数"],
      color: "text-red-500/70",
    },
    after: {
      title: "AI 智能职位分析助手",
      steps: [
        "职位描述",
        "语义理解",
        "能力分析",
        "匹配原因",
        "优化建议",
        "再次决策",
      ],
      color: "text-[var(--ji-blue)]",
    },
  };

  return (
    <ScreenWrapper id="insight" minH="80vh">
      <SectionTitle
        label="Insight"
        title="用户需要的不是一个分数，而是一套理解与判断过程。"
      />

      <div ref={ref} className="grid md:grid-cols-2 gap-8 md:gap-12 mt-8">
        {/* Before */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-red-200/40 bg-red-50/30 p-8"
        >
          <h3 className="text-lg font-semibold text-red-500/80 mb-6 flex items-center gap-2">
            <span className="text-2xl">◀</span>
            {beforeAfterData.before.title}
          </h3>
          <div className="space-y-3">
            {beforeAfterData.before.steps.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-[0.65rem] font-bold">
                  {i + 1}
                </span>
                <span className="text-sm text-[var(--ji-text)]">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-red-200/30 text-center">
            <span className="text-sm text-red-400/70">得到结果，<br/>却不知道为什么。</span>
          </div>
        </motion.div>

        {/* After */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-[var(--ji-blue-mid)] bg-[var(--ji-blue-light)] p-8"
        >
          <h3 className="text-lg font-semibold text-[var(--ji-blue)] mb-6 flex items-center gap-2">
            <span className="text-2xl">▶</span>
            {beforeAfterData.after.title}
          </h3>
          <div className="space-y-3">
            {beforeAfterData.after.steps.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <span className="w-7 h-7 rounded-full bg-[var(--ji-blue)] text-white flex items-center justify-center text-[0.65rem] font-bold">
                  {i + 1}
                </span>
                <span className="text-sm text-[var(--ji-text)] font-medium">{step}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--ji-blue-mid)] text-center">
            <span className="text-sm font-medium text-[var(--ji-blue)]">从黑盒推荐，<br/>到可解释职业决策。</span>
          </div>
        </motion.div>
      </div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 06 · Solution
   ================================================================ */
function SolutionSection() {
  const flow = [
    { icon: "📥", label: "输入\n简历 + 职位信息" },
    { icon: "🧠", label: "理解\nAI 分析用户与岗位" },
    { icon: "🔍", label: "推理\n能力匹配与差距分析" },
    { icon: "📊", label: "决策\n个性化岗位排序" },
    { icon: "🚀", label: "行动\n优化建议与下一步规划" },
  ];

  return (
    <ScreenWrapper id="solution" minH="100vh">
      <SectionTitle
        label="Solution"
        title="将复杂求职流程，转化为 AI 驱动的决策链路。"
        subtitle="从输入到决策，AI 驱动完整分析链路。"
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

    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 07 · Product Blueprint (IA)
   ================================================================ */
function BlueprintSection() {
  const layers = [
    { label: "Output", title: "输出层", items: ["岗位推荐", "匹配解释", "优化建议"], color: "border-l-[var(--ji-blue)]" },
    { label: "Decision", title: "决策层", items: ["能力匹配", "权重计算", "排序优化"], color: "border-l-blue-400" },
    { label: "Agent", title: "Agent 层", items: ["信息获取 Agent", "简历分析 Agent", "岗位匹配 Agent", "报告生成 Agent"], color: "border-l-blue-500" },
    { label: "Input", title: "输入层", items: ["简历", "职位数据", "用户需求"], color: "border-l-blue-600" },
    { label: "User", title: "用户层", items: ["职业目标", "个人经历", "求职偏好"], color: "border-l-gray-400" },
  ];

  return (
    <ScreenWrapper id="blueprint" minH="120vh">
      <SectionTitle
        label="Product Blueprint"
        title="AI 职业决策系统"
        subtitle="连接用户背景、AI 推理能力与职业行动建议。"
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

      {/* 层间箭头指示 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="flex justify-center mt-6 text-[var(--ji-muted)]"
      >
        <div className="flex items-center gap-8 text-[0.6rem] font-medium uppercase tracking-wider">
          <span>User</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
          <span>Input</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
          <span>Agent</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
          <span>Decision</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
          <span>Output</span>
        </div>
      </motion.div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 08 · Multi-Agent Workflow (LangGraph)
   ================================================================ */
function WorkflowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const nodes = [
    { icon: "🌐", label: "职位抓取", desc: "从招聘网站获取职位数据" },
    { icon: "🔧", label: "数据标准化", desc: "清洗与统一格式" },
    { icon: "📄", label: "简历解析", desc: "提取个人能力与经历" },
    { icon: "🧬", label: "Embedding", desc: "语义向量检索" },
    { icon: "🔀", label: "Router", desc: "条件决策路径分发" },
    { icon: "🎯", label: "岗位匹配", desc: "能力与需求综合评分" },
    { icon: "📊", label: "综合排序", desc: "多维度加权排序" },
    { icon: "📝", label: "报告生成", desc: "输出可读分析报告" },
  ];

  return (
    <ScreenWrapper id="workflow" minH="120vh">
      <SectionTitle
        label="Multi-Agent Workflow"
        title="多个 Agent 协作，完成一次完整职业分析。"
        subtitle="不同任务需要不同推理能力，LangGraph 将多个 Agent 组织成可靠 Workflow。"
      />

      <div ref={ref} className="mt-8 max-w-2xl mx-auto">
        <div className="ji-node-flow">
          {nodes.map((node, i) => {
            // Calculate normalized progress for each node
            const nodeStart = i / nodes.length;
            const nodeEnd = (i + 1) / nodes.length;
            const activeThreshold = nodeStart + (nodeEnd - nodeStart) * 0.3;
            const isActive = scrollYProgress.get() >= activeThreshold;

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
        每一步都可观察、可恢复、可优化。
      </motion.p>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 09 · Personalized Decision Engine
   ================================================================ */
function DecisionEngineSection() {
  const [weights, setWeights] = useState({
    salary: 40,
    content: 30,
    growth: 20,
    scale: 10,
  });

  const weightKeys = [
    { key: "salary" as const, label: "薪资待遇", en: "Salary", icon: "💰" },
    { key: "content" as const, label: "工作内容", en: "Content", icon: "💼" },
    { key: "growth" as const, label: "成长空间", en: "Growth", icon: "📈" },
    { key: "scale" as const, label: "公司规模", en: "Company Size", icon: "🏢" },
  ];

  // Simulate ranking change based on weights
  const rankings = [
    { rank: 1, title: "资深 AI 工程师 — 字节跳动", scores: { salary: 92, content: 88, growth: 60, scale: 85 } },
    { rank: 2, title: "AI 算法工程师 — 腾讯", scores: { salary: 85, content: 90, growth: 70, scale: 90 } },
    { rank: 3, title: "机器学习工程师 — 商汤科技", scores: { salary: 78, content: 92, growth: 55, scale: 65 } },
    { rank: 4, title: "NLP 算法工程师 — 阿里", scores: { salary: 88, content: 82, growth: 65, scale: 88 } },
    { rank: 5, title: "AI 产品经理 — 小红书", scores: { salary: 75, content: 75, growth: 80, scale: 70 } },
  ];

  // Recalculate scores based on weights
  const weightedRankings = rankings.map((r) => {
    const total =
      (r.scores.salary * weights.salary +
        r.scores.content * weights.content +
        r.scores.distance * weights.distance +
        r.scores.scale * weights.scale) /
      (weights.salary + weights.content + weights.distance + weights.scale);
    return { ...r, score: Math.round(total) };
  }).sort((a, b) => b.score - a.score);

  const updateWeight = (key: keyof typeof weights, delta: number) => {
    setWeights((prev) => {
      const newVal = Math.max(0, Math.min(100, prev[key] + delta));
      return { ...prev, [key]: newVal };
    });
  };

  return (
    <ScreenWrapper id="decision-engine" minH="100vh">
      <SectionTitle
        label="Personalized Decision Engine"
        title="真正的推荐，应该理解每个人的选择偏好。"
        subtitle="同一个岗位库，不同用户得到不同答案。"
      />

      <div className="grid md:grid-cols-5 gap-8 mt-8">
        {/* 左侧：权重调节（占 2 列） */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 space-y-6"
        >
          <h3 className="text-sm font-bold text-[var(--ji-text)] uppercase tracking-wider">偏好权重</h3>
          {weightKeys.map((w) => (
            <div key={w.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{w.icon}</span>
                  <span className="text-sm font-medium text-[var(--ji-text)]">{w.label}</span>
                  <span className="text-[0.55rem] text-[var(--ji-muted)]">{w.en}</span>
                </div>
                <span className="text-sm font-bold text-[var(--ji-blue)]">{weights[w.key]}%</span>
              </div>
              <div className="ji-weight-bar" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                setWeights((prev) => ({ ...prev, [w.key]: Math.round(pct) }));
              }}>
                <div
                  className="ji-weight-fill"
                  style={{ width: `${weights[w.key]}%` }}
                />
              </div>
              <div className="flex justify-between text-[0.5rem] text-[var(--ji-muted)]">
                <button onClick={() => updateWeight(w.key, -5)} className="hover:text-[var(--ji-text)] transition-colors">−5%</button>
                <button onClick={() => updateWeight(w.key, 5)} className="hover:text-[var(--ji-text)] transition-colors">+5%</button>
              </div>
            </div>
          ))}
        </motion.div>

        {/* 右侧：排序结果（占 3 列） */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-3"
        >
          <h3 className="text-sm font-bold text-[var(--ji-text)] uppercase tracking-wider mb-4">
            <span className="flex items-center gap-2">
              推荐排序
              <span className="text-[0.55rem] font-normal text-[var(--ji-muted)]">(权重变化实时计算)</span>
            </span>
          </h3>
          <div className="space-y-2">
            {weightedRankings.map((item, i) => (
              <motion.div
                key={item.title}
                layout
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="ji-rank-item"
              >
                <span className={`ji-rank-number ${i < 3 ? "top" : ""}`}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${item.rank}`}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--ji-text)] truncate">{item.title}</p>
                </div>
                <span className="ji-rank-score">{item.score}分</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-[var(--ji-muted)] mt-8"
      >
        ↑ 拖动权重条，实时观察排序变化
      </motion.p>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 10 · Product Experience (Streamlit)
   ================================================================ */
function ProductExperienceSection() {
  const demos = [
    { icon: "📤", title: "上传简历", desc: "AI 理解个人能力背景", step: "01" },
    { icon: "🔗", title: "输入职位", desc: "解析岗位核心要求", step: "02" },
    { icon: "⚙️", title: "Workflow 执行", desc: "观察 Agent 分析过程", step: "03" },
    { icon: "📊", title: "生成报告", desc: "获得匹配解释与优化建议", step: "04" },
  ];

  return (
    <ScreenWrapper id="experience" minH="100vh">
      <SectionTitle
        label="Product Experience"
        title="从输入信息，到职业判断结果。"
      />

      {/* Main product image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl overflow-hidden border border-black/5 bg-white shadow-sm mb-8"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={localImages.jobMatching}
          alt="AI 智能职位分析助手 产品界面"
          className="w-full h-full object-contain p-2"
          loading="lazy"
        />
      </motion.div>

      {/* 4-step cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {demos.map((demo, i) => (
          <AnimatedCard key={demo.title} delay={i * 0.1} className="text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[0.55rem] font-bold text-[var(--ji-muted)]">{demo.step}</span>
              <span className="text-2xl">{demo.icon}</span>
              <h3 className="text-sm font-semibold text-[var(--ji-text)]">{demo.title}</h3>
              <p className="text-[0.7rem] text-[var(--ji-muted)]">{demo.desc}</p>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 11 · Technical Architecture
   ================================================================ */
function TechArchitectureSection() {
  const techStack = [
    { icon: "🔷", label: "LangGraph" },
    { icon: "🧠", label: "Qwen / LLM" },
    { icon: "💾", label: "SQLite" },
    { icon: "🧬", label: "Embedding" },
    { icon: "📄", label: "pdfplumber" },
    { icon: "🎭", label: "Playwright" },
    { icon: "📡", label: "DashScope" },
    { icon: "⚡", label: "Streamlit" },
  ];

  const highlights = [
    { title: "多 Agent 协作", desc: "4 个专业 Agent" },
    { title: "状态管理", desc: "SQLite Checkpoint" },
    { title: "混合检索", desc: "Embedding + LLM" },
    { title: "可靠执行", desc: "Retry + Error Handling" },
  ];

  return (
    <ScreenWrapper id="architecture" minH="100vh">
      <SectionTitle
        label="Technical Architecture"
        title="产品背后的 AI 系统能力"
        subtitle="通过 LangGraph 构建稳定、可扩展的 Agent Workflow。"
      />

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-8">
        {/* 左侧：技术栈 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-sm font-bold text-[var(--ji-text)] uppercase tracking-wider mb-5">技术栈</h3>
          <div className="space-y-4">
            {/* LangGraph → Checkpoint → Retry 流程示意 */}
            <div className="ji-layer">
              <div className="flex items-center gap-3 flex-wrap">
                {["LangGraph", "Checkpoint", "Retry"].map((item, i, arr) => (
                  <span key={item} className="inline-flex items-center gap-1">
                    <span className="ji-tech-pill">{item}</span>
                    {i < arr.length - 1 && <span className="text-[var(--ji-muted)] text-xs">→</span>}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 flex-wrap mt-3">
                {["Embedding", "LLM", "Export"].map((item, i, arr) => (
                  <span key={item} className="inline-flex items-center gap-1">
                    <span className="ji-tech-pill">{item}</span>
                    {i < arr.length - 1 && <span className="text-[var(--ji-muted)] text-xs">→</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* 完整技术栈标签 */}
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span key={t.label} className="ji-tech-pill">
                  {t.icon} {t.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 右侧：工程亮点 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-sm font-bold text-[var(--ji-text)] uppercase tracking-wider mb-5">工程亮点</h3>
          <div className="grid grid-cols-2 gap-3">
            {highlights.map((h) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-black/5 bg-white p-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-[var(--ji-text)]">{h.title}</p>
                <p className="text-[0.65rem] text-[var(--ji-muted)] mt-1">{h.desc}</p>
              </motion.div>
            ))}
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
        不讲代码，讲系统能力
      </motion.p>
    </ScreenWrapper>
  );
}

/* ================================================================
   Screen 12 · Reflection & Roadmap
   ================================================================ */
function ReflectionSection({ project }: { project: ProjectData }) {
  const lessons = [
    {
      category: "产品思考",
      items: [
        { label: "从工具思维 ↓ 到 Agent 思维", desc: "用户需要的不是另一个搜索工具，而是一个能做决策的助手。" },
        { label: "从固定推荐 ↓ 到动态决策", desc: "静态匹配分数无法满足个性化需求，动态权重引擎让推荐结果因人而异。" },
        { label: "从结果输出 ↓ 到可解释 AI", desc: "用户不仅要一个分数，还要知道分数为什么是这样，以及如何改进。" },
      ],
    },
    {
      category: "技术沉淀",
      items: [
        { label: "LangGraph State", desc: "状态驱动的 Workflow 让 Agent 协作更可控，避免大模型输出不稳定的问题。" },
        { label: "Prompt Engineering", desc: "不同 Agent 使用定制化的 System Prompt，显著提升输出质量和一致性。" },
        { label: "Embedding Strategy", desc: "向量召回 + LLM 评分的两阶段策略，在成本和质量之间取得了好的平衡。" },
      ],
    },
  ];

  const roadmap = [
    { icon: "🌐", label: "v0.2 Browser Agent", desc: "自动获取岗位信息" },
    { icon: "🎙️", label: "v0.3 Interview Agent", desc: "AI 面试训练" },
    { icon: "🧠", label: "v0.4 Career Memory", desc: "长期职业画像" },
    { icon: "🚀", label: "Future", desc: "Career Decision Platform" },
  ];

  return (
    <ScreenWrapper id="reflection" minH="80vh">
      <SectionTitle
        label="Reflection & Roadmap"
        title="产品演进与未来方向"
      />

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* 产品/技术 Lessons */}
        <div className="space-y-6">
          {lessons.map((group) => (
            <div key={group.category}>
              <h3 className="text-[0.55rem] font-bold text-[var(--ji-muted)] uppercase tracking-[0.25em] mb-3">
                {group.category}
              </h3>
              <div className="space-y-3">
                {group.items.map((lesson) => (
                  <motion.div
                    key={lesson.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="rounded-xl border border-black/5 bg-white p-4 shadow-sm"
                  >
                    <h4 className="text-sm font-semibold text-[var(--ji-text)]">{lesson.label}</h4>
                    <p className="text-[0.7rem] text-[var(--ji-muted)] mt-1 leading-relaxed">{lesson.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Roadmap */}
        <div>
          <h3 className="text-[0.55rem] font-bold text-[var(--ji-muted)] uppercase tracking-[0.25em] mb-3">
            Roadmap · v0.2 +
          </h3>
          <div className="relative pl-12 space-y-0">
            {/* 时间线 */}
            <div className="ji-roadmap-line" />
            {roadmap.map((item, i) => (
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
                  <h4 className="text-sm font-semibold text-[var(--ji-text)]">{item.label}</h4>
                  <p className="text-[0.7rem] text-[var(--ji-muted)]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

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
  const totalScreens = 12;
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
      {/* Screen 02 · Problem       */}
      {/* ======================== */}
      <ProblemSection />

      {/* ======================== */}
      {/* Screen 03 · Metrics       */}
      {/* ======================== */}
      <MetricsSection />

      {/* ======================== */}
      {/* Screen 04 · Persona       */}
      {/* ======================== */}
      <PersonaSection />

      {/* ======================== */}
      {/* Screen 05 · Insight       */}
      {/* ======================== */}
      <InsightSection />

      {/* ======================== */}
      {/* Screen 06 · Solution      */}
      {/* ======================== */}
      <SolutionSection />

      {/* ======================== */}
      {/* Screen 07 · Blueprint     */}
      {/* ======================== */}
      <BlueprintSection />

      {/* ======================== */}
      {/* Screen 08 · Workflow      */}
      {/* ======================== */}
      <WorkflowSection />

      {/* ======================== */}
      {/* Screen 09 · Decision      */}
      {/* ======================== */}
      <DecisionEngineSection />

      {/* ======================== */}
      {/* Screen 10 · Experience    */}
      {/* ======================== */}
      <ProductExperienceSection />

      {/* ======================== */}
      {/* Screen 11 · Architecture  */}
      {/* ======================== */}
      <TechArchitectureSection />

      {/* ======================== */}
      {/* Screen 12 · Reflection    */}
      {/* ======================== */}
      <ReflectionSection project={project} />

      {/* 底部留白 */}
      <div className="h-16" />
    </div>
  );
}
