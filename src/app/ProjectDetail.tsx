import { useState, useRef, useMemo, type KeyboardEvent, type ReactNode } from "react";
import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Lightbox } from "./components/ui/Lightbox";
import { BackToHomeLink, ProjectMetadata } from "./components/product";
import { CunxiCase } from "./components/product/CunxiCase";
import { getProjectById, getAllProjectIds, getProjectGroup, groupHasDetailTags } from "../services/projectService";
import type { ProjectData } from "../services/projectService";
import { fadeUp } from "../services/animationVariants";
import { useProjectNavigation } from "../hooks/useProjectNavigation";
import { localImages } from "./imageAssets";

const allProjectIds = getAllProjectIds();

export function ProjectDetail() {
  const { id } = useParams();
  const project = id ? getProjectById(id) : undefined;

  // Project not found
  if (!project) {
    return (
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-medium tracking-widest text-[#1A1A1A]">项目未找到</h1>
          <p className="text-[#999] tracking-widest text-sm">PROJECT NOT FOUND</p>
          <Link
            to="/"
            className="fixed top-24 left-6 z-40 inline-flex items-center gap-2 px-5 py-2.5 text-[0.8rem] text-[#1A1A1A] bg-white/70 backdrop-blur-md border border-white/30 hover:bg-white/90 transition-all tracking-widest uppercase rounded-full"
          >
            <ArrowLeft size={16} /> 返回首页
          </Link>
        </div>
      </div>
    );
  }

  // 遗墨项目使用 ProductSection 风格定制详情页
  if (id === "yimo-vr-platform") {
    return <YimoVRProductDetail project={project} allProjectIds={allProjectIds} id={id} />;
  }

  // 寸隙 CUNXI 使用 11 章品牌产品案例
  if (id === "cunxi-ai-career-growth") {
    return <CunxiCase project={project} id={id} allProjectIds={allProjectIds} />;
  }

  return <GenericProjectDetail project={project} id={id!} />;
}

/** 通用项目详情：图片横向画廊 + sticky 文案栏 + Lightbox */
function GenericProjectDetail({ project, id }: { project: ProjectData; id: string }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { currentIndex, prevId, nextId } = useProjectNavigation(
    id,
    allProjectIds,
    { isDisabled: isLightboxOpen },
  );

  // 判断是否需要用标签取代副标题（除 product-cases 外均显示）
  const projectGroupId = getProjectGroup(id);
  const showTags = projectGroupId ? groupHasDetailTags(projectGroupId) : false;
  const tagItems = showTags ? (project.detailTags ?? []) : [];

  // 摄影板块保持黑白滤镜
  const isPhotography = project.category.includes("摄影");
  // 所有板块统一使用 object-cover 填满容器

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstCard = container.children[0] as HTMLElement | null;
      if (!firstCard) return;
      // 每张卡片宽度 + gap-8（32px），确保每次点击完整浏览下一张
      const cardWidth = firstCard.getBoundingClientRect().width;
      const scrollAmount = cardWidth + 32;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="container mx-auto px-6 max-w-[1440px] py-12">
        <BackToHomeLink anchor={id!} />

        <div className="flex flex-col gap-12">
          {/* Top row: Images + Tags/Title/Description side by side on large screens */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
            {/* Left: Images - Horizontal Scroll */}
            <div className="w-full lg:flex-1 lg:min-w-0 relative group">
              <div
                ref={scrollRef}
                className="w-full overflow-x-auto no-scrollbar flex gap-8 pb-10 cursor-grab active:cursor-grabbing scroll-smooth"
              >
                {project.images.map((img: string, idx: number) => (
                  <motion.div
                    key={img}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex-shrink-0 w-[95vw] lg:w-[60vw] h-[60vh] lg:h-[85vh] cursor-zoom-in rounded-[4px] overflow-hidden bg-[#F9F9F9]"
                    onClick={() => {
                      setLightboxIndex(idx);
                      setIsLightboxOpen(true);
                    }}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${project.title} - ${idx + 1}`}
                      className={`w-full h-full transition-all duration-700 ease-in-out ${(id === "shanhaijing-beasts" || isPhotography) ? 'object-contain' : 'object-cover'} ${isPhotography ? 'grayscale hover:grayscale-0' : ''}`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => scroll("left")}
                  className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-black/5 rounded-full pointer-events-auto hover:bg-black hover:text-white transition-all shadow-sm"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-black/5 rounded-full pointer-events-auto hover:bg-black hover:text-white transition-all shadow-sm"
                  aria-label="Scroll Right"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Right: Tags + Title + Description */}
            <div className="w-full lg:w-[380px] lg:shrink-0 lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {showTags ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tagItems.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-[0.7rem] bg-[#F0F0F0] text-[#777] rounded-full leading-none"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[0.7rem] text-[#999] uppercase tracking-[0.3em] mb-4">{project.subtitle}</p>
                )}
                <h1 className="text-[1.8rem] font-medium text-[#1A1A1A] leading-tight tracking-tight mb-1">{project.title}</h1>
                {project.homeDescription && (
                  <p className="text-[0.85rem] text-[#666] leading-snug mb-4">{project.homeDescription}</p>
                )}
                <div className="text-[#444] leading-[1.8] text-[0.85rem] font-light space-y-4">
                  <p>
                    {(() => {
                      const text = project.descriptionCN;
                      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
                      if (lines.length > 1) {
                        return lines.map((line, i) => {
                          const isFirst = i === 0;
                          const qIdx = (() => {
                            const cn = line.indexOf('？');
                            const en = line.indexOf('?');
                            if (cn >= 0 && en >= 0) return Math.min(cn, en);
                            return cn >= 0 ? cn : en;
                          })();
                          return (
                            <span key={i} className={isFirst ? "italic font-bold text-[#999]" : ""}>
                              {i > 0 && <br />}
                              {qIdx >= 0 ? (
                                <><strong className="font-semibold">{line.slice(0, qIdx + 1)}</strong>{line.slice(qIdx + 1)}</>
                              ) : line}
                            </span>
                          );
                        });
                      }
                      const qIdx = (() => {
                        const cn = text.indexOf('？');
                        const en = text.indexOf('?');
                        if (cn >= 0 && en >= 0) return Math.min(cn, en);
                        return cn >= 0 ? cn : en;
                      })();
                      if (qIdx >= 0) {
                        return (
                          <>
                            <strong className="font-semibold">{text.slice(0, qIdx + 1)}</strong>
                            {text.slice(qIdx + 1)}
                          </>
                        );
                      }
                      return text;
                    })()}
                  </p>
                  <p className="text-[#999]">{project.descriptionEN}</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom: Metadata + Navigation */}
          <div className="w-full border-t border-[#EEE] pt-8">
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              {[
                { label: "年份 / YEAR", value: project.year },
                { label: "地点 / SITE", value: project.location },
                { label: "类别 / CATEGORY", value: project.category },
                { label: project.section === "Research" ? "合作者 / Collaborator" : "角色 / ROLE", value: project.role },
                project.mentor ? { label: "指导 / INSTRUCTOR", value: project.mentor } : null,
              ]
                .filter((item): item is { label: string; value: string } => item !== null)
                .map((item) => (
                  <div key={item.label} className="flex flex-col gap-1 text-[0.75rem]">
                    <span className="text-[#BBB] tracking-widest uppercase text-[0.65rem] font-bold">{item.label}</span>
                    <span className="text-[#1A1A1A] whitespace-pre-line">{item.value}</span>
                  </div>
                ))}
            </div>

            <ProjectNav
              prevId={prevId}
              nextId={nextId}
              currentIndex={currentIndex}
              totalCount={allProjectIds.length}
            />
            </div>
          </div>
        </div>

      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={project.images}
        currentIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
        getAlt={(i) => `${project.title} - ${i + 1}`}
      />
    </div>
  );
}

// ========== 遗墨——非遗VR沉浸式体验平台 —— 全新视觉化详情页 ==========

// ---------- 子组件 ----------

function Section({ title, children, full, className = "" }: {
  title?: string;
  children?: React.ReactNode;
  full?: boolean;
  className?: string;
}) {
  return (
    <section className={`px-6 py-20 border-t border-black/5 ${full ? "min-h-screen flex items-center" : ""} ${className}`}>
      <div className="max-w-5xl mx-auto w-full">
        {title && (
          <h2 className="text-2xl font-semibold mb-8 text-foreground tracking-tight">{title}</h2>
        )}
        {children}
      </div>
    </section>
  );
}



// ========== 升级视觉化组件（Apple/Notion/Linear 风格） ==========

/* ---------- 截图占位 ---------- */
function ScreenPlaceholder({ label, aspect = "16/10", className = "" }: {
  label?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-muted border border-border rounded-2xl flex items-center justify-center ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <div className="text-center space-y-2">
        <div className="w-10 h-10 mx-auto rounded-full bg-border flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
}

/* ---------- 通用卡片 ---------- */
function Card({ title, desc, className = "" }: {
  title?: string;
  desc?: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={`p-5 md:p-6 border border-border rounded-xl bg-card ${className}`}
    >
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* ---------- SectionDivider —— 章节分隔标题 ---------- */
function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-[0.3em]">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ---------- ChapterHeader —— 大章节标题 ---------- */
function ChapterHeader({ number, title, enTitle, expanded, onToggle }: {
  number: number;
  title: string;
  enTitle: string;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const handleKeyDown = onToggle ? (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  } : undefined;

  return (
    <div
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      role={onToggle ? "button" : undefined}
      tabIndex={onToggle ? 0 : undefined}
      aria-expanded={onToggle ? expanded : undefined}
      className={`px-6 pt-10 pb-0 md:pt-14 ${onToggle ? "cursor-pointer select-none group" : ""}`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[0.7rem] font-bold text-muted-foreground uppercase tracking-[0.3em]">
              Chapter {number}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 tracking-tight">
              {title}
            </h1>
            <p className="text-base text-muted-foreground mt-1 tracking-wide">{enTitle}</p>
          </div>
          {onToggle && (
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors shrink-0 ml-4"
            >
              <ChevronDown size={24} />
            </motion.div>
          )}
        </div>
        <div className="h-px bg-border mt-6" />
      </div>
    </div>
  );
}

/* ---------- CollapsibleContent —— 可折叠内容区 ---------- */
function CollapsibleContent({ expanded, children }: { expanded: boolean; children: React.ReactNode }) {
  if (!expanded) {
    return null;
  }

  return (
    <div
      aria-hidden={!expanded}
      className="overflow-hidden transition-all duration-500 ease-in-out max-h-[20000px] opacity-100"
    >
      {children}
    </div>
  );
}

/* ---------- ProjectNav —— 共享上下页导航 ---------- */
function ProjectNav({ prevId, nextId, currentIndex, totalCount, variant = "default" }: {
  prevId?: string;
  nextId?: string;
  currentIndex: number;
  totalCount: number;
  variant?: "default" | "yimo";
}) {
  const isYimo = variant === "yimo";
  const linkClass = isYimo
    ? "text-[0.7rem] tracking-widest uppercase font-bold text-muted-foreground hover:text-foreground transition-colors"
    : "text-[0.7rem] text-[#AAA] hover:text-[#000] transition-colors tracking-widest uppercase font-bold";
  const disabledClass = isYimo
    ? "text-[0.7rem] tracking-widest uppercase font-bold text-black/10"
    : "text-[0.7rem] text-[#EEE] tracking-widest uppercase font-bold";
  const counterClass = isYimo
    ? "text-[0.7rem] tracking-widest text-muted-foreground"
    : "text-[0.7rem] text-[#AAA] tracking-widest";
  const containerClass = isYimo
    ? "flex items-center justify-between border-t border-black/10 pt-8"
    : "flex items-center justify-between pt-8 border-t border-[#EEE] mt-8";

  return (
    <div className={containerClass}>
      {prevId ? (
        <Link to={`/project/${prevId}`} className={linkClass}>← PREV</Link>
      ) : (
        <span className={disabledClass}>← PREV</span>
      )}
      <div className={counterClass}>{currentIndex + 1} / {totalCount}</div>
      {nextId ? (
        <Link to={`/project/${nextId}`} className={linkClass}>NEXT →</Link>
      ) : (
        <span className={disabledClass}>NEXT →</span>
      )}
    </div>
  );
}

/* ================================================================
   3. Pain Point Map — 痛点地图
   ================================================================ */
function PainPointMap() {
  const items = [
    { icon: "📡", title: "传播", subtitle: "MEDIA", points: ["数字化传播单一", "年轻用户触达率低"] },
    { icon: "🧑‍🎨", title: "传承", subtitle: "INHERIT", points: ["传承人老龄化", "后继者不足"] },
    { icon: "🏮", title: "文化", subtitle: "CULTURE", points: ["缺乏场景体验", "缺少现代表达"] },
    { icon: "🥽", title: "科技", subtitle: "TECH", points: ["VR体验缺失", "沉浸感不足"] },
  ];
  return (
    <div className="space-y-10">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-lg text-muted-foreground text-center"
      >
        传承断代 · 大众不了解 · 传播渠道弱 · 产业链缺失
      </motion.p>
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-4"
      >
        <Card title="👤 用户侧" desc="了解难、参与难、记忆难 — 非遗信息获取门槛高，缺乏沉浸式体验渠道" />
        <Card title="🧓 传承人侧" desc="传播渠道少、数字化能力弱 — 传统技艺无法有效触达年轻受众" />
        <Card title="🏭 行业侧" desc="产业链断裂、商业模式弱 — 从体验到消费的闭环未形成" />
      </motion.div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground text-center">机会框架 / Opportunity Framework</h3>
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-4"
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="group p-5 md:p-6 border border-border rounded-2xl bg-card hover:shadow-md hover:border-foreground/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-base font-bold text-foreground">{item.title}</span>
                    <span className="text-[0.5rem] text-muted-foreground tracking-[0.25em] uppercase font-medium">{item.subtitle}</span>
                  </div>
                  <ul className="space-y-2">
                    {item.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-foreground/30 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-lg md:text-xl font-medium text-red-600"
      >
        ↓ 让非遗重新流动
      </motion.p>
    </div>
  );
}

/* ================================================================
   3.1 User Segmentation — 用户细分
   ================================================================ */
function UserSegmentationSection() {
  const segments = [
    { emoji: "\u{1F9D1}\u{200D}\u{1F393}", title: "Z世代国风爱好者", user: "小雅", age: "22岁", desc: "对传统文化感兴趣但缺乏入门渠道，喜欢国风美学和社交分享", pct: "35%", color: "from-red-50/30 to-orange-50/30" },
    { emoji: "\u{1F3A8}", title: "年轻创作者", user: "插画师", age: "24岁", desc: "数字艺术创作者，寻求创作灵感与AI辅助工具，希望获得社区曝光", pct: "20%", color: "from-blue-50/30 to-purple-50/30" },
    { emoji: "\u{1F4D6}", title: "传统文化爱好者", user: "深度用户", age: "35岁", desc: "对非遗有深厚兴趣，追求专业内容和系统化知识，愿意深度参与", pct: "18%", color: "from-green-50/30 to-teal-50/30" },
    { emoji: "\u{1F9F5}", title: "非遗传承人", user: "手工艺人", age: "55岁", desc: "掌握传统技艺但缺乏数字化传播能力，希望吸引年轻人关注", pct: "10%", color: "from-amber-50/30 to-orange-50/30" },
    { emoji: "\u{1F3EB}", title: "教育研究机构", user: "高校/博物馆", age: "—", desc: "需要优质数字资源用于教学和研学，追求内容专业性与体系化", pct: "12%", color: "from-sky-50/30 to-blue-50/30" },
    { emoji: "\u{1F3DB}\u{FE0F}", title: "文化管理机构", user: "文旅局/基金会", age: "—", desc: "关注非遗保护成效与传播数据，需要数据中台支持决策", pct: "5%", color: "from-slate-50/30 to-gray-50/30" },
  ];
  return (
    <div className="space-y-6">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-base text-muted-foreground max-w-2xl mx-auto"
      >
        遗墨平台覆盖六大核心用户群体，从文化消费者到产业参与者形成完整用户生态
      </motion.p>
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-4"
      >
        {segments.map((s) => (
          <motion.div
            key={s.title}
            variants={fadeUp}
            className="p-5 border border-border rounded-xl bg-card hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-lg font-bold text-foreground">{s.pct}</span>
            </div>
            <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
            <p className="text-[0.6rem] text-muted-foreground mt-0.5">{s.user} · {s.age}</p>
            <p className="text-[0.7rem] text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ================================================================
   3.2 Persona — 用户画像
   ================================================================ */
function PersonaInsight() {
  const personas = [
    {
      id: "xiaoya",
      emoji: "👩‍🎨",
      name: "小雅",
      age: "22岁",
      title: "大学生 · 国风爱好者",
      tags: ["📕 文学专业", "🎵 喜欢国风音乐", "📱 偶尔逛小红书"],
      bgGradient: "from-red-50/30 to-orange-50/30",
      sectionTitle: "Think · Feel · Say · Do",
      quadrants: [
        { icon: "💭", label: "Think", text: "\"想了解传统文化，但不知道从哪开始\"" },
        { icon: "❤️", label: "Feel", text: "\"非遗很美但离我太远了，没有参与感\"" },
        { icon: "🗣️", label: "Say", text: "\"如果有简单的工具，我也想试试创作\"" },
        { icon: "📱", label: "Do", text: "\"刷到非遗内容会点赞收藏，很少主动传播\"" },
      ],
      path: [
        { icon: "🔍", label: "浏览案例" },
        { icon: "🚪", label: "进入遗墨" },
        { icon: "🤖", label: "AI生成纹样" },
        { icon: "✏️", label: "编辑优化" },
        { icon: "🚀", label: "发布作品" },
        { icon: "❤️", label: "获得点赞" },
      ],
      pathStyle: "pills", // compact | pills
    },
    {
      id: "creator",
      emoji: "🎨",
      name: "年轻创作者",
      age: "24岁",
      title: "插画师 · 数字艺术创作者",
      tags: ["🎨 Midjourney", "✏️ Figma", "🖌️ Photoshop"],
      bgGradient: "from-blue-50/30 to-purple-50/30",
      sectionTitle: "需求 · 痛点 · 价值",
      quadrants: [
        { icon: "🎯", label: "用户目标", text: "寻找创作灵感 · 快速生成设计 · 获得曝光" },
        { icon: "💡", label: "核心需求", text: "快速创作 / 表达自我 / 获得认可" },
        { icon: "⚡", label: "痛点", text: "灵感匮乏 · 素材零散 · 传播困难" },
        { icon: "💎", label: "平台价值", text: "AI创作系统 + 社区曝光" },
      ],
      path: [
        { icon: "🔍", label: "浏览案例" },
        { icon: "🚪", label: "进入遗墨" },
        { icon: "🤖", label: "AI生成纹样" },
        { icon: "✏️", label: "编辑优化" },
        { icon: "🚀", label: "发布作品" },
        { icon: "❤️", label: "获得点赞" },
      ],
      pathStyle: "pills", // compact | pills
    },
    {
      id: "enthusiast",
      emoji: "📖",
      name: "非遗爱好者",
      age: "35岁",
      title: "传统文化爱好者 · 收藏者 · 深度阅读用户",
      tags: ["📚 爱好文史", "🏛️ 逛博物馆", "📝 深度阅读"],
      bgGradient: "from-green-50/30 to-teal-50/30",
      sectionTitle: "目标 · 需求 · 痛点 · 价值",
      quadrants: [
        { icon: "🎯", label: "用户目标", text: "系统学习非遗 · 了解历史脉络 · 寻找优质内容" },
        { icon: "💡", label: "核心需求", text: "专业内容 / 真实性 / 深度知识" },
        { icon: "⚡", label: "痛点", text: "资料分散 · 真假难辨 · 内容浅层" },
        { icon: "💎", label: "平台价值", text: "非遗知识库" },
      ],
      path: [
        { icon: "🔍", label: "搜索项目" },
        { icon: "📖", label: "阅读详情" },
        { icon: "🎬", label: "观看工艺流程" },
        { icon: "💬", label: "参与讨论" },
        { icon: "👤", label: "关注传承人" },
      ],
      pathStyle: "pills",
      pathAlign: "left",
    },
    {
      id: "inheritor",
      emoji: "🧵",
      name: "非遗传承人",
      age: "55岁",
      title: "苏绣传承人 · 国家级非遗项目 · 数字化能力弱",
      tags: ["🧵 苏绣技艺", "🏆 国家级非遗", "📱 数字化能力弱"],
      bgGradient: "from-amber-50/30 to-orange-50/30",
      sectionTitle: "目标 · 需求 · 痛点 · 价值",
      quadrants: [
        { icon: "🎯", label: "用户目标", text: "传播技艺 · 吸引年轻人 · 培养学徒 · 提升影响力" },
        { icon: "💡", label: "核心需求", text: "展示自己 / 传播文化 / 培养下一代" },
        { icon: "⚡", label: "痛点", text: "不会运营 · 不会传播 · 年轻人太少" },
        { icon: "💎", label: "平台价值", text: "数字化传播工具" },
      ],
      path: [
        { icon: "🏠", label: "创建主页" },
        { icon: "🖼️", label: "上传作品" },
        { icon: "📹", label: "发布课程" },
        { icon: "🎙️", label: "参与直播" },
        { icon: "⭐", label: "获得关注" },
      ],
      pathStyle: "pills",
      pathAlign: "left",
    },
    {
      id: "education",
      emoji: "🏫",
      name: "教育机构",
      age: "—",
      title: "高校 · 博物馆 · 文化馆 · 研学机构",
      tags: ["🏛️ 高校", "🏛️ 博物馆", "📚 文化馆", "🎒 研学机构"],
      bgGradient: "from-sky-50/30 to-blue-50/30",
      sectionTitle: "目标 · 需求 · 痛点 · 价值",
      quadrants: [
        { icon: "🎯", label: "用户目标", text: "教学 · 研学 · 课程建设" },
        { icon: "💡", label: "核心需求", text: "优质内容 / 标准课程 / 教学工具" },
        { icon: "⚡", label: "痛点", text: "缺少数字资源" },
        { icon: "💎", label: "平台价值", text: "VR课程包" },
      ],
      path: [
        { icon: "🛒", label: "采购内容" },
        { icon: "📋", label: "组织活动" },
        { icon: "👩‍🎓", label: "学生体验" },
        { icon: "📐", label: "形成课程" },
      ],
      pathStyle: "pills",
      pathAlign: "left",
    },
    {
      id: "cultural-admin",
      emoji: "🏛️",
      name: "文化管理机构",
      age: "—",
      title: "文旅局 · 非遗保护中心 · 基金会",
      tags: ["🏛️ 文旅局", "🛡️ 非遗保护中心", "💰 基金会"],
      bgGradient: "from-slate-50/30 to-gray-50/30",
      sectionTitle: "目标 · 需求 · 痛点 · 价值",
      quadrants: [
        { icon: "🎯", label: "用户目标", text: "非遗保护 · 数据统计 · 传播效果评估" },
        { icon: "💡", label: "核心需求", text: "数据可视化 / 传播分析 / 项目管理" },
        { icon: "⚡", label: "痛点", text: "数据缺失 · 难量化" },
        { icon: "💎", label: "平台价值", text: "数据中台" },
      ],
      path: [
        { icon: "📊", label: "查看后台" },
        { icon: "📡", label: "监测项目" },
        { icon: "📈", label: "分析传播数据" },
        { icon: "📋", label: "制定政策" },
      ],
      pathStyle: "pills",
      pathAlign: "left",
    },
  ];

  return (
    <div className="space-y-10">
      {personas.map((persona, idx) => (
        <motion.div
          key={persona.id}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="border border-border rounded-2xl bg-card overflow-hidden"
        >
          {/*
            ─── 左右布局：左侧个人信息 + 右侧四象限 ───
          */}
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
                <span className="text-3xl">{persona.emoji}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground text-center md:text-left">
                {persona.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 text-center md:text-left">
                {persona.age} · {persona.title}
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
                {persona.sectionTitle}
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
              行为路径 · User Flow
            </p>

            {persona.pathStyle === "pills" ? (
              /* 小药丸风格 */
              <div className={`flex items-center w-full gap-1 ${persona.pathAlign === "left" ? "justify-start" : "justify-between"}`}>
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
            ) : (
              /* 紧凑风格（小雅） */
              <div className="flex items-center justify-center gap-0">
                {persona.path.map((step, i) => (
                  <span key={step.label} className="inline-flex items-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[0.55rem] font-medium text-foreground/70 whitespace-nowrap">
                      <span className="text-[0.65rem] leading-none">{step.icon}</span>
                      <span>{step.label}</span>
                    </span>
                    {i < persona.path.length - 1 && (
                      <span className="text-muted-foreground/15 text-xs shrink-0">→</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}

      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-base font-medium text-muted-foreground italic"
      >
        "用户并不缺少文化兴趣，而是缺少参与文化的机会。"
      </motion.p>
    </div>
  );
}

/* ================================================================
   6.2 Business Scenarios — 商业模式场景
   ================================================================ */
function BusinessScenariosSection() {
  const scenarios = [
    { icon: "\u{1F3E0}", title: "线上订阅", desc: "用户按月/年订阅平台内容，享受VR课程、AI创作工具、素材库等增值服务" },
    { icon: "\u{1F3AD}", title: "内容付费", desc: "传承人/创作者发布付费课程、工作坊，平台抽取分成，形成内容生态收入" },
    { icon: "\u{1F3DB}\u{FE0F}", title: "B端服务", desc: "为博物馆、学校、文旅机构提供VR内容定制、数字化解决方案及培训服务" },
    { icon: "\u{1F4C8}", title: "数据增值", desc: "非遗传播数据洞察、趋势报告等数据产品，服务文化管理机构和企业品牌方" },
  ];
  return (
    <div className="space-y-6">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-base text-muted-foreground max-w-2xl mx-auto"
      >
        基于平台核心能力，构建多元化收入模型，形成可持续的商业闭环
      </motion.p>
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {scenarios.map((s) => (
          <motion.div
            key={s.title}
            variants={fadeUp}
            className="p-5 border border-border rounded-xl bg-card hover:shadow-md transition-all"
          >
            <span className="text-2xl block mb-3">{s.icon}</span>
            <h3 className="text-sm font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-[0.7rem] text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ================================================================
   6.3 Growth Strategy — 增长策略
   ================================================================ */
function GrowthStrategySection() {
  const nodes = [
    { label: "沉浸体验", emoji: "\u{1F97D}", desc: "VR内容持续吸引新用户" },
    { label: "创作表达", emoji: "✏️", desc: "UGC激发参与感与归属感" },
    { label: "社区分享", emoji: "\u{1F465}", desc: "社交裂变带来自然增长" },
    { label: "传播扩散", emoji: "\u{1F4E1}", desc: "新用户涌入形成规模效应" },
  ];
  const strategies = [
    { label: "冷启动", items: ["KOL合作引流", "首批VR体验内容", "非遗IP联名"] },
    { label: "增长期", items: ["AI创作裂变", "社区激励计划", "社交媒体传播"] },
    { label: "成熟期", items: ["B端企业合作", "国际化拓展", "线下体验店"] },
  ];

  return (
    <div className="space-y-10">
      {/* 飞轮模型 */}
      <div className="space-y-6">
        <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-5 text-center">
          增长飞轮 / Growth Flywheel
        </p>
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {nodes.map((node) => (
            <motion.div
              key={node.label}
              variants={fadeUp}
              className="text-center p-4 border border-border rounded-xl bg-card hover:shadow-md transition-all"
            >
              <span className="text-2xl block mb-2">{node.emoji}</span>
              <p className="text-sm font-bold text-foreground">{node.label}</p>
              <p className="text-[0.55rem] text-muted-foreground mt-1 leading-relaxed">{node.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="flex justify-center items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            沉浸体验 → 创作表达 → 社区分享 → 传播扩散
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          </span>
          <span className="text-red-500 font-semibold">↻</span>
        </div>
      </div>

      {/* 分阶段策略 */}
      <div>
        <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-5 text-center">
          分阶段策略 / Growth Phases
        </p>
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-4"
        >
          {strategies.map((phase) => (
            <motion.div
              key={phase.label}
              variants={fadeUp}
              className="p-5 border border-border rounded-xl bg-card"
            >
              <h3 className="text-sm font-bold text-foreground mb-3">{phase.label}</h3>
              <ul className="space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-foreground/30 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ================================================================
   12. Metrics Framework — 条形图（Linear 风格）
   ================================================================ */
function MetricBar({ label, value, pct, color = "bg-foreground" }: {
  label?: string;
  value?: string;
  pct?: number;
  color?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <p className="text-[0.5rem] text-muted-foreground">{pct}% 权重</p>
    </div>
  );
}

function MetricChart() {
  const metrics = [
    { label: "Acquisition 获取", value: "85", pct: 85, color: "bg-blue-500" },
    { label: "Activation 激活", value: "72", pct: 72, color: "bg-emerald-500" },
    { label: "Retention 留存", value: "68", pct: 68, color: "bg-amber-500" },
    { label: "Referral 推荐", value: "91", pct: 91, color: "bg-purple-500" },
    { label: "Revenue 收入", value: "45", pct: 45, color: "bg-rose-500" },
  ];
  return (
    <div className="space-y-6">
      {/* North Star */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="p-6 border-2 border-red-500/20 rounded-xl bg-gradient-to-br from-red-500/5 to-orange-500/5 text-center"
      >
        <p className="text-[0.55rem] font-bold text-muted-foreground uppercase tracking-widest">North Star Metric</p>
        <p className="text-lg font-bold text-foreground mt-1">VR体验完成率 × UGC创作率</p>
        <p className="text-xs text-muted-foreground mt-1">驱动平台长期增长的核心指标</p>
      </motion.div>

      {/* AARRR 条形图 */}
      <div className="p-6 border border-border rounded-xl bg-card space-y-5">
        <p className="text-xs font-bold text-foreground uppercase tracking-wider">AARRR 海盗指标权重</p>
        {metrics.map((m) => (
          <MetricBar key={m.label} {...m} />
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   13. Business Model Canvas — 九宫格
   ================================================================ */
function BusinessModelCanvas() {
  const blocks = [
    { label: "Key Partners", title: "关键合作", desc: "非遗传承人、文化机构、VR设备商" },
    { label: "Key Activities", title: "核心活动", desc: "内容数字化、平台运营、社区维护" },
    { label: "Value Proposition", title: "价值主张", desc: "沉浸式非遗体验、零门槛创作工具" },
    { label: "Customer Relationship", title: "客户关系", desc: "社区运营、会员体系、创作者激励" },
    { label: "Customer Segment", title: "客户细分", desc: "文化爱好者、年轻用户、教育机构" },
    { label: "Key Resources", title: "核心资源", desc: "数字化团队、VR技术、非遗IP资源" },
    { label: "Channels", title: "渠道通路", desc: "线上平台、线下体验店、社交媒体" },
    { label: "Cost Structure", title: "成本结构", desc: "内容制作、技术开发、运营推广" },
    { label: "Revenue Streams", title: "收入来源", desc: "会员订阅、内容付费、广告与服务" },
  ];
  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
    >
      {blocks.map((block) => (
        <motion.div
          key={block.label}
          variants={fadeUp}
          className="p-3 md:p-4 border border-border rounded-xl bg-card hover:shadow-sm transition-shadow"
        >
          <p className="text-[0.55rem] font-bold text-foreground uppercase tracking-wider mb-1.5">{block.label}</p>
          <p className="text-[0.65rem] font-medium text-foreground mb-1">{block.title}</p>
          <p className="text-[0.6rem] text-muted-foreground leading-relaxed">{block.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ================================================================
   14. Roadmap — 路线图
   ================================================================ */
function Roadmap() {
  const phases = [
    { label: "用户研究", en: "Research", desc: "需求调研、竞品分析", icon: "🔍" },
    { label: "产品设计", en: "Design", desc: "交互原型、视觉方案", icon: "🎨" },
    { label: "内容建设", en: "Content", desc: "非遗数字化、素材库", icon: "📦" },
    { label: "平台上线", en: "Launch", desc: "MVP开发、用户测试", icon: "🚀" },
    { label: "生态拓展", en: "Growth", desc: "社区运营、商业模式", icon: "🌱" },
  ];
  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <div className="relative pt-8">
        <div className="absolute top-10 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-red-200 via-red-400 to-red-200 rounded-full hidden md:block" />
        <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.label}
              variants={fadeUp}
              className="flex md:flex-col items-center gap-3 md:gap-2 relative z-10"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center text-base shadow-md shrink-0">
                {phase.icon}
              </div>
              <div className="text-center md:text-center">
                <p className="text-sm font-semibold text-foreground">{phase.label}</p>
                <p className="text-[0.5rem] text-muted-foreground tracking-wider uppercase">{phase.en}</p>
                <p className="text-[0.55rem] text-muted-foreground mt-0.5">{phase.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   7.2 Future Scenarios — 未来发展场景
   ================================================================ */
function FutureScenariosSection() {
  const scenarios = [
    {
      icon: "\u{1F3DB}\u{FE0F}",
      title: "Digital Museum",
      cn: "数字博物馆",
      tag: "Scenario 01",
      desc: "遗墨作为数字文化平台，可与博物馆共同构建线上线下一体化展览。用户在实体展馆参观后，可继续通过VR深入了解文物制作工艺、观看数字复原过程、参与互动体验、收藏数字展品。",
      flow: ["Museum", "Digital Exhibition", "VR Experience", "Continuous Learning"],
      note: "这与UNESCO推动的数字文化项目方向一致，即利用数字平台、三维建模、虚拟展览等方式扩大文化遗产的可达性和传播范围。",
    },
    {
      icon: "\u{1F9F3}",
      title: "Cultural Tourism",
      cn: "智慧文旅",
      tag: "Scenario 02",
      desc: "未来平台不仅服务文化传播，还可以成为景区导览、非遗体验馆、城市文化路线的核心载体。游客在旅行前通过VR预体验，旅行中使用AR导览，旅行后获取数字纪念品，形成完整旅游闭环。",
      flow: ["Pre-trip: VR Preview", "On-site: AR Guide", "Post-trip: Digital Souvenir"],
      note: "",
    },
    {
      icon: "\u{1F393}",
      title: "Education Platform",
      cn: "数字教育",
      tag: "Scenario 03",
      desc: "遗墨可以作为学校、高校、职业教育及研学课程的数字教材平台。教师发布课程，学生通过VR体验、作品创作、课堂讨论完成从学习到实践的完整链路。",
      flow: ["Learn", "Practice", "Create", "Share"],
      note: "",
    },
    {
      icon: "\u{1F4B0}",
      title: "Creator Economy",
      cn: "创作者生态",
      tag: "Scenario 04",
      desc: "未来平台逐渐开放AI辅助设计、UGC创作、数字版权、数字商品及商业授权，形成完整的创作者经济生态。这与平台交易手续费、版权授权和增值服务等盈利模式保持一致。",
      flow: ["AI Design", "UGC Creation", "Digital Rights", "Commerce", "License"],
      note: "",
    },
    {
      icon: "\u{1F916}",
      title: "AI + XR Heritage Platform",
      cn: "AI+XR文化遗产平台",
      tag: "Scenario 05",
      desc: "未来加入AI Agent、XR、数字人等技术，实现AI讲解、AI修复、AI共创、个性化推荐等智能化文化体验。从单纯的数字展示转向智能化、交互式文化体验。",
      flow: ["AI Guide", "AI Restoration", "AI Co-creation", "Personalization"],
      note: "",
    },
  ];

  return (
    <div className="space-y-10">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-base text-muted-foreground max-w-3xl mx-auto"
      >
        如果"遗墨"持续发展，它未来会演变成什么？从产品应用场景出发，勾勒平台的长期演化方向
      </motion.p>

      {scenarios.map((s, idx) => (
        <motion.div
          key={s.title}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="border border-border rounded-2xl bg-card overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* 左侧标签区 */}
            <div className="md:w-[200px] shrink-0 p-6 md:p-8 bg-gradient-to-br from-muted to-background border-r-0 md:border-r border-border flex flex-col items-center md:items-start justify-center text-center md:text-left">
              <span className="text-[0.55rem] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-2">{s.tag}</span>
              <span className="text-3xl mb-3">{s.icon}</span>
              <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{s.cn}</p>
            </div>

            {/* 右侧内容区 */}
            <div className="flex-1 p-6 md:p-8 space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>

              {/* Digital Museum 示意图 — 仅 Scenario 01 */}
              {s.title === "Digital Museum" && (
                <div className="rounded-xl overflow-hidden border border-border">
                  <img
                    src={localImages.digitalMuseum}
                    alt="Digital Museum 数字博物馆 — 示意图"
                    className="w-full h-auto"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
              )}

              {/* 流程箭头 */}
              <div className="flex flex-wrap items-center gap-1.5">
                {s.flow.map((step, i) => (
                  <span key={step} className="inline-flex items-center gap-1">
                    <span className="px-3 py-1.5 text-[0.6rem] font-medium bg-muted rounded-lg border border-border text-foreground">
                      {step}
                    </span>
                    {i < s.flow.length - 1 && (
                      <span className="text-muted-foreground/30 text-sm">→</span>
                    )}
                  </span>
                ))}
              </div>

              {s.note && (
                <div className="p-4 bg-blue-50/50 border border-blue-200/30 rounded-xl">
                  <p className="text-[0.65rem] text-blue-700 leading-relaxed">{s.note}</p>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      ))}

      {/* Core Vision */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="p-8 border-2 border-foreground/10 rounded-2xl bg-gradient-to-br from-foreground/5 to-muted text-center"
      >
        <p className="text-[0.55rem] font-bold text-muted-foreground uppercase tracking-widest">Core Vision</p>
        <p className="text-xl md:text-2xl font-bold text-foreground mt-3 leading-snug">
          从一个VR非遗体验平台 <br />
          <span className="text-muted-foreground">走向智能化的文化创新生态。</span>
        </p>
      </motion.div>
    </div>
  );
}

/* ================================================================
   7.3 Market Position — 市场定位
   ================================================================ */
function MarketPositionSection() {
  const competitors = [
    { name: "传统博物馆", immersion: 30, depth: 60 },
    { name: "短视频平台", immersion: 20, depth: 15 },
    { name: "在线课程", immersion: 15, depth: 70 },
    { name: "文旅APP", immersion: 40, depth: 35 },
    { name: "遗墨", immersion: 90, depth: 95 },
  ];

  const capabilities = [
    { label: "沉浸体验", score: 5 },
    { label: "非遗专业性", score: 5 },
    { label: "UGC生态", score: 4 },
    { label: "社区互动", score: 4 },
    { label: "数字版权", score: 4 },
    { label: "教育价值", score: 5 },
    { label: "商业扩展", score: 4 },
  ];

  return (
    <div className="space-y-12">
      {/* Part 1: Market Positioning — 二维坐标 */}
      <div>
        <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-6 text-center">
          Market Positioning — 体验深度 × 文化深度
        </p>

        {/* 二维坐标图 — 纯CSS绘制 */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-xl mx-auto p-6 border border-border rounded-2xl bg-card"
        >
          {/* 坐标轴容器 */}
          <div className="relative" style={{ aspectRatio: "1/1" }}>
            {/* Y轴标签 */}
            <span className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[0.5rem] text-muted-foreground tracking-wider whitespace-nowrap">
              文化深度 Content Depth →
            </span>
            {/* X轴标签 */}
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[0.5rem] text-muted-foreground tracking-wider whitespace-nowrap">
              体验深度 Immersion →
            </span>

            {/* 坐标网格 */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* 背景网格线 */}
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.3" className="text-border" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-border" />
              {/* 箭头 */}
              <line x1="0" y1="100" x2="100" y2="100" stroke="currentColor" strokeWidth="1" className="text-foreground/30" />
              <line x1="0" y1="100" x2="0" y2="0" stroke="currentColor" strokeWidth="1" className="text-foreground/30" />
              {/* 箭头头部 */}
              <polygon points="100,100 95,97 95,103" fill="currentColor" className="text-foreground/30" />
              <polygon points="0,0 3,5 -3,5" fill="currentColor" className="text-foreground/30" />
            </svg>

            {/* 数据点 */}
            {competitors.map((c) => (
              <div
                key={c.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  left: `${c.immersion}%`,
                  top: `${100 - c.depth}%`,
                }}
              >
                <div className={`w-3 h-3 rounded-full border-2 ${
                  c.name === "遗墨"
                    ? "bg-red-500 border-red-500 shadow-lg shadow-red-500/30"
                    : "bg-muted border-foreground/20"
                }`} />
                <span className={`absolute left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap text-[0.5rem] font-bold tracking-wider ${
                  c.name === "遗墨" ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {c.name}
                </span>
              </div>
            ))}

            {/* 右上角标注 */}
            <div className="absolute top-2 right-2 text-[0.45rem] text-red-500 font-bold tracking-wider opacity-60">
              SWEET SPOT
            </div>
          </div>

          <div className="mt-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50/80 border border-red-200/30 text-[0.6rem] font-bold text-red-700 tracking-wider">
              HIGH CONTENT · HIGH IMMERSION
            </span>
            <p className="text-xs text-muted-foreground mt-3">遗墨占据「高文化深度 × 高体验深度」的战略位置</p>
          </div>
        </motion.div>
      </div>

      {/* Part 2: Competitive Advantage — 能力评估 */}
      <div>
        <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-6 text-center">
          Competitive Advantage — 核心能力评估
        </p>
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-md mx-auto space-y-3"
        >
          {capabilities.map((cap) => (
            <motion.div
              key={cap.label}
              variants={fadeUp}
              className="flex items-center gap-4"
            >
              <span className="text-xs font-medium text-foreground w-20 shrink-0 text-right">{cap.label}</span>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600"
                  style={{ width: `${(cap.score / 5) * 100}%` }}
                />
              </div>
              <span className="text-[0.55rem] font-bold text-muted-foreground w-10 shrink-0">
                {'★'.repeat(cap.score)}{'☆'.repeat(5 - cap.score)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Part 3: Strategic Position */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="p-6 border border-foreground/10 rounded-xl bg-gradient-to-br from-background to-muted text-center max-w-3xl mx-auto"
      >
        <p className="text-[0.55rem] font-bold text-muted-foreground uppercase tracking-widest">Strategic Position</p>
        <p className="text-base font-bold text-foreground mt-3 leading-snug">
          遗墨定位不是一个 VR 应用，而是一个连接文化内容、数字体验与创作者生态的文化科技平台
        </p>
      </motion.div>

      {/* Part 4: Competitive Moat — 三层金字塔 */}
      <div>
        <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-6 text-center">
          Long-term Competitive Moat — 竞争壁垒
        </p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-md mx-auto space-y-0"
        >
          {/* 第三层：应用层 */}
          <div className="p-5 border-2 border-border/80 rounded-t-2xl bg-card text-center">
            <p className="text-[0.5rem] font-bold text-muted-foreground uppercase tracking-widest mb-1">Application Layer</p>
            <p className="text-xs text-foreground">VR / AI / Community</p>
          </div>
          {/* 第二层：平台层 */}
          <div className="p-5 border-x-2 border-b-2 border-border/80 bg-muted text-center -mt-px">
            <p className="text-[0.5rem] font-bold text-muted-foreground uppercase tracking-widest mb-1">Platform Layer</p>
            <p className="text-xs text-foreground">UGC / Recommendation / Social</p>
          </div>
          {/* 第一层：文化资产层 */}
          <div className="p-5 border-x-2 border-b-2 border-border/80 bg-gradient-to-br from-red-50/30 to-orange-50/30 text-center -mt-px rounded-b-2xl">
            <p className="text-[0.5rem] font-bold text-red-700 uppercase tracking-widest mb-1">Cultural Asset Layer</p>
            <p className="text-xs text-foreground font-medium">非遗数字内容</p>
          </div>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground mt-5 italic max-w-xl mx-auto"
        >
          真正的竞争优势并非 VR 技术本身，而是持续积累的文化内容资产、创作者生态和平台网络效应
        </motion.p>
      </div>
    </div>
  );
}

/* ================================================================
   4. Current Solutions — 现有方案评估
   ================================================================ */
function CurrentSolutions() {
  const solutions = [
    { icon: "\u{1F3DB}️", title: "博物馆展览", desc: "线下实体展览为主，受地域和时间限制，覆盖范围有限，缺乏数字互动体验" },
    { icon: "\u{1F310}", title: "在线平台", desc: "非遗内容分散在视频/图文平台，缺乏垂直整合与沉浸式体验" },
    { icon: "\u{1F3AD}", title: "文旅活动", desc: "节庆式活动为主，缺乏持续性和用户粘性，难以形成长期影响力" },
    { icon: "\u{1F4F1}", title: "文化APP", desc: "现有非遗APP多以信息展示为主，互动性和创作参与度不足" },
  ];
  const gaps = [
    "内容供给：传统模式封闭单一，无法规模化增长",
    "传播效率：缺少智能推荐和精准分发，优质内容难被发现",
    "用户参与：单向观看为主，缺乏互动机制和沉浸式体验",
    "留存机制：无长效激励体系，用户复访率低",
  ];
  return (
    <div className="space-y-8">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-base text-muted-foreground max-w-2xl mx-auto"
      >
        当前非遗体验数字化方案存在明显短板，未能真正解决文化传播与用户体验的核心问题
      </motion.p>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <ImageWithFallback src={localImages.vrCmp} alt="VR竞品矩阵分析图" className="w-full rounded-xl" />
      </motion.div>
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-4"
      >
        {solutions.map((s) => (
          <motion.div
            key={s.title}
            variants={fadeUp}
            className="p-5 border border-border rounded-xl bg-card hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">{s.icon}</span>
              <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      <div className="border-t border-border pt-6">
        <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-4 text-center">核心差距</p>
        <div className="grid md:grid-cols-2 gap-3">
          {gaps.map((g) => (
            <div key={g} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {g}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   4.2 产品架构 — Product Blueprint（5层系统模型｜中文完整版）
   ================================================================ */
function ProductPositioningSection() {
  return (
    <div>
      <SectionDivider label="产品架构 / PRODUCT ARCHITECTURE" />

      {/* 架构图 */}
      <motion.div variants={fadeUp} className="mb-12">
        <div className="rounded-2xl border border-border overflow-hidden bg-white">
          <ImageWithFallback
            src={localImages.vrPlatformArchitecture}
            alt="系统架构图"
            className="w-full"
          />
        </div>

        <p className="text-center text-sm text-muted-foreground tracking-widest uppercase mt-6">
          系统架构概览 · 五层模型
        </p>
      </motion.div>

      {/* 产品定义 */}
      <div className="mb-12">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center">
          本产品是一个文化智能平台，通过VR沉浸体验、UGC内容创作与AI驱动推荐系统，
          重构非遗文化的生产、体验与传播方式。
        </p>
      </div>

      {/* =========================
          五层系统架构
         ========================= */}

      <div className="space-y-6">

        {/* ① 体验层 */}
        <motion.div variants={fadeUp} className="border rounded-2xl p-6 bg-white">
          <div className="text-sm tracking-widest text-muted-foreground mb-2">
            第01层
          </div>
          <h3 className="text-lg font-medium mb-2">
            体验层 · Experience Layer
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            用户直接接触的沉浸式交互空间
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-gray-100 rounded-full">VR沉浸体验</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">UGC创作界面</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">社交互动空间</span>
          </div>
        </motion.div>

        {/* ② 应用层 */}
        <motion.div variants={fadeUp} className="border rounded-2xl p-6 bg-white">
          <div className="text-sm tracking-widest text-muted-foreground mb-2">
            第02层
          </div>
          <h3 className="text-lg font-medium mb-2">
            应用层 · Application Layer
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            支撑核心功能运行的系统能力层
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-gray-100 rounded-full">VR引擎系统</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">内容创作系统</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">社区互动系统</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">场景管理系统</span>
          </div>
        </motion.div>

        {/* ③ 内容层 */}
        <motion.div variants={fadeUp} className="border rounded-2xl p-6 bg-white">
          <div className="text-sm tracking-widest text-muted-foreground mb-2">
            第03层
          </div>
          <h3 className="text-lg font-medium mb-2">
            内容层 · Content Layer
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            非遗文化资产与UGC内容的统一组织体系
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-gray-100 rounded-full">非遗文化数据库</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">3D文化资产</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">展览内容库</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">用户生成内容UGC</span>
          </div>
        </motion.div>

        {/* ④ 智能层 */}
        <motion.div variants={fadeUp} className="border rounded-2xl p-6 bg-white">
          <div className="text-sm tracking-widest text-muted-foreground mb-2">
            第04层
          </div>
          <h3 className="text-lg font-medium mb-2">
            智能层 · Intelligence Layer
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            AI驱动的内容理解与个性化推荐系统
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-gray-100 rounded-full">AI推荐系统</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">AIGC内容生成</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">语义标签系统</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">文化知识图谱</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">智能搜索系统</span>
          </div>
        </motion.div>

        {/* ⑤ 基础设施层 */}
        <motion.div variants={fadeUp} className="border rounded-2xl p-6 bg-white">
          <div className="text-sm tracking-widest text-muted-foreground mb-2">
            第05层
          </div>
          <h3 className="text-lg font-medium mb-2">
            基础设施层 · Infrastructure Layer
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            支撑系统运行的底层能力
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-gray-100 rounded-full">用户认证系统</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">权限管理系统</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">数据存储系统</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">行为分析系统</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">资产管理系统</span>
          </div>
        </motion.div>

      </div>

      {/* 系统总结 */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          本架构采用五层系统设计模型：体验层 → 应用层 → 内容层 → 智能层 → 基础设施层，
          构建一个以文化资产为核心、AI驱动的沉浸式文化智能系统。
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   4.1 Design Thinking — 设计方法（五步法）
   ================================================================ */
function DesignThinkingSection() {
  const dtSteps = [
    { name: "Empathize", cn: "共情", desc: "深入理解用户需求" },
    { name: "Define", cn: "定义", desc: "聚焦核心问题" },
    { name: "Ideate", cn: "构思", desc: "发散解决方案" },
    { name: "Prototype", cn: "原型", desc: "快速可视化方案" },
    { name: "Test", cn: "测试", desc: "验证与迭代优化" },
  ];
  return (
    <div>
      <SectionDivider label="设计方法 / DESIGN THINKING" />
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex justify-center flex-wrap gap-4 md:gap-6"
      >
        {dtSteps.map((step, i) => (
          <motion.div
            key={step.name}
            variants={fadeUp}
            className="flex flex-col items-center gap-2 w-28 md:w-32"
          >
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/20 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{i + 1}</span>
              </div>
              {i < dtSteps.length - 1 && (
                <span className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">→</span>
              )}
            </div>
            <p className="text-sm font-bold text-foreground">{step.name}</p>
            <p className="text-[0.6rem] text-muted-foreground -mt-1">{step.cn}</p>
            <p className="text-[0.55rem] text-muted-foreground text-center">{step.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ================================================================
   4.4 Information Architecture — 信息架构
   ================================================================ */
function InformationArchitectureSection() {
  const iaColumns = [
    { title: "\u{1F97D} 遗境", items: ["VR场景体验", "工艺学习工坊", "沉浸式导览", "互动教学"] },
    { title: "✏️ 遗墨", items: ["非遗素材库", "AI辅助设计", "作品生成器", "模板系统"] },
    { title: "\u{1F465} 遗踪", items: ["作品发布", "社区讨论区", "关注与互动", "数据分析"] },
  ];
  return (
    <div>
      <SectionDivider label="信息架构 / INFORMATION ARCHITECTURE" />
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-5"
      >
        {iaColumns.map((col) => (
          <motion.div
            key={col.title}
            variants={fadeUp}
            className="border border-border rounded-xl p-5 md:p-6 bg-card hover:shadow-sm transition-shadow"
          >
            <h3 className="text-base font-bold text-foreground mb-5 tracking-tight">{col.title}</h3>
            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ================================================================
   4.5 User Flow — 用户流程
   ================================================================ */
function UserFlowSection() {
  const flowSteps = [
    { icon: "\u{1F4F1}", label: "打开平台", desc: "进入遗墨首页" },
    { icon: "\u{1F9ED}", label: "发现非遗", desc: "浏览推荐内容" },
    { icon: "\u{1F97D}", label: "进入VR", desc: "沉浸式体验" },
    { icon: "✏️", label: "设计创作", desc: "AI辅助生成" },
    { icon: "\u{1F680}", label: "发布分享", desc: "社区互动传播" },
  ];
  return (
    <div>
      <SectionDivider label="用户流程 / USER FLOW" />
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2"
      >
        {flowSteps.map((step, i) => (
          <span key={step.label} className="inline-flex items-center gap-2">
            <motion.div
              variants={fadeUp}
              className="group flex flex-col items-center gap-1.5 p-4 border border-border rounded-xl bg-card hover:shadow-md hover:border-foreground/20 transition-all min-w-[100px]"
            >
              <span className="text-2xl">{step.icon}</span>
              <span className="text-xs font-bold text-foreground">{step.label}</span>
              <span className="text-[0.5rem] text-muted-foreground">{step.desc}</span>
            </motion.div>
            {i < flowSteps.length - 1 && (
              <span className="hidden md:block text-muted-foreground text-xl">→</span>
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ================================================================
   4.6 Homepage Showcase — 首页展示（产品功能设计章节内）
   ================================================================ */
function HomepageShowcaseSection() {
  return (
    <div className="mb-10">
      {/* 文字信息移到卡片外部 */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🏠</span>
        <div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">遗墨平台 · 网站首页</h3>
          <p className="text-sm text-muted-foreground">平台门户首页 / 产品总入口</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {["平台概览", "产品入口", "品牌展示"].map((f) => (
          <span key={f} className="px-3 py-1 text-[0.6rem] font-medium bg-muted rounded-full text-muted-foreground">{f}</span>
        ))}
      </div>
      {/* 卡片只包含图像 */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="rounded-2xl overflow-y-auto" style={{ aspectRatio: "16/9" }}>
          <ImageWithFallback src={localImages.vrHomepage} alt="遗墨平台网站首页" className="w-full" />
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================
   9. VR Experience — VR沉浸体验模块展示
   ================================================================ */
function VRExperienceSection({ onImageClick }: { onImageClick?: (index: number) => void }) {
  return (
    <div className="space-y-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-8 items-center"
      >
        <div className="space-y-4">
          <span className="text-4xl">{'\u{1F97D}'}</span>
          <h3 className="text-xl font-bold text-foreground tracking-tight">遗境 · 360° 沉浸式体验</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            通过 VR 技术打造非遗文化沉浸式体验场景。用户在虚拟空间中近距离学习传统工艺，
            感受非遗技艺的每一个细节，打破物理空间的限制。
          </p>
          <div className="flex flex-wrap gap-2">
            {["360°全景", "工艺学习", "沉浸导览", "互动教学"].map((tag) => (
              <span key={tag} className="px-3 py-1 text-[0.6rem] font-medium bg-muted rounded-full text-muted-foreground">{tag}</span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border cursor-pointer" onClick={() => onImageClick?.(0)}>
          <ImageWithFallback
            src={localImages.vrExperience2}
            alt="遗境 VR 沉浸式体验界面"
            className="w-full h-full object-cover"
            style={{ aspectRatio: "3/2" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================
   5.2 UGC Creation System — UGC创作系统
   ================================================================ */
function UGCSection({ onImageClick }: { onImageClick?: (index: number) => void }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid md:grid-cols-2 gap-8 items-center"
    >
      <div className="overflow-hidden rounded-2xl border border-border order-last md:order-none cursor-pointer" onClick={() => onImageClick?.(0)}>
        <ImageWithFallback
          src={localImages.vrUgcDesign}
          alt="遗墨 AI 辅助创作界面"
          className="w-full object-contain"
        />
      </div>
      <div className="space-y-4 order-first md:order-last">
        <span className="text-4xl">✏️</span>
        <h3 className="text-xl font-bold text-foreground tracking-tight">遗墨 · AI辅助创作</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          提供 AI 辅助内容创作工具，结合非遗元素与现代设计语言。用户无需专业技能即可
          创作具有非遗风格的数字作品，让每个人都能成为文化传承的参与者。
        </p>
        <div className="flex flex-wrap gap-2">
          {["AI辅助设计", "非遗素材库", "SVG导出", "模板系统"].map((tag) => (
            <span key={tag} className="px-3 py-1 text-[0.6rem] font-medium bg-muted rounded-full text-muted-foreground">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   5.3 Community — 社区生态
   ================================================================ */
function CommunitySection({ onImageClick }: { onImageClick?: (index: number) => void }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid md:grid-cols-2 gap-8 items-center"
    >
      <div className="space-y-4">
        <span className="text-4xl">{'\u{1F465}'}</span>
        <h3 className="text-xl font-bold text-foreground tracking-tight">遗踪 · 创作者社区</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          连接创作者与文化爱好者的开放社区。用户可发布作品、交流心得、参与共创。
          社区机制形成自传播循环，让非遗文化在互动中焕发新生。
        </p>
        <div className="flex flex-wrap gap-2">
          {["作品发布", "互动讨论", "创作者激励", "数据分析"].map((tag) => (
            <span key={tag} className="px-3 py-1 text-[0.6rem] font-medium bg-muted rounded-full text-muted-foreground">{tag}</span>
          ))}
        </div>
      </div>
      <div className="overflow-y-auto rounded-2xl border border-border cursor-pointer" style={{ aspectRatio: "3/2" }} onClick={() => onImageClick?.(1)}>
        <ImageWithFallback
          src={localImages.vrCommunity}
          alt="遗踪创作者社区界面"
          className="w-full"
        />
      </div>
    </motion.div>
  );
}

/* ================================================================
   8.1 Project Reflection — 项目总结反思
   ================================================================ */
function ProjectReflectionSection() {
  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid md:grid-cols-3 gap-6"
    >
      <motion.div
        variants={fadeUp}
        className="p-6 border border-green-500/30 rounded-xl bg-green-50/50"
      >
        <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-4">✓ What Worked</h3>
        <ul className="space-y-3 text-sm text-green-800">
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>VR体验提高文化理解，沉浸式学习效果显著</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>UGC提高参与度，用户从观众变为创作者</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>社区机制形成传播，用户自传播降低获客成本</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="p-6 border border-yellow-500/30 rounded-xl bg-yellow-50/50"
      >
        <h3 className="text-sm font-bold text-yellow-700 uppercase tracking-wider mb-4">⚡ Trade-offs</h3>
        <ul className="space-y-3 text-sm text-yellow-800">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">⚡</span>
            <span>沉浸质量 vs 设备门槛：高质量VR体验需要高性能设备，可能降低用户覆盖</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">⚡</span>
            <span>AI效率 vs 文化准确性：AI辅助创作可能简化文化符号，需人工审核保真</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">⚡</span>
            <span>社区活跃 vs 内容质量：降低门槛促进参与，但也可能稀释优质内容比例</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="p-6 border border-blue-500/30 rounded-xl bg-blue-50/50"
      >
        <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-4">→ Lessons Learned</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <p>内容生态是核心——技术只是工具，真正驱动用户参与的是有吸引力的内容质量和社区氛围。AI辅助创作能力应优先建设，以降低内容创作门槛。</p>
          <div className="pt-3 border-t border-blue-200/50 space-y-2">
            <span className="text-xs text-blue-600 block">关键经验：</span>
            <ul className="space-y-1.5 text-xs text-blue-700">
              <li className="flex items-start gap-1.5"><span className="text-blue-600">•</span>先做沉浸体验验证 PMF，再扩展社区生态</li>
              <li className="flex items-start gap-1.5"><span className="text-blue-600">•</span>合作关系（传承人/机构）是差异化护城河</li>
              <li className="flex items-start gap-1.5"><span className="text-blue-600">•</span>非遗数字化标准需尽早建立，避免碎片化</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   Background — 项目背景
   ================================================================ */
function BackgroundSection() {
  return (
    <div className="space-y-8">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-lg text-muted-foreground leading-relaxed text-left"
      >
        非遗（非物质文化遗产）承载着中华民族的文化基因，但在数字化时代面临传承断代、
        大众认知度低、传播渠道弱、产业链缺失等挑战。VR 技术的成熟为非遗的沉浸式传播
        提供了新的可能，AI 辅助创作工具则降低了用户参与的门槛。
      </motion.p>
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-4"
      >
        <Card
          title="政策背景"
          desc="国家大力推进文化数字化战略，非遗保护与传播成为文化强国建设的重要组成部分，政策红利持续释放"
        />
        <Card
          title="技术背景"
          desc="VR/AR 技术日趋成熟，5G 普及为沉浸式体验提供基础设施，AI 辅助创作工具快速发展，降低了内容生产成本"
        />
        <Card
          title="市场背景"
          desc="Z 世代对国潮文化的兴趣持续升温，沉浸式体验消费需求快速增长，用户对文化参与的需求从‘观看’转向‘共创’"
        />
      </motion.div>

      {/* 机会框架图 */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <ImageWithFallback src={localImages.vrChart} alt="机会框架分析图" className="w-full rounded-xl" />
      </motion.div>
    </div>
  );
}
/* ================================================================
   1.3 Market Analysis — 市场分析
   ================================================================ */
function MarketAnalysisSection() {
  const trends = [
    { icon: "\u{1F4C8}", title: "文化数字化", desc: "国家文化数字化战略推动非遗数字化建设，2025年文化产业数字化规模预计突破3万亿元" },
    { icon: "\u{1F97D}", title: "VR普及化", desc: "VR头显出货量年增35%，沉浸式体验已从 niche 走向主流消费场景" },
    { icon: "\u{1F3AF}", title: "国潮年轻化", desc: "Z世代国潮消费占比达65%，文化自信驱动「新中式」生活方式成为趋势" },
    { icon: "\u{1F4F1}", title: "内容共创化", desc: "UGC平台用户年均创作内容增长40%，AI工具进一步降低了创作门槛" },
  ];

  const targetAudiences = [
    { icon: "\u{1F9D1}\u{200D}\u{1F393}", label: "年轻用户", desc: "Z世代国潮爱好者、内容创作者", pct: "48%" },
    { icon: "\u{1F3DB}\u{FE0F}", label: "文化从业者", desc: "非遗传承人、博物馆、文化机构", pct: "22%" },
    { icon: "\u{1F3EB}", label: "教育机构", desc: "高校、研学机构、文化教育平台", pct: "18%" },
    { icon: "\u{1F3C6}", label: "产业端", desc: "文旅企业、品牌方、文创开发者", pct: "12%" },
  ];

  return (
    <div className="space-y-10">
      {/* 行业趋势 */}
      <div>
        <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-5 text-center">
          行业趋势 / Industry Trends
        </p>
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {trends.map((t) => (
            <motion.div
              key={t.title}
              variants={fadeUp}
              className="p-5 border border-border rounded-xl bg-card hover:shadow-md transition-all"
            >
              <span className="text-2xl block mb-3">{t.icon}</span>
              <h3 className="text-sm font-bold text-foreground mb-2">{t.title}</h3>
              <p className="text-[0.7rem] text-muted-foreground leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 目标用户分布 */}
      <div>
        <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-5 text-center">
          目标用户 / Target Audience
        </p>
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-4"
        >
          {targetAudiences.map((a) => (
            <motion.div
              key={a.label}
              variants={fadeUp}
              className="text-center p-5 border border-border rounded-xl bg-card"
            >
              <span className="text-2xl block mb-2">{a.icon}</span>
              <p className="text-lg font-bold text-foreground">{a.pct}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{a.label}</p>
              <p className="text-[0.6rem] text-muted-foreground mt-1">{a.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 市场机遇总结 */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="p-6 border border-emerald-500/20 rounded-xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50 text-center"
      >
        <p className="text-[0.55rem] font-bold text-emerald-700 uppercase tracking-widest">Market Opportunity</p>
        <p className="text-base font-bold text-foreground mt-2">
          非遗数字化正处于政策红利期与技术成熟期的"双期叠加"
        </p>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto leading-relaxed">
          下沉市场对沉浸式文化体验的需求远未被满足，VR+AI 的组合为非遗传播提供了前所未有的技术可行性。
          率先建立"沉浸体验+AI创作+社区传播"三位一体平台的产品，将占据市场先发优势。
        </p>
      </motion.div>
    </div>
  );
}


/* ---------- ChapterTransition —— 章节过渡句 ---------- */
function ChapterTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="text-center text-lg md:text-xl font-medium text-red-600 py-12"
    >
      {children}
    </motion.p>
  );
}

// ---------- 主组件 ----------

function YimoVRProductDetail({
  project,
  allProjectIds,
  id,
}: {
  project: ProjectData;
  allProjectIds: string[];
  id: string;
}) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isVrLightboxOpen, setIsVrLightboxOpen] = useState(false);
  const [vrLightboxIndex, setVrLightboxIndex] = useState(0);

  const vrImages = useMemo(() => [localImages.vrExperience2, localImages.vrUgcDesign, localImages.vrCommunity], []);

  // 折叠状态：每章默认展开
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true,
  });

  const toggleChapter = (num: number) => {
    setExpandedChapters((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const { currentIndex, prevId, nextId } = useProjectNavigation(
    id,
    allProjectIds,
    { isDisabled: isLightboxOpen },
  );

  return (
    <div className="yimo-case min-h-screen bg-background text-foreground">

      {/* ===== 固定返回按钮 ===== */}
      <BackToHomeLink />

      {/*
        ════════════════════════════════════════════════════════════
        1.1 Hero Cover — 沉浸式开篇
        ════════════════════════════════════════════════════════════
      */}
      <Section className="pb-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Hero Image — moved above the title */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl bg-muted"
          >
            <img
              src={project.images[0]}
              alt="Yimo Hero Cover"
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          </motion.div>

          <div>
            <p className="text-lg md:text-xl text-foreground mt-2 font-light">
              非遗VR沉浸式体验平台
            </p>
        </div>

          <div className="flex flex-wrap gap-3">
            {["VR体验", "UGC创作", "社区传播"].map((tag) => (
              <span key={tag} className="px-4 py-2 text-[0.75rem] font-medium border border-black/10 rounded-full bg-card text-foreground">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </Section>

      {/*
        ════════════════════════════════════════════════════════════
        Chapter 1 项目概述 / Project Overview
        ════════════════════════════════════════════════════════════
      */}
      <ChapterHeader number={1} title="项目概述" enTitle="Project Overview" expanded={expandedChapters[1]} onToggle={() => toggleChapter(1)} />

      <CollapsibleContent expanded={expandedChapters[1]}>
        {/*
          1.2 Project Background — 项目背景
        */}
        <Section title="项目背景 / Project Background" className="pt-2">
          <BackgroundSection />
        </Section>

        {/*
          1.3 Market Analysis — 市场分析
        */}
        <Section title="市场分析 / Market Analysis">
          <MarketAnalysisSection />
        </Section>
      </CollapsibleContent>

      {/* Chapter 1 → 2 */}
      <ChapterTransition>↓ 在行业趋势与技术演进的推动下，非遗传播的结构性问题开始显现。</ChapterTransition>

      {/*
        ════════════════════════════════════════════════════════════
        Chapter 2 产品机会分析 / Product Discovery
        ════════════════════════════════════════════════════════════
      */}
      <ChapterHeader number={2} title="产品机会分析" enTitle="Product Discovery" expanded={expandedChapters[2]} onToggle={() => toggleChapter(2)} />

      <CollapsibleContent expanded={expandedChapters[2]}>

      {/*
        2.1 Pain Point Map — 痛点地图（图文混排）
        ════════════════════════════════════════════════════════════
      */}
      <Section title="痛点地图 / Pain Point Map" className="pt-2">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl bg-muted border border-border mb-8"
        >
          <ImageWithFallback
            src={localImages.productPainPointMap}
            alt="Pain Point Map"
            className="w-full h-auto object-cover"
          />
        </motion.div>
        <PainPointMap />
      </Section>

      {/*
        ════════════════════════════════════════════════════════════
        2.2 Competitive Analysis — 竞品分析
        ════════════════════════════════════════════════════════════
      */}
      <Section title="竞品分析 / Competitive Analysis">
        <CurrentSolutions />
      </Section>

      {/*
        ════════════════════════════════════════════════════════════
        2.3 Opportunity Framework — 机会框架
        ════════════════════════════════════════════════════════════
      */}
      </CollapsibleContent>

      {/* Chapter 2 → 3 */}
      <ChapterTransition>↓ 这些问题的背后，本质上是不同用户体验断层的集中体现。</ChapterTransition>

      {/*
        ════════════════════════════════════════════════════════════
        Chapter 3 用户研究 / User Research
        ════════════════════════════════════════════════════════════
      */}
      <ChapterHeader number={3} title="用户研究" enTitle="User Research" expanded={expandedChapters[3]} onToggle={() => toggleChapter(3)} />

      <CollapsibleContent expanded={expandedChapters[3]}>

      {/*
        3.1 User Segmentation — 用户细分
      */}
      <Section title="用户细分 / User Segmentation" className="pt-2">
        <UserSegmentationSection />
      </Section>

      {/*
        3.2 Persona — 用户画像
      */}
      <Section title="用户画像 / Persona">
        <PersonaInsight />
      </Section>
      </CollapsibleContent>

      {/* Chapter 3 → 4 */}
      <ChapterTransition>↓ 理解用户之后，我们需要将需求转化为可落地的产品结构。</ChapterTransition>

      {/*
        ════════════════════════════════════════════════════════════
        Chapter 4 产品设计 / Product Design
        ════════════════════════════════════════════════════════════
      */}
      <ChapterHeader number={4} title="产品设计" enTitle="Product Design" expanded={expandedChapters[4]} onToggle={() => toggleChapter(4)} />

      <CollapsibleContent expanded={expandedChapters[4]}>

      {/*
        4.1 Design Thinking — 设计方法
      */}
      <Section title="设计方法 / Design Thinking" className="pt-2">
        <DesignThinkingSection />
      </Section>

      {/*
        4.2 Product Architecture — 产品架构（5层系统模型）
      */}
      <Section title="产品架构 / Product Architecture">
        <ProductPositioningSection />
      </Section>

      {/*
        4.4 Information Architecture — 信息架构
      */}
      <Section title="信息架构 / Information Architecture">
        <InformationArchitectureSection />
      </Section>

      {/*
        4.5 User Flow — 用户流程
      */}
      <Section title="用户流程 / User Flow">
        <UserFlowSection />
      </Section>
      </CollapsibleContent>

      {/* Chapter 4 → 5 */}
      <ChapterTransition>↓ 在完成系统设计后，产品价值需要通过具体功能体验来承载。</ChapterTransition>

      {/*
        ════════════════════════════════════════════════════════════
        Chapter 5 产品功能设计 / Product Features
        ════════════════════════════════════════════════════════════
      */}
      <ChapterHeader number={5} title="产品功能设计" enTitle="Product Features" expanded={expandedChapters[5]} onToggle={() => toggleChapter(5)} />

      <CollapsibleContent expanded={expandedChapters[5]}>

      {/*
        5.1 Website Homepage — 网站首页
      */}
      <Section title="网站首页 / Website Homepage" className="pt-2">
        <HomepageShowcaseSection />
      </Section>

      {/*
        5.2 VR Experience — VR沉浸体验
      */}
      <Section title="VR沉浸体验 / VR Experience">
        <VRExperienceSection onImageClick={(idx) => { setVrLightboxIndex(idx); setIsVrLightboxOpen(true); }} />
      </Section>

      {/*
        5.2 UGC Creation System — UGC创作系统
      */}
      <Section title="UGC创作系统 / UGC Creation System">
        <UGCSection onImageClick={(idx) => { setVrLightboxIndex(idx + 1); setIsVrLightboxOpen(true); }} />
      </Section>

      {/*
        5.3 Community — 社区生态
      */}
      <Section title="社区生态 / Community">
        <CommunitySection onImageClick={(idx) => { setVrLightboxIndex(idx + 1); setIsVrLightboxOpen(true); }} />
      </Section>
      </CollapsibleContent>

      {/* Chapter 5 → 6 */}
      <ChapterTransition>↓ 当体验形成闭环后，产品需要进入可持续增长与商业化阶段。</ChapterTransition>

      {/*
        ════════════════════════════════════════════════════════════
        Chapter 6 商业模式与运营 / Business & Growth
        ════════════════════════════════════════════════════════════
      */}
      <ChapterHeader number={6} title="商业模式与运营" enTitle="Business & Growth" expanded={expandedChapters[6]} onToggle={() => toggleChapter(6)} />

      <CollapsibleContent expanded={expandedChapters[6]}>

      {/*
        6.1 Business Model — 商业模式画布
      */}
      <Section title="商业模式画布 / Business Model Canvas" className="pt-2">
        <BusinessModelCanvas />
      </Section>

      {/*
        6.2 Business Scenarios — 商业模式场景
      */}
      <Section title="商业模式场景 / Business Scenarios">
        <BusinessScenariosSection />
      </Section>

      {/*
        6.3 Growth Strategy — 增长策略
      */}
      <Section title="增长策略 / Growth Strategy">
        <GrowthStrategySection />
      </Section>

      {/*
        6.4 Metrics Framework — 指标体系
      */}
      <Section title="指标体系 / Metrics Framework">
        <MetricChart />
      </Section>
      </CollapsibleContent>

      {/* Chapter 6 → 7 */}
      <ChapterTransition>↓ 在商业模型成立的基础上，我们进一步探索产品的长期演进方向。</ChapterTransition>

      {/*
        ════════════════════════════════════════════════════════════
        Chapter 7 产品规划 / Future
        ════════════════════════════════════════════════════════════
      */}
      <ChapterHeader number={7} title="产品规划" enTitle="Future" expanded={expandedChapters[7]} onToggle={() => toggleChapter(7)} />

      <CollapsibleContent expanded={expandedChapters[7]}>

      {/*
        7.1 Product Roadmap — 路线图
      */}
      <Section title="路线图 / Product Roadmap" className="pt-2">
        <Roadmap />
      </Section>

      {/*
        7.2 Future Scenarios — 未来发展场景
      */}
      <Section title="未来发展场景 / Future Scenarios">
        <FutureScenariosSection />
      </Section>

      {/*
        7.3 Market Position — 市场定位
      */}
      <Section title="市场定位 / Market Position">
        <MarketPositionSection />
      </Section>
      </CollapsibleContent>

      {/* Chapter 7 → 8 */}
      <ChapterTransition>↓ 从未来回到当下，我们重新审视设计选择与项目价值沉淀。</ChapterTransition>

      {/*
        ════════════════════════════════════════════════════════════
        Chapter 8 项目总结 / Reflection
        ════════════════════════════════════════════════════════════
      */}
      <ChapterHeader number={8} title="项目总结" enTitle="Reflection" expanded={expandedChapters[8]} onToggle={() => toggleChapter(8)} />

      <CollapsibleContent expanded={expandedChapters[8]}>

      {/*
        8.1 Project Reflection — 项目总结
      */}
      <Section title="项目总结 / Project Reflection" className="pt-2">
        <ProjectReflectionSection />
      </Section>
      </CollapsibleContent>

      {/* ================= 元数据 + 上下导航 ================= */}
      <Section className="border-t border-black/10">
        <ProjectMetadata project={project} className="mb-12" />

        <ProjectNav
          prevId={prevId}
          nextId={nextId}
          currentIndex={currentIndex}
          totalCount={allProjectIds.length}
          variant="yimo"
        />
      </Section>

      {/* ===== Lightbox ===== */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={project.images}
        currentIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
        getAlt={(i) => `遗墨 - ${project.title} - ${i + 1}`}
      />

      {/* ===== VR 图片 Lightbox ===== */}
      <Lightbox
        isOpen={isVrLightboxOpen}
        onClose={() => setIsVrLightboxOpen(false)}
        images={vrImages}
        currentIndex={vrLightboxIndex}
        onNavigate={setVrLightboxIndex}
        getAlt={(i) => `遗墨 VR 场景截图 - ${i + 1}`}
      />
    </div>
  );
}
