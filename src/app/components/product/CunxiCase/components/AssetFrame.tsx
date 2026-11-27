import { useState, type CSSProperties } from "react";

interface AssetFrameProps {
  src?: string | null;
  alt?: string;
  /** 资产名称，占位时显示 */
  label: string;
  /** 尺寸提示，例如 "1600 × 900 · 16:9" */
  hint?: string;
  /** image = 常规图片框；phone = 手机框 */
  variant?: "image" | "phone";
  /** 仅 image 生效，控制占位框比例 */
  ratio?: string;
  className?: string;
  onOpen?: (src: string) => void;
}

/**
 * 图片 / 手机框 / 明确占位三合一。
 * 空 src 或加载失败时不渲染 <img>，统一显示 ASSET PLACEHOLDER。
 */
export function AssetFrame({
  src,
  alt,
  label,
  hint = "尺寸待定",
  variant = "image",
  ratio = "16 / 9",
  className = "",
  onOpen,
}: AssetFrameProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  if (variant === "phone") {
    return (
      <div className={`cunxi-phone ${className}`}>
        <div className="cunxi-phone-shell">
          <div className="cunxi-phone-notch" />
          <div className="cunxi-phone-screen">
            {showImage ? (
              <img
                src={src as string}
                alt={alt ?? label}
                loading="lazy"
                decoding="async"
                draggable={false}
                onClick={onOpen && src ? () => onOpen(src) : undefined}
                style={onOpen ? { cursor: "zoom-in" } : undefined}
                onError={() => setFailed(true)}
              />
            ) : (
              <div className="cunxi-phone-placeholder">
                <strong>ASSET PLACEHOLDER</strong>
                <em>{label}</em>
                <small>{hint}</small>
                <small>界面示意 · 待替换</small>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`cunxi-asset cunxi-asset--image ${className}`}
      style={{ "--cx-asset-ratio": ratio } as CSSProperties}
    >
      {showImage ? (
        <img
          src={src as string}
          alt={alt ?? label}
          loading="lazy"
          decoding="async"
          draggable={false}
          onClick={onOpen && src ? () => onOpen(src) : undefined}
          style={onOpen ? { cursor: "zoom-in" } : undefined}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="cunxi-asset-placeholder">
          <strong>ASSET PLACEHOLDER · 待替换</strong>
          <em>{label}</em>
          <small>{hint}</small>
        </div>
      )}
    </div>
  );
}
