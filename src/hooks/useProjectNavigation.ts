/**
 * 项目导航 hook — 封装上下项目切换与键盘快捷键逻辑。
 *
 * 消除了 ProjectDetail.tsx 中主组件与 YimoVRProductDetail 之间
 * 重复的 useMemo + useEffect + keyboard 事件绑定代码。
 */
import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router";

interface UseProjectNavigationOptions {
  /** 当为 true 时不响应键盘事件（如 Lightbox 打开时） */
  isDisabled?: boolean;
  /** 键盘快捷键前缀路径，默认 "/project/" */
  basePath?: string;
}

interface UseProjectNavigationResult {
  currentIndex: number;
  prevId?: string;
  nextId?: string;
}

export function useProjectNavigation(
  id: string | undefined,
  allProjectIds: string[],
  options: UseProjectNavigationOptions = {},
): UseProjectNavigationResult {
  const { isDisabled = false, basePath = "/project/" } = options;
  const navigate = useNavigate();

  const currentIndex = useMemo(
    () => (id ? allProjectIds.indexOf(id) : -1),
    [id, allProjectIds],
  );
  const prevId = currentIndex > 0 ? allProjectIds[currentIndex - 1] : undefined;
  const nextId =
    currentIndex < allProjectIds.length - 1
      ? allProjectIds[currentIndex + 1]
      : undefined;

  useEffect(() => {
    if (isDisabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevId) {
        navigate(`${basePath}${prevId}`);
      }
      if (e.key === "ArrowRight" && nextId) {
        navigate(`${basePath}${nextId}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDisabled, navigate, prevId, nextId, basePath]);

  return { currentIndex, prevId, nextId };
}
