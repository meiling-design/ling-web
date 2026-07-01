import { useRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface CardProps {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  homeDescription?: string;
  image?: string;
  desc?: string;
}

interface HorizontalSectionProps {
  id?: string;
  title: string;
  subtitle: string;
  projects: CardProps[];
  basePath?: string;
}

export function HorizontalSection({ id, title, subtitle, projects, basePath = "project" }: HorizontalSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.children[0] as HTMLElement | null;
      if (!firstCard) return;
      const cardWidth = firstCard.getBoundingClientRect().width;
      const scrollAmount = cardWidth + 32; // card width + gap-8
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id={id} className="mb-20 overflow-hidden scroll-mt-24">
      <div className="container mx-auto px-6 max-w-[1440px] mb-8">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-[#1A1A1A]" />
            <div>
              <h2 className="text-[1.5rem] font-medium text-[#1A1A1A] leading-none uppercase tracking-widest">{title}</h2>
              <p className="text-[0.8rem] text-[#777] mt-1">{subtitle}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-[0.7rem] text-[#999] tracking-widest uppercase">
              浏览作品集
            </div>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 px-6 md:px-[calc((100vw-1440px)/2+24px)] snap-x pb-4 scroll-smooth custom-h-scroll"
        >
          {projects.map((project) => (
            <Link
              key={project.id}
              id={project.id}
              to={`/${basePath}/${project.id}`}
              className="flex-shrink-0 w-[373px] md:w-[560px] snap-start scroll-mt-32"
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-[12px] bg-[#F2F2F2]">
                  {project.image ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full"
                    >
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ) : (
                    <div className="w-full h-full" />
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-6 space-y-1">
                  <h3 className="text-[1.2rem] font-semibold text-[#1A1A1A] tracking-tight">{project.title}</h3>
                  <p className="text-[0.8rem] text-[#777] uppercase tracking-widest">{project.category}</p>
                </div>
              </motion.div>
            </Link>
          ))}
          {/* Padding for the end of scroll */}
          <div className="flex-shrink-0 w-6 h-1" />
        </div>

        {/* 左右导航按钮 — 与项目详情页风格一致 */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 right-2 md:right-4 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-black/5 rounded-full pointer-events-auto hover:bg-black hover:text-white transition-all shadow-sm"
            aria-label="向左滚动"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-black/5 rounded-full pointer-events-auto hover:bg-black hover:text-white transition-all shadow-sm"
            aria-label="向右滚动"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
