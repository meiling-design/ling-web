import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

const problems = [
  {
    index: "P 01",
    problem: "经历散落在简历、笔记和记忆里",
    detail: "每换一次工作或版本，就要重新拼一次自己。",
    opportunity: "把经历沉淀为可复用的职业资产",
    opportunityDetail: "工作经历、项目、技能与简历版本被组织成同一套底座。",
  },
  {
    index: "P 02",
    problem: "匹配结果只有一个分数，不知道凭什么",
    detail: "分数无法解释差距，用户也难以判断是否值得投入。",
    opportunity: "展示匹配原因、优势与 Gap",
    opportunityDetail: "把「为什么匹配」拆成可阅读的依据，而不是黑箱结论。",
  },
  {
    index: "P 03",
    problem: "每次分析都是一次性的，看不见变化",
    detail: "结果用完即走，无法回答「我这一年有没有成长」。",
    opportunity: "保留历史分析，形成成长记录",
    opportunityDetail: "多次分析按版本保留，让能力变化可以被回看。",
  },
  {
    index: "P 04",
    problem: "知道差距，却不知道下一步做什么",
    detail: "建议停留在结论层，缺少可继续追问的入口。",
    opportunity: "把差距翻译成可执行的建议与对话",
    opportunityDetail: "AI 对话承接分析结果，帮助用户把 Gap 拆成下一步。",
  },
];

export function Problem() {
  return (
    <section id="problem" className="cunxi-section">
      <div className="cunxi-shell">
        <SectionHeading
          index="03"
          label="职业成长的断点，不在信息，而在解释"
          enLabel="The Problem"
          lede="用户并不缺少职位信息，也不缺少自我评价。真正缺失的是：经历无法积累、匹配无法解释、成长无法被看见。"
        />

        <Reveal delay={0.12}>
          <div className="cunxi-tag-row" style={{ marginTop: 28 }}>
            <span className="cunxi-tag cunxi-tag--accent">产品问题定义</span>
            <span className="cunxi-tag">设计假设 · 尚未经过正式用户研究验证</span>
          </div>
        </Reveal>

        <div style={{ marginTop: 28 }}>
          {problems.map((item, index) => (
            <Reveal key={item.index} delay={0.04 * index}>
              <div className="cunxi-problem-item">
                <span className="cunxi-problem-index">{item.index}</span>
                <div>
                  <h3 className="cunxi-h4">{item.problem}</h3>
                  <p className="cunxi-small">{item.detail}</p>
                </div>
                <span className="cunxi-problem-arrow" aria-hidden="true">
                  →
                </span>
                <div>
                  <h3 className="cunxi-h4">{item.opportunity}</h3>
                  <p className="cunxi-small">{item.opportunityDetail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="cunxi-note cunxi-note--soft" style={{ marginTop: 36 }}>
            <span>
              以上四组问题来自产品定义阶段的推演，被整理为「问题 → 机会」的工作假设，
              用于指导功能取舍；不代表已经完成的用户研究结论。
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
