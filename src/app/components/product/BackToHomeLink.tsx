import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

interface BackToHomeLinkProps {
  /** 首页锚点，默认为 product-cases */
  anchor?: string;
}

/**
 * 固定在左上角的"返回首页"按钮。
 * 三个产品详情页共享同一套样式，仅锚点不同。
 */
export function BackToHomeLink({ anchor = "product-cases" }: BackToHomeLinkProps) {
  return (
    <Link
      to={`/#${anchor}`}
      className="fixed top-24 left-6 z-50 inline-flex items-center gap-2 px-5 py-2.5 text-[0.8rem] text-[#1A1A1A] bg-white/70 backdrop-blur-md border border-white/30 hover:bg-white/90 transition-all tracking-widest uppercase rounded-full shadow-sm"
    >
      <ArrowLeft size={16} /> 返回首页
    </Link>
  );
}
