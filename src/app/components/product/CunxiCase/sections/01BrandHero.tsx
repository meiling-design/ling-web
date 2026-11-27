import { cunxiAssets } from "../../../../cunxiAssets";
import { AssetFrame } from "../components/AssetFrame";
import { Reveal } from "../components/Reveal";

const phoneEntries = [
  {
    key: "home" as const,
    label: "职业旅程 / Career Journey",
    caption: "职业资产与当前目标",
  },
  {
    key: "analysis" as const,
    label: "岗位分析 / Analysis",
    caption: "多岗位匹配与排名",
  },
  {
    key: "ai" as const,
    label: "AI 对话 / AI Chat",
    caption: "把洞察转成行动",
  },
];

export function BrandHero() {
  return (
    <section id="brand-hero" className="cunxi-hero">
      <div className="cunxi-shell">
        <div className="cunxi-hero-head">
          <div>
            <Reveal>
              <span className="cunxi-eyebrow">Product Case Study · 2026</span>
            </Reveal>
            <Reveal delay={0.04}>
              <h1 className="cunxi-hero-title">
                寸隙 CUNXI
                <span>AI CAREER GROWTH</span>
              </h1>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="cunxi-hero-tagline">
            <p>于寸隙间，见无限可能。</p>
            <span>A Little Space. Infinite Possibilities.</span>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          <div className="cunxi-hero-visual">
            {cunxiAssets.brand.hero ? (
              <img
                src={cunxiAssets.brand.hero}
                alt="寸隙 CUNXI 品牌主视觉 —— Infinite in Between"
                loading="eager"
                decoding="async"
                draggable={false}
              />
            ) : (
              <AssetFrame
                label="品牌主视觉 / Brand Hero"
                hint="2048 × 1152 · 16:9"
                ratio="16 / 9"
              />
            )}
          </div>
          <div className="cunxi-hero-caption">
            <p className="cunxi-small">
              品牌主视觉 / Brand Hero —— 于寸隙间，见无限可能
            </p>
            <div className="cunxi-tag-row">
              <span className="cunxi-tag">Product Design</span>
              <span className="cunxi-tag">AI Product</span>
              <span className="cunxi-tag">Flutter</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="cunxi-lede">
            寸隙是一款面向职业成长初期的 AI 职业成长产品。它不替用户做职业选择，
            而是把分散的经历变成可积累的职业资产，把模糊的差距变成可理解的匹配依据，
            再通过对话把每一次洞察推进为下一步行动。
          </p>
        </Reveal>

        <div className="cunxi-hero-phones">
          <div className="cunxi-hero-phones-head">
            <h2 className="cunxi-h3">三屏之间，看见成长的路径</h2>
            <span className="cunxi-small">界面示意 · 真实截图待替换</span>
          </div>
          <div className="cunxi-grid cunxi-grid--3">
            {phoneEntries.map((entry, index) => (
              <Reveal key={entry.key} delay={0.06 * index}>
                <AssetFrame
                  variant="phone"
                  src={cunxiAssets.screens[entry.key]}
                  label={entry.label}
                  hint="9 : 19 · 390 × 844"
                />
                <div className="cunxi-phone-caption">
                  <strong>{entry.caption}</strong>
                  <span>界面示意 / UI PREVIEW</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
