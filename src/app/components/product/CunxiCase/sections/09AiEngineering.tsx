import { Fragment } from "react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

const layers = [
  { title: "Flutter App", desc: "四个一级 Tab · 界面与本地状态" },
  { title: "FastAPI", desc: "/api/v1 · 任务进度、取消与恢复" },
  { title: "业务服务与任务", desc: "简历解析 · 分析任务 · 职业资产沉淀" },
  { title: "LangGraph 工作流", desc: "8 节点编排 · 召回与重排两阶段匹配" },
  { title: "SQLite", desc: "15+ 张表 · 结果、历史与任务状态持久化" },
];

const workflowNodes = [
  "crawl",
  "normalize",
  "resume_embed",
  "routing",
  "match",
  "recrawl",
  "rank",
  "report",
];

const implemented = [
  "8 节点 LangGraph：crawl → normalize → resume_embed → routing → match → recrawl → rank → report",
  "Embedding 快速召回 + LLM 深度重排的两阶段匹配",
  "AI 对话 SSE 流式输出，会话在服务端持久化，可恢复、续写、删除",
  "分析任务支持进度、取消与恢复",
  "模型 Qwen3.5-Plus + DashScope text-embedding-v3",
];

const planned = [
  "分析结果的版本对比界面",
  "更细的能力维度解释与可视化",
  "更多岗位来源与简历导入方式",
];

export function AiEngineering() {
  return (
    <section id="ai-engineering" className="cunxi-section">
      <div className="cunxi-shell">
        <SectionHeading
          index="09"
          label="从界面到工作流：一条可运行的技术链路"
          enLabel="AI & Engineering"
          lede="寸隙不是一次界面概念。Flutter 客户端、FastAPI 服务、LangGraph 工作流与 SQLite 持久化共同支撑了真实可运行的职业分析流程。"
        />

        <div className="cunxi-arch">
          {layers.map((layer, index) => (
            <Fragment key={layer.title}>
              <Reveal delay={0.03 * index}>
                <div className="cunxi-arch-node">
                  <strong>{layer.title}</strong>
                  <span>{layer.desc}</span>
                </div>
              </Reveal>
              {index < layers.length - 1 && (
                <span className="cunxi-arch-arrow" aria-hidden="true">
                  ↓
                </span>
              )}
            </Fragment>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="cunxi-card" style={{ marginTop: 28 }}>
            <p className="cunxi-eyebrow">LangGraph Nodes / 8 节点</p>
            <div className="cunxi-node-list" style={{ marginTop: 14 }}>
              {workflowNodes.map((node) => (
                <code key={node}>{node}</code>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="cunxi-grid cunxi-grid--2" style={{ marginTop: 24 }}>
          <Reveal delay={0.04}>
            <div className="cunxi-card">
              <div className="cunxi-gap-col-head">
                <h3 className="cunxi-h3" style={{ margin: 0 }}>
                  已实现
                </h3>
                <span className="cunxi-badge cunxi-badge--done">IMPLEMENTED</span>
              </div>
              <ul className="cunxi-list" style={{ marginTop: 16 }}>
                {implemented.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="cunxi-card">
              <div className="cunxi-gap-col-head">
                <h3 className="cunxi-h3" style={{ margin: 0 }}>
                  规划中
                </h3>
                <span className="cunxi-badge cunxi-badge--planned">PLANNED</span>
              </div>
              <ul className="cunxi-list" style={{ marginTop: 16 }}>
                {planned.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="cunxi-note cunxi-note--soft" style={{ marginTop: 28 }}>
            <span>
              模型、端点与工作流节点依据后端代码审计整理；未完成或实验性的部分
              统一标注为「规划中」，不写成已上线能力。
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
