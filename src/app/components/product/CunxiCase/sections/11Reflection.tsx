import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

const columns = [
  {
    label: "What Worked / 成立的部分",
    title: "把「看见 → 理解 → 行动」串成闭环",
    points: [
      "职业资产成为所有分析共用的底座，而不是一次性的表单",
      "多岗位横向比较让用户看见不同路径的接近程度",
      "历史分析按版本保留，让能力变化可以被回看",
      "AI 对话承接分析结果，把结论推进为可追问的行动",
    ],
  },
  {
    label: "Limits / 限制",
    title: "边界被明确写进产品，而不是藏起来",
    points: [
      "尚未进行正式用户研究与真实用户量验证",
      "奖项解析、排名变化事件、Pro 付费与推送尚未实现",
      "品牌资产与 App 截图仍待替换，本轮以明确占位呈现",
      "历史结果的版本对比界面仍在规划中",
    ],
  },
  {
    label: "Next / 下一步",
    title: "让成长记录更容易被理解",
    points: [
      "补齐分析结果的版本对比与变化解释",
      "细化能力维度的呈现，减少单一分数的压迫感",
      "扩展岗位来源与简历导入方式",
      "在真实资产到位后完成品牌与界面证据的替换",
    ],
  },
];

export function Reflection() {
  return (
    <section id="reflection" className="cunxi-section">
      <div className="cunxi-shell">
        <SectionHeading
          index="11"
          label="在寸隙之间，留下可持续的成长"
          enLabel="Reflection"
        />

        <Reveal delay={0.06}>
          <blockquote className="cunxi-quote" style={{ marginTop: 40 }}>
            职业成长不是一次匹配，
            <br />
            而是持续<span>看见</span>、<span>理解</span>与<span>行动</span>。
          </blockquote>
        </Reveal>

        <div className="cunxi-grid cunxi-grid--3" style={{ marginTop: 64 }}>
          {columns.map((column, index) => (
            <Reveal key={column.label} delay={0.05 * index}>
              <div className="cunxi-card" style={{ height: "100%" }}>
                <p className="cunxi-eyebrow">{column.label}</p>
                <h3 className="cunxi-h3" style={{ marginTop: 16 }}>
                  {column.title}
                </h3>
                <ul className="cunxi-list" style={{ marginTop: 14 }}>
                  {column.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="cunxi-note" style={{ marginTop: 44 }}>
            <span>
              寸隙仍然是一个进行中的产品。这个案例选择把已实现、规划中与尚未验证的部分
              分开呈现，因为对职业成长产品来说，可信比完整更重要。
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
