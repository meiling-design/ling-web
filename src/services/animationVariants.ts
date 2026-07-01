/**
 * 共享动画变体 — 在 ProjectDetail 等页面间复用
 *
 * 兼容 motion/react 与 framer-motion 两种导入方式。
 */
import type { Variants } from "motion/react";

/** 淡入 + 上移（0 → 1, y: 40 → 0） */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** 纯淡入（0 → 1） */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.8 },
  },
};

