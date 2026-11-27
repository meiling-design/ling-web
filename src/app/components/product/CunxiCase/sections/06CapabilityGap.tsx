import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

const columns = [
  {
    en: "Target Role",
    title: "目标岗位要求",
    points: [
      "从岗位描述中抽取职责与任务范围",
      "技能要求与工具栈",
      "经验年限与项目类型",
      "行业与业务语境",
    ],
  },
  {
    en: "Current Capability",
    title: "当前能力",
    points: [
      "工作经历：公司、角色、时间与职责",
      "项目经历：背景、行动与结果",
      "技能：技能项与熟练程度",
      "简历版本：当前简历与归档版本",
    ],
  },
  {
    en: "Match & Gap",
    title: "匹配依据与差距",
    points: [
      "匹配原因：哪些经历支撑了结论",
      "优势：与目标最相关的能力",
      "Gap：尚未覆盖的要求",
      "建议：优先补强的方向",
    ],
  },
];

export function CapabilityGap() {
  return (
    <section id="capability-gap" className="cunxi-section">
      <div className="cunxi-shell">
        <SectionHeading
          index="06"
          label="把「匹配」拆成可以被阅读的结构"
          enLabel="Capability & Gap"
          lede="一次能力匹配由三部分构成：目标岗位要求、当前职业资产，以及两者之间的关系。寸隙把关系解释清楚，而不是只输出一个总分。"
        />

        <Reveal delay={0.1}>
          <div className="cunxi-tag-row" style={{ marginTop: 28 }}>
            <span className="cunxi-tag cunxi-tag--accent">结构示意</span>
            <span className="cunxi-tag">不含演示数值</span>
          </div>
        </Reveal>

        <div className="cunxi-gap-grid">
          {columns.map((column, index) => (
            <Reveal key={column.en} delay={0.05 * index}>
              <div className="cunxi-gap-col">
                <div className="cunxi-gap-col-head">
                  <div>
                    <p className="cunxi-eyebrow">{column.en}</p>
                    <h3 className="cunxi-h3" style={{ marginTop: 10, marginBottom: 0 }}>
                      {column.title}
                    </h3>
                  </div>
                </div>

                <ul className="cunxi-list">
                  {column.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                {index === 2 && (
                  <div className="cunxi-gap-empty">
                    <strong>无细分数据</strong>
                    <span>
                      strengthScores / gapDetails 仅在能力评分成功时存在；
                      本轮没有真实截图，因此不展示任何具体数值。
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="cunxi-note cunxi-note--soft" style={{ marginTop: 32 }}>
            <span>
              可被确认的能力包括：一次分析多个岗位并跨岗位排名、0–100 能力匹配分、
              匹配原因 / 优势 / Gap / 建议。更细的能力维度并非每次分析都会返回。
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
