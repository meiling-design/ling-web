import { cunxiAssets } from "../../../../cunxiAssets";
import { AssetFrame } from "../components/AssetFrame";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

interface CoreExperienceProps {
  onOpenImage?: (src: string) => void;
}

const screens = [
  {
    key: "home" as const,
    title: "职业旅程",
    en: "Career Journey",
    desc: "进入产品的第一屏不是职位列表，而是「我现在拥有什么、想去哪里」。",
    points: ["工作经历、项目、技能与简历版本的总览", "当前目标岗位与最近一次分析", "成长记录的入口"],
  },
  {
    key: "analysis" as const,
    title: "分析",
    en: "Analysis",
    desc: "一次提交多个目标岗位，用同一套职业资产完成横向比较。",
    points: [
      "多岗位一次分析，结果并排呈现",
      "0–100 能力匹配分",
      "跨岗位排名，比较不同路径的接近程度",
      "任务进度、取消与恢复",
    ],
  },
  {
    key: "match" as const,
    title: "匹配详情",
    en: "Matching Detail",
    desc: "分数只是入口，真正被阅读的是「为什么匹配、差在哪里」。",
    points: [
      "匹配原因：哪些经历支撑了结论",
      "优势：当前能力中最相关的部分",
      "Gap：目标要求与现有能力之间的距离",
      "建议：可以优先补强的方向",
    ],
  },
  {
    key: "ai" as const,
    title: "AI 对话",
    en: "AI Chat",
    desc: "把分析结果变成可以继续追问的对话，而不是一份读完就结束的报告。",
    points: [
      "SSE 流式输出，回复逐字呈现",
      "会话服务端持久化，可恢复、续写、删除",
      "围绕岗位、差距与行动继续追问",
    ],
  },
];

export function CoreExperience({ onOpenImage }: CoreExperienceProps) {
  return (
    <section id="core-experience" className="cunxi-section">
      <div className="cunxi-shell">
        <SectionHeading
          index="05"
          label="四个页面，一条连续的成长路径"
          enLabel="Core Experience"
          lede="四个一级页面不是四个孤立工具，而是同一条路径上的四个位置：先看见资产，再理解匹配，然后进入对话，最后把结果留在成长记录里。"
        />

        <div className="cunxi-screens">
          {screens.map((screen, index) => {
            const src = cunxiAssets.screens[screen.key];
            return (
              <Reveal key={screen.key} delay={0.05 * index} className="cunxi-screen-item">
                <AssetFrame
                  variant="phone"
                  src={src}
                  label={`${screen.title} / ${screen.en}`}
                  hint="9 : 19 · 390 × 844"
                  onOpen={onOpenImage}
                />
                <div className="cunxi-phone-caption">
                  <strong>{screen.title}</strong>
                  <span>{screen.en}</span>
                </div>
                <div className="cunxi-screen-copy">
                  <p className="cunxi-small" style={{ marginBottom: 12 }}>
                    {screen.desc}
                  </p>
                  <ul>
                    {screen.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="cunxi-note cunxi-note--soft" style={{ marginTop: 44 }}>
            <span>
              以上为界面示意，不是真实截图。更细的 strengthScores / gapDetails
              只会在能力评分成功时出现；没有细分数据时，产品会显示明确的空态，而不是填充演示数值。
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
