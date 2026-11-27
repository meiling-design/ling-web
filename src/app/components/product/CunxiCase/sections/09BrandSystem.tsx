import { cunxiAssets } from "../../../../cunxiAssets";
import { AssetFrame } from "../components/AssetFrame";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

interface BrandSystemProps {
  onOpenImage?: (src: string) => void;
}

const palette = [
  { name: "Ink", hex: "#252936", color: "#252936" },
  { name: "Paper", hex: "#F5F3EF", color: "#F5F3EF" },
  { name: "Blue", hex: "#7D9FEF", color: "#7D9FEF" },
  { name: "Lilac", hex: "#B59AD9", color: "#B59AD9" },
  { name: "Blush", hex: "#E9BFCB", color: "#E9BFCB" },
  { name: "Sage", hex: "#A8C6B4", color: "#A8C6B4" },
  { name: "Stone", hex: "#D7D1C8", color: "#D7D1C8" },
];

const typeScale = [
  { label: "Display", sample: "寸隙", note: "56–88px / 紧字距" },
  { label: "Heading", sample: "看见职业能力", note: "32–45px / 600" },
  { label: "Body", sample: "把经历沉淀为可复用的资产", note: "15–16px / 1.85" },
  { label: "Caption", sample: "ASSET · 2026", note: "11–12px / 0.24em" },
];

export function BrandSystem({ onOpenImage }: BrandSystemProps) {
  return (
    <section id="brand-system" className="cunxi-section">
      <div className="cunxi-shell">
        <SectionHeading
          index="09"
          label="冷纸、蓝紫与一道光缝"
          enLabel="Brand System"
          lede="寸隙的品牌识别刻意与遗墨的暖纸红金区分：冷纸作为底，蓝紫作为光，所有视觉都围绕「边界之间留出的一寸空间」展开。"
        />

        <div className="cunxi-brand-board">
          <div style={{ display: "grid", gap: 20 }}>
            <Reveal>
              <div className="cunxi-card">
                <p className="cunxi-eyebrow">Logo / 字标</p>
                <div style={{ marginTop: 16 }}>
                  <AssetFrame
                    src={cunxiAssets.brand.logo}
                    label="寸隙 Logo / 字标"
                    hint="SVG · 单色字标"
                    ratio="3 / 1"
                  />
                </div>
                <p className="cunxi-small" style={{ marginTop: 12 }}>
                  独立 Logo 矢量文件待补充；当前主视觉中的字标暂不单独用于其他场景。
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="cunxi-card">
                <p className="cunxi-eyebrow">Brand Palette / 品牌色</p>
                <div className="cunxi-palette" style={{ marginTop: 16 }}>
                  {palette.map((color) => (
                    <div key={color.name} className="cunxi-swatch">
                      <div className="cunxi-swatch-color" style={{ background: color.color }} />
                      <div className="cunxi-swatch-meta">
                        <strong>{color.name}</strong>
                        <code>{color.hex}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            <Reveal delay={0.04}>
              <div className="cunxi-card">
                <p className="cunxi-eyebrow">Typography / 字体层级</p>
                <div style={{ marginTop: 10 }}>
                  {typeScale.map((row) => (
                    <div key={row.label} className="cunxi-type-row">
                      <span>{row.label}</span>
                      <div>
                        <div style={{ fontSize: row.label === "Display" ? "1.9rem" : undefined }}>
                          {row.sample}
                        </div>
                        <p className="cunxi-small" style={{ marginTop: 2 }}>
                          {row.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="cunxi-small" style={{ marginTop: 12 }}>
                  Inter + Noto Sans SC，沿用全站字体，不引入新的授权字体。
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="cunxi-card">
                <p className="cunxi-eyebrow">Graphic Language / 图形语言</p>
                <div className="cunxi-gap-visual" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <p className="cunxi-small" style={{ marginTop: 14 }}>
                  「间隙轨迹」：两条边界之间透出的光缝。用于 Hero 背景、章节分隔与状态强调，
                  不构成独立的 Logo 或图形标识。
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="cunxi-card">
                <p className="cunxi-eyebrow">IP / 星云角色</p>
                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "140px 1fr", gap: 18, alignItems: "center" }}>
                  <AssetFrame
                    src={cunxiAssets.ip.nebula}
                    label="星云 IP"
                    hint="1 : 1 · SVG"
                    ratio="1 / 1"
                    onOpen={onOpenImage}
                  />
                  <p className="cunxi-small">
                    沿用现有星云角色，待寸隙品牌正式确认。该角色不含旧品牌文字，
                    作为产品 IP 的候选形象展示。
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="cunxi-card" style={{ marginTop: 24 }}>
            <p className="cunxi-eyebrow">App UI System · 独立于品牌识别</p>
            <p className="cunxi-body" style={{ marginTop: 14 }}>
              App 内实际使用的主色与背景渐变属于产品界面系统，
              不与上面的品牌色板混为一套。
            </p>

            <div className="cunxi-grid cunxi-grid--2" style={{ marginTop: 22 }}>
              <div>
                <p className="cunxi-small">Primary / 主色</p>
                <div style={{ display: "flex", gap: 10, marginTop: 9 }}>
                  <div style={{ flex: 1, height: 64, borderRadius: 12, background: "#4F7EF5" }} />
                  <div style={{ flex: 1, height: 64, borderRadius: 12, background: "#A77BE6" }} />
                </div>
                <p className="cunxi-small" style={{ marginTop: 8 }}>
                  #4F7EF5 / #A77BE6
                </p>
              </div>

              <div>
                <p className="cunxi-small">Background Gradient / 背景渐变</p>
                <div className="cunxi-token-gradient" style={{ marginTop: 9 }} />
                <p className="cunxi-small" style={{ marginTop: 8 }}>
                  #DCE9FB → #E5DCFA → #FBE9F1
                </p>
              </div>
            </div>

            <p className="cunxi-small" style={{ marginTop: 16 }}>
              中文 UI 使用 Noto Sans SC；该层 token 只用于 App 界面，不反向定义品牌色。
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
