import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

/* ---------- 4.1 用户细分 ---------- */

const segments = [
  {
    letter: "A",
    title: "初入职场者",
    stage: "0–2 年 · 建立认知",
    goal: "把零散经历整理成可持续积累的职业资产档案",
    pain: "经历有限，也缺乏系统认知，不清楚如何整理和表达已有经历",
    accent: "var(--cx-blue)",
  },
  {
    letter: "B",
    title: "转岗 / 转行者",
    stage: "2–5 年 · 转换方向",
    goal: "理解已有经验能否迁移到新的职业方向",
    pain: "不清楚现有能力与目标岗位要求之间的距离",
    accent: "var(--cx-lilac)",
  },
  {
    letter: "C",
    title: "主动求职者",
    stage: "目标明确 · 准备投递",
    goal: "同时比较多个职位，判断简历与岗位的适配程度",
    pain: "缺少可解释的匹配依据，简历优化建议难以落地",
    accent: "var(--cx-blush)",
  },
  {
    letter: "D",
    title: "长期职业成长者",
    stage: "不一定求职 · 持续记录",
    goal: "持续记录工作、项目与技能，看见能力随时间的变化",
    pain: "缺少长期可追溯的记录，一次性分析无法呈现成长",
    accent: "var(--cx-sage)",
  },
];

/* ---------- 4.2 用户画像 ---------- */

const primary = {
  name: "林然",
  meta: ["26 岁", "3 年经验", "正在考虑职业转型"],
  background:
    "三年间换过两次方向，做过运营、内容和一些产品支持工作。经历不少，但说不清哪些能力是可迁移的，也说不准距离目标岗位还差多少。",
  groups: [
    {
      label: "核心目标",
      items: [
        "找到适合自己的职业发展方向",
        "了解已有经验的真实价值",
        "判断自己与目标岗位之间的能力差距",
        "知道下一步应该提升什么",
      ],
    },
    {
      label: "主要痛点",
      items: [
        "经历很多，但无法形成清晰的能力认知",
        "面对不同 JD，难以横向判断适配程度",
        "匹配分数缺乏足够的解释",
        "发现能力差距之后，不知道如何采取行动",
        "简历与项目经历分散，难以形成长期积累",
      ],
    },
    {
      label: "典型行为",
      items: [
        "浏览多个不同方向的招聘岗位",
        "把不同 JD 与自己的简历放在一起比较",
        "反复修改简历与项目描述",
        "希望 AI 帮助自己理解能力与差距",
      ],
    },
  ],
  responses: ["多岗位匹配与排序", "匹配原因分析", "能力 Gap 识别", "AI 成长对话", "职业资产沉淀"],
};

const secondary = {
  name: "陈屿",
  meta: ["29 岁", "5 年经验", "正在准备求职"],
  background:
    "已经确定目标方向，正在准备投递。工作经验不少，但不确定简历是否把能力说清楚了，也判断不了不同岗位要求的差异。",
  groups: [
    {
      label: "核心目标",
      items: [
        "判断简历与多个目标岗位的匹配程度",
        "找出简历中的不足",
        "明确需要补充或强化的经历",
        "追踪简历更新后匹配情况的变化",
      ],
    },
    {
      label: "主要痛点",
      items: [
        "不同岗位要求相似，细节差异难以把握",
        "不知道哪些工作经历最值得突出",
        "缺少可解释的岗位匹配依据",
        "修改简历后，难以追溯此前的分析结果",
      ],
    },
  ],
  responses: ["多岗位分析", "匹配详情与原因解释", "简历版本管理", "历史分析追踪"],
};

/* ---------- 4.3 用户需求与行为 ---------- */

const needStages = [
  {
    index: "01",
    title: "认识自己",
    en: "Know Yourself",
    questions: ["我有哪些能力？", "过去的项目经历能证明什么？", "我的职业资产有哪些？"],
  },
  {
    index: "02",
    title: "判断方向",
    en: "Find Direction",
    questions: ["哪些岗位更适合我？", "不同岗位之间有什么差异？", "我距离目标岗位还有多远？"],
  },
  {
    index: "03",
    title: "采取行动",
    en: "Take Action",
    questions: ["我应该优先提升什么？", "哪些经历值得补充？", "如何把建议转化为实际行动？"],
  },
  {
    index: "04",
    title: "持续积累",
    en: "Keep Growing",
    questions: ["我的能力是否有所变化？", "简历更新带来了什么变化？", "过去的分析结果能否被追溯？"],
  },
];

/* ---------- 4.4 核心用户洞察 ---------- */

const insights = [
  {
    index: "Insight 01",
    title: "经历不等于能力认知",
    desc: "用户拥有工作和项目经历，却不一定知道这些经历能证明什么能力。",
    response: "职业资产管理",
  },
  {
    index: "Insight 02",
    title: "匹配分数不等于匹配解释",
    desc: "用户不仅想知道自己是否匹配，还想知道为什么匹配、差距在哪里。",
    response: "匹配原因与能力 Gap 分析",
  },
  {
    index: "Insight 03",
    title: "单个岗位无法代表职业选择",
    desc: "用户可能同时考虑多个方向，需要横向比较岗位要求与适配程度。",
    response: "多岗位分析与排序",
  },
  {
    index: "Insight 04",
    title: "发现问题不等于知道如何行动",
    desc: "用户发现能力差距后，仍然需要具体、可理解的下一步建议。",
    response: "AI 对话与行动建议",
  },
  {
    index: "Insight 05",
    title: "职业成长需要持续记录",
    desc: "用户的能力和经历会不断变化，一次性分析无法完整呈现长期成长。",
    response: "简历版本、历史分析与职业资产沉淀",
  },
];

/* ---------- 需求 → 洞察 → 功能 ---------- */

const needMap = [
  { need: "了解自身能力", insight: "经历不等于能力认知", feature: "职业资产" },
  { need: "判断岗位适配", insight: "分数需要解释", feature: "匹配原因与 Gap" },
  { need: "比较不同方向", insight: "单个岗位无法代表选择", feature: "多岗位分析" },
  { need: "知道如何提升", insight: "发现问题不等于知道如何行动", feature: "AI 对话与行动建议" },
  { need: "记录职业变化", insight: "成长需要长期追踪", feature: "简历版本与历史分析" },
];

function PersonaAvatar({ variant }: { variant: "primary" | "secondary" }) {
  const accent = variant === "primary" ? "#7d9fef" : "#b59ad9";
  const gradientId = `cunxi-avatar-${variant}`;

  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="示意人物形象，非真实照片">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={variant === "primary" ? "#dce9fb" : "#ece4f7"} />
          <stop offset="100%" stopColor={variant === "primary" ? "#e5dcfa" : "#f6e6ee"} />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="30" fill={`url(#${gradientId})`} />
      <circle cx="60" cy="47" r="18" fill="none" stroke={accent} strokeWidth="2.2" />
      <path
        d="M25 99c4-17 17-26 35-26s31 9 35 26"
        fill="none"
        stroke={accent}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="87" cy="27" r="4" fill={accent} opacity="0.45" />
      <circle cx="32" cy="86" r="2.4" fill={accent} opacity="0.3" />
    </svg>
  );
}

export function UserResearch() {
  return (
    <section id="user-research" className="cunxi-section">
      <div className="cunxi-shell">
        <SectionHeading
          index="04"
          label="用户研究"
          enLabel="User Research"
          enSubtitle="Understanding the People Behind the Product"
          lede="寸隙并不是一个单纯帮助用户投递简历的工具。它关注的是用户如何理解自己的职业能力、判断目标岗位与自身的差距，以及如何将每一次经历转化为长期积累的职业资产。"
        />

        <Reveal delay={0.12}>
          <div className="cunxi-tag-row" style={{ marginTop: 28 }}>
            <span className="cunxi-tag cunxi-tag--accent">目标用户假设 · Proto-persona</span>
            <span className="cunxi-tag">基于产品定位推演</span>
            <span className="cunxi-tag">尚未经过正式调研验证</span>
          </div>
        </Reveal>

        {/* 4.1 用户细分 */}
        <Reveal>
          <div className="cunxi-subhead">
            <h3 className="cunxi-h3">用户细分</h3>
            <span>User Segmentation</span>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <p className="cunxi-body" style={{ maxWidth: 760 }}>
            四类用户按职业阶段、核心目标与主要困难区分。它们的差异决定了产品需要同时支持
            「建立认知」「比较方向」「准备投递」与「长期记录」，而不是只有一条求职流程。
          </p>
        </Reveal>

        <div className="cunxi-segments">
          {segments.map((segment, index) => (
            <Reveal key={segment.letter} delay={0.04 * index}>
              <div className="cunxi-segment" style={{ borderTopColor: segment.accent }}>
                <span className="cunxi-segment-letter" style={{ color: segment.accent }}>
                  {segment.letter}
                </span>
                <h4 className="cunxi-segment-title">{segment.title}</h4>
                <p className="cunxi-segment-stage">{segment.stage}</p>
                <div className="cunxi-segment-field">
                  <span>核心目标</span>
                  <p>{segment.goal}</p>
                </div>
                <div className="cunxi-segment-field">
                  <span>主要困难</span>
                  <p>{segment.pain}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.06}>
          <p className="cunxi-small" style={{ marginTop: 18 }}>
            以上属于基于产品定位形成的目标用户假设，不是正式调研的样本统计，
            也不包含用户比例或规模数据。
          </p>
        </Reveal>

        {/* 4.2 核心用户画像 */}
        <Reveal>
          <div className="cunxi-subhead">
            <h3 className="cunxi-h3">核心用户画像</h3>
            <span>User Personas</span>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <p className="cunxi-body" style={{ maxWidth: 760 }}>
            一位 Primary Persona 代表正在寻找方向、需要解释与行动的转型用户；
            一位 Secondary Persona 代表目标明确、需要横向比较与版本追踪的求职用户。
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <article className="cunxi-persona cunxi-persona--primary">
            <div className="cunxi-persona-portrait">
              <div className="cunxi-persona-avatar">
                <PersonaAvatar variant="primary" />
              </div>
              <strong>{primary.name}</strong>
              <span>PRIMARY PERSONA</span>
              <span className="cunxi-persona-flag">目标用户假设 / Proto-persona</span>
              <span className="cunxi-persona-flag cunxi-persona-flag--soft">示意形象，非真实受访者</span>
            </div>

            <div className="cunxi-persona-body">
              <div className="cunxi-persona-facts">
                {primary.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <p className="cunxi-body" style={{ marginTop: 16 }}>
                {primary.background}
              </p>

              <div className="cunxi-persona-grid">
                {primary.groups.map((group) => (
                  <div key={group.label} className="cunxi-persona-block">
                    <h4>{group.label}</h4>
                    <ul className="cunxi-list">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="cunxi-persona-block">
                  <h4>产品响应</h4>
                  <div className="cunxi-tag-row" style={{ marginTop: 10 }}>
                    {primary.responses.map((item) => (
                      <span key={item} className="cunxi-tag cunxi-tag--accent">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.06}>
          <article className="cunxi-persona cunxi-persona--secondary">
            <div className="cunxi-persona-portrait">
              <div className="cunxi-persona-avatar">
                <PersonaAvatar variant="secondary" />
              </div>
              <strong>{secondary.name}</strong>
              <span>SECONDARY PERSONA</span>
              <span className="cunxi-persona-flag cunxi-persona-flag--soft cunxi-persona-flag--stack">
                <span>目标用户假设</span>
                <span>Proto-persona</span>
              </span>
            </div>

            <div className="cunxi-persona-body">
              <div className="cunxi-persona-facts">
                {secondary.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <p className="cunxi-body" style={{ marginTop: 14 }}>
                {secondary.background}
              </p>

              <div className="cunxi-persona-grid">
                {secondary.groups.map((group) => (
                  <div key={group.label} className="cunxi-persona-block">
                    <h4>{group.label}</h4>
                    <ul className="cunxi-list">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="cunxi-persona-block" style={{ marginTop: 16 }}>
                <h4>产品响应</h4>
                <div className="cunxi-tag-row" style={{ marginTop: 10 }}>
                  {secondary.responses.map((item) => (
                    <span key={item} className="cunxi-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        {/* 4.3 用户需求与行为 */}
        <Reveal>
          <div className="cunxi-subhead">
            <h3 className="cunxi-h3">用户需求与行为</h3>
            <span>User Needs &amp; Behaviors</span>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <p className="cunxi-body" style={{ maxWidth: 760 }}>
            用户的问题沿着职业成长过程展开：先认识自己，再判断方向，然后采取行动，
            最后把结果积累下来。四个阶段构成一个循环，而不是一次性的求职流程。
          </p>
        </Reveal>

        <div className="cunxi-needs">
          {needStages.map((stage, index) => (
            <Reveal key={stage.index} delay={0.04 * index}>
              <div className="cunxi-need-stage">
                <span className="cunxi-need-index">{stage.index}</span>
                <h4 className="cunxi-need-title">{stage.title}</h4>
                <p className="cunxi-need-en">{stage.en}</p>
                <ul className="cunxi-need-list">
                  {stage.questions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 4.4 核心用户洞察 */}
        <Reveal>
          <div className="cunxi-subhead">
            <h3 className="cunxi-h3">核心用户洞察</h3>
            <span>Key Insights</span>
          </div>
        </Reveal>

        <div className="cunxi-insights">
          {insights.map((insight, index) => (
            <Reveal key={insight.index} delay={0.03 * index}>
              <div className="cunxi-insight">
                <span className="cunxi-insight-index">{insight.index}</span>
                <div>
                  <h4 className="cunxi-insight-title">{insight.title}</h4>
                  <p className="cunxi-small">{insight.desc}</p>
                </div>
                <div className="cunxi-insight-response">
                  <span>产品回应</span>
                  <strong>{insight.response}</strong>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 需求 → 洞察 → 功能 */}
        <Reveal>
          <div className="cunxi-subhead">
            <h3 className="cunxi-h3">从用户需求到产品功能</h3>
            <span>Needs → Insights → Features</span>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <p className="cunxi-body" style={{ maxWidth: 760 }}>
            这张映射把用户需求、核心洞察与产品功能放在同一条线上，
            也是从用户研究进入产品策略的接口。
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="cunxi-needmap" role="table" aria-label="用户需求、洞察与产品功能映射">
            <div className="cunxi-needmap-head" role="row">
              <span role="columnheader">用户需求 · User Needs</span>
              <span aria-hidden="true" />
              <span role="columnheader">核心洞察 · Insights</span>
              <span aria-hidden="true" />
              <span role="columnheader">产品回应 · Features</span>
            </div>

            {needMap.map((row) => (
              <div key={row.need} className="cunxi-needmap-row" role="row">
                <div className="cunxi-needmap-cell" role="cell">
                  <span className="cunxi-needmap-label">需求</span>
                  <strong>{row.need}</strong>
                </div>
                <span className="cunxi-needmap-arrow" aria-hidden="true">
                  →
                </span>
                <div className="cunxi-needmap-cell cunxi-needmap-cell--insight" role="cell">
                  <span className="cunxi-needmap-label">洞察</span>
                  <strong>{row.insight}</strong>
                </div>
                <span className="cunxi-needmap-arrow" aria-hidden="true">
                  →
                </span>
                <div className="cunxi-needmap-cell cunxi-needmap-cell--feature" role="cell">
                  <span className="cunxi-needmap-label">功能</span>
                  <strong>{row.feature}</strong>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="cunxi-note cunxi-note--soft" style={{ marginTop: 36 }}>
            <span>
              本章的用户细分、画像与洞察均来自产品定位推演，标记为待验证假设。
              没有虚构访谈人数、样本比例、问卷结果或满意度；后续若开展真实调研，
              应以实际数据替换或修正这些假设。
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
