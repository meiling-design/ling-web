import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

const steps = [
  {
    en: "SEE",
    title: "看见",
    desc: "把工作经历、项目与技能整理成可阅读的职业资产，先看清自己拥有什么。",
  },
  {
    en: "UNDERSTAND",
    title: "理解",
    desc: "围绕目标岗位做能力匹配，解释匹配原因、优势与 Gap，而不是只给一个分数。",
  },
  {
    en: "ACT",
    title: "行动",
    desc: "通过 AI 对话继续追问差距，把结论拆成可以执行的下一步。",
  },
  {
    en: "GROW",
    title: "成长",
    desc: "保留多次分析结果，让能力变化被记录，形成可持续回看的成长轨迹。",
  },
];

const perspectives = [
  {
    label: "横向视角 / Horizontal",
    title: "一次分析多个目标岗位",
    desc: "同一次分析中可以提交多个目标岗位，得到各自的 0–100 匹配分并跨岗位排名。它回答的是：在几条可能的路径里，我目前更接近哪一条？",
  },
  {
    label: "纵向视角 / Vertical",
    title: "多次分析看见变化",
    desc: "每次分析结果按版本保留，历史记录不会被覆盖。它回答的是：与上一次相比，我的能力与匹配发生了什么变化？",
  },
];

const shifts = [
  {
    from: "单次简历匹配",
    to: "多岗位能力认知",
    desc: "把「这份简历配不配这个岗位」变成「在几个可能的方向里，我目前更接近哪一条」。",
    ref: "Insight 03",
  },
  {
    from: "单次分析",
    to: "持续职业成长",
    desc: "分析结果按版本保留，让每一次分析成为下一次的起点，而不是一次性结论。",
    ref: "Insight 05",
  },
  {
    from: "结果分数",
    to: "可解释的能力差距",
    desc: "分数只作为入口，优势、Gap 与建议才是用户真正阅读的内容。",
    ref: "Insight 02",
  },
  {
    from: "零散信息",
    to: "长期职业资产",
    desc: "工作经历、项目、技能与简历版本沉淀为同一套可复用的底座。",
    ref: "Insight 01",
  },
];

export function Strategy() {
  return (
    <section id="strategy" className="cunxi-section">
      <div className="cunxi-shell">
        <SectionHeading
          index="05"
          label="SEE → UNDERSTAND → ACT → GROW"
          enLabel="Product Strategy"
          lede="产品策略不是把四个功能堆在一起，而是让用户在一个循环里持续前进：先看见，再理解，然后行动，最后把结果沉淀为下一次的起点。"
        />

        <div className="cunxi-flow">
          {steps.map((step, index) => (
            <Reveal key={step.en} delay={0.05 * index}>
              <div className="cunxi-flow-node">
                <em>{step.en}</em>
                <strong>{step.title}</strong>
                <p>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div className="cunxi-loop">
            <span>↻</span>
            GROW 回到 SEE · 循环而非一次性流程
          </div>
        </Reveal>

        <div className="cunxi-perspective">
          {perspectives.map((item, index) => (
            <Reveal key={item.label} delay={0.05 * index}>
              <div className="cunxi-card">
                <p className="cunxi-eyebrow">{item.label}</p>
                <h3 className="cunxi-h3" style={{ marginTop: 16 }}>
                  {item.title}
                </h3>
                <p className="cunxi-body">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="cunxi-subhead" style={{ marginTop: 64 }}>
            <h3 className="cunxi-h3">策略回应用户研究的四个转向</h3>
            <span>Research → Strategy</span>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <p className="cunxi-body" style={{ maxWidth: 760 }}>
            策略不是从功能清单出发，而是逐条回应用户研究中的洞察：
          </p>
        </Reveal>

        <div className="cunxi-shifts">
          {shifts.map((shift, index) => (
            <Reveal key={shift.to} delay={0.04 * index}>
              <div className="cunxi-shift">
                <span className="cunxi-shift-from">{shift.from}</span>
                <span className="cunxi-shift-arrow" aria-hidden="true">
                  →
                </span>
                <div className="cunxi-shift-to">
                  <strong>{shift.to}</strong>
                  <p>{shift.desc}</p>
                </div>
                <span className="cunxi-shift-ref">{shift.ref}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="cunxi-note cunxi-note--soft" style={{ marginTop: 28 }}>
            <span>
              历史结果目前以版本形式保留，但「版本对比界面」仍在规划中；
              这不影响回看单次结果，但不能被描述为已经完成的对比功能。
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
