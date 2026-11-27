import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

const scenarios = [
  {
    label: "Scenario 01",
    title: "初入职场",
    desc: "第一次系统梳理经历、项目与技能，建立自己的职业资产底座。",
  },
  {
    label: "Scenario 02",
    title: "转岗 / 转行",
    desc: "同时比较多个目标岗位，理解现有能力与目标要求之间的距离。",
  },
  {
    label: "Scenario 03",
    title: "求职准备",
    desc: "在投递之前，先看清匹配原因、优势与 Gap，而不是只拿到一个分数。",
  },
  {
    label: "Scenario 04",
    title: "长期复盘",
    desc: "保留每次分析结果，用时间维度看见能力与匹配的变化。",
  },
];

const pages = [
  { label: "Tab 01", title: "职业旅程", desc: "职业资产、当前目标与成长记录的总览。" },
  { label: "Tab 02", title: "分析", desc: "一次提交多个目标岗位，获得匹配分与跨岗位排名。" },
  { label: "Tab 03", title: "AI", desc: "围绕分析与资产进行流式对话，把结论推进为行动。" },
  { label: "Tab 04", title: "我的", desc: "工作经历、项目、技能、简历版本与历史分析。" },
];

export function Overview() {
  return (
    <section id="overview" className="cunxi-section">
      <div className="cunxi-shell">
        <div className="cunxi-split">
          <div>
            <SectionHeading
              index="02"
              label="不是招聘平台，而是职业成长的长期界面"
              enLabel="Overview"
              lede="寸隙把职业成长拆成四件事：看见自己、理解目标、比较差距、持续行动。四个一级页面围绕这条主线组织，而不是围绕职位列表。"
            />

            <Reveal delay={0.14}>
              <div className="cunxi-note">
                <span>
                  寸隙不聚合职位、不提供投递，也不是招聘平台。目标岗位由用户主动设定，
                  产品负责解释「为什么匹配」以及「下一步可以做什么」。
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="cunxi-tag-row" style={{ marginTop: 28 }}>
                <span className="cunxi-tag cunxi-tag--accent">职业资产</span>
                <span className="cunxi-tag">目标岗位分析</span>
                <span className="cunxi-tag">能力匹配</span>
                <span className="cunxi-tag">AI 对话</span>
              </div>
            </Reveal>
          </div>

          <div className="cunxi-overview-visual">
            <Reveal delay={0.06}>
              <p className="cunxi-eyebrow">四类使用场景 / Scenarios</p>
            </Reveal>
            {scenarios.map((item, index) => (
              <Reveal key={item.title} delay={0.04 * index}>
                <div className="cunxi-overview-row">
                  <span>{item.label}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.1}>
              <p className="cunxi-eyebrow" style={{ marginTop: 28 }}>
                四个一级页面 / Pages
              </p>
            </Reveal>
            {pages.map((item, index) => (
              <Reveal key={item.title} delay={0.04 * index}>
                <div className="cunxi-overview-row">
                  <span>{item.label}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
