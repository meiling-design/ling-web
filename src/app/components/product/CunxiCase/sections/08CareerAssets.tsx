import { cunxiAssets } from "../../../../cunxiAssets";
import { AssetFrame } from "../components/AssetFrame";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

interface CareerAssetsProps {
  onOpenImage?: (src: string) => void;
}

const nodes = [
  { title: "工作经历", desc: "公司、角色、时间与职责" },
  { title: "项目经历", desc: "背景、行动与结果" },
  { title: "技能", desc: "技能项与熟练程度" },
  { title: "简历版本", desc: "当前、归档与删除" },
  { title: "历史分析", desc: "按版本保留的分析结果" },
];

export function CareerAssets({ onOpenImage }: CareerAssetsProps) {
  return (
    <section id="career-assets" className="cunxi-section">
      <div className="cunxi-shell">
        <SectionHeading
          index="08"
          label="职业资产不是一份简历，而是一套可积累的结构"
          enLabel="Career Assets"
          lede="简历是一次性的表达，职业资产是长期复用的底座。寸隙把经历、项目、技能、简历版本与分析结果放在同一套关系里，让每次更新都能被下一次分析继承。"
        />

        <div className="cunxi-map">
          <Reveal className="cunxi-map-center">
            <strong>职业资产 / Career Assets</strong>
            <span>ONE SOURCE FOR EVERY ANALYSIS</span>
          </Reveal>
          <div className="cunxi-map-rail" aria-hidden="true" />
          {nodes.map((node, index) => (
            <Reveal key={node.title} delay={0.04 * index}>
              <div className="cunxi-map-node">
                <strong>{node.title}</strong>
                <span>{node.desc}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="cunxi-split" style={{ marginTop: 64 }}>
          <Reveal>
            <AssetFrame
              variant="phone"
              src={cunxiAssets.screens.assets}
              label="职业资产 / Career Assets"
              hint="9 : 19 · 390 × 844"
              onOpen={onOpenImage}
            />
            <div className="cunxi-phone-caption">
              <strong>职业资产页</strong>
              <span>界面示意 / UI PREVIEW</span>
            </div>
          </Reveal>

          <div style={{ display: "grid", gap: 18 }}>
            <Reveal delay={0.05}>
              <div className="cunxi-card">
                <h3 className="cunxi-h3">成长记录</h3>
                <p className="cunxi-body">
                  基于能力快照记录成长，只呈现真实存在的能力与匹配变化。
                  排名变化事件当前不会生成，因此不被写成成长记录的一部分。
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="cunxi-card">
                <h3 className="cunxi-h3">奖项：结构预留，尚未解析</h3>
                <p className="cunxi-body">
                  简历解析结果中的奖项字段目前恒为空，也没有编辑接口。
                  因此这里把它标注为「结构预留 / 未解析」，而不是已实现的奖项管理能力。
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="cunxi-note cunxi-note--soft">
                <span>
                  「本月新增资产」等统计当前恒为 0，不进入界面叙事；
                  产品只展示可以被真实数据支撑的内容。
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
