import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  /** 自定义 alt 文本生成函数，默认 "Project N" */
  getAlt?: (index: number) => string;
}

export function Lightbox({ isOpen, onClose, images, currentIndex, onNavigate, getAlt }: LightboxProps) {
  useEffect(() => {
    if (!isOpen) return;

    // 锁定背景滚动
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((currentIndex + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((currentIndex - 1 + images.length) % images.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 md:p-12"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-white hover:opacity-50 transition-opacity z-[110]"
          >
            <X size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-8 text-white hover:opacity-50 transition-opacity hidden md:block"
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex + 1) % images.length);
            }}
            className="absolute right-8 text-white hover:opacity-50 transition-opacity hidden md:block"
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={getAlt?.(currentIndex) ?? `Project ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain select-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
            <div className="absolute -bottom-12 left-0 right-0 text-center text-white/50 text-[0.8rem] tracking-widest uppercase">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
