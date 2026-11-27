import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp } from "../../../../../services/animationVariants";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * 入场动画包装。开启「减少动效」时直接静态渲染，
 * 避免 initial opacity: 0 让内容永远不可见。
 */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
