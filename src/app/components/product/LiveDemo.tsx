/**
 * LiveDemo — JobInsight AI 可交互职位匹配 Demo
 *
 * 与 JobInsightCase 设计语言一致：
 * motion 动画 · lucide-react 图标 · --ji-* CSS 变量配色
 * 米白底色 + 科技蓝点缀
 *
 * 改进亮点：
 * - 下载报告失败不影响主结果卡片显示（red toast）
 * - 内置预设示例（当外部 URL 无法访问时使用）
 * - Playwright 代理开关
 */

import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import {
  Send, RotateCcw, Link as LinkIcon, FileText, Sparkles,
  CheckCircle2, XCircle, AlertCircle, TrendingUp, Award,
  ChevronDown, ChevronUp, Loader2, Lightbulb,
  Download, Settings, Shield, BookOpen, X,
} from "lucide-react";

/* ================================================================
   Config
   ================================================================ */

/* API 请求走 Vercel 代理 (`/api/v1/...`)；直接访问 Railway 时使用此变量 */
const API_BASE = import.meta.env.VITE_JOB_MATCHING_API_URL || "https://job-matching-api.up.railway.app";

/* ================================================================
   Preset Examples — 当外部网站无法访问时的演示示例
   ================================================================ */

interface PresetJob {
  title: string;
  description: string;
}

const PRESET_JOBS: PresetJob[] = [
  {
    title: "前端架构师 - 腾讯云",
    description: `岗位职责：
- 负责腾讯云 Web 前端架构设计与核心模块开发
- 参与低代码平台建设，提升研发效率
- 主导前端技术选型与性能优化

任职要求：
- 精通 JavaScript/TypeScript，5 年以上 React 经验
- 熟悉 Node.js 后端开发
- 有大规模前端项目架构经验
- 了解微前端、Webpack/Vite 构建工具链
- 有性能优化、前端监控体系建设经验优先`,
  },
  {
    title: "AI 产品经理 - 字节跳动",
    description: `岗位职责：
- 负责 AI 产品规划与迭代，制定产品路线图
- 深入分析用户需求，制定数据驱动的产品策略
- 协调算法、工程、设计团队推进项目落地

任职要求：
- 3 年以上互联网产品经理经验
- 熟悉 LLM/AIGC 技术原理与应用场景
- 具备优秀的数据分析能力
- 有 AI 产品从 0 到 1 经验者优先`,
  },
  {
    title: "后端工程师 - 阿里巴巴",
    description: `岗位职责：
- 设计并实现高并发、高可用的分布式系统
- 参与微服务架构设计与服务治理
- 负责核心业务系统的性能调优

任职要求：
- 精通 Java/Go，5 年以上后端开发经验
- 熟悉 Spring Cloud / K8s / Docker
- 有 MySQL、Redis、MQ 等中间件实战经验
- 熟悉分布式系统设计原则与 CAP 理论
- 有大数据处理经验优先`,
  },
  {
    title: "数据分析师 - 美团",
    description: `岗位职责：
- 负责业务数据的采集、清洗与分析
- 搭建数据看板，输出业务洞察报告
- 与产品、运营团队协作，驱动数据化决策

任职要求：
- 精通 SQL，熟练使用 Python/R 进行数据分析
- 熟悉 Tableau / Power BI 等可视化工具
- 了解统计学基础与 AB 测试方法论
- 有电商或 O2O 行业经验优先`,
  },
];

interface PresetResume {
  label: string;
  text: string;
}

const PRESET_RESUMES: PresetResume[] = [
  {
    label: "资深前端（5年）",
    text: `张三 | 高级前端工程师
工作经验：5 年
电话：138-0000-0000 | 邮箱：zhangsan@example.com

技能：React, TypeScript, Node.js, Python, Webpack, Vite, Docker, CI/CD

工作经历：
- ABC 科技 (2020-2025) 高级前端工程师
  主导前端架构升级，从 Vue 迁移至 React + TypeScript
  搭建前端监控体系，页面加载性能提升 40%
- XYZ 公司 (2018-2020) 前端工程师
  负责 B 端后台管理系统开发

教育背景：计算机科学与技术 本科`,
  },
  {
    label: "AI 产品经理（3年）",
    text: `李四 | AI 产品经理
工作经验：3 年
电话：139-0000-0000 | 邮箱：lisi@example.com

技能：产品规划, AIGC, 数据分析, Figma, SQL, 用户研究

工作经历：
- DEF 科技 (2022-2025) AI 产品经理
  负责 LLM 对话产品从 0 到 1 规划与落地
  用户量突破 100 万，留存率提升 25%
- GHI 公司 (2020-2022) 产品助理
  支持数据分析与竞品调研

教育背景：信息管理与信息系统 本科`,
  },
  {
    label: "后端工程师（5年）",
    text: `王五 | 后端工程师
工作经验：5 年
电话：137-0000-0000 | 邮箱：wangwu@example.com

技能：Java, Go, Spring Cloud, K8s, Docker, MySQL, Redis, RocketMQ

工作经历：
- JKL 科技 (2021-2025) 高级后端工程师
  设计高并发订单系统，QPS 峰值 10w+
  主导微服务拆分与服务治理
- MNO 公司 (2019-2021) 后端工程师
  参与电商平台核心模块开发

教育背景：软件工程 本科`,
  },
];

/* ================================================================
   Types
   ================================================================ */

interface MatchResponse {
  session_id: string;
  status: string;
  routing_decision: string;
  routing_reason: string;
  jobs_found: number;
  jobs_matched: number;
  top_score: number | null;
  top_job: string | null;
  average_score: number | null;
  errors: string[];
}

interface MatchResult {
  job?: { title?: string; company?: string; location?: string };
  title?: string;
  company?: string;
  score: number;
  grade?: string;
  semantic_score?: number | null;
  llm_score?: number | null;
  skill_overlap?: string[];
  missing_skills?: string[];
  partial_skills?: string[];
  match_reasons?: string[];
  recommendations?: string[];
}

/* API 响应包装（Railway 后端统一格式） */
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
  meta: { timestamp: number; version: string };
}

/* 异步任务状态（用于轮询） */
interface TaskData {
  task_id: string;
  status: string;           // "pending" | "running" | "completed" | "failed"
  is_running: boolean;
  created_at: number;
  updated_at: number;
  progress: {
    current_node: string | null;
    node_status: string | null;
    completed_nodes: number;
    total_nodes: number;
    percent: string;
  };
  errors: string[];
  session_id?: string;
  jobs_found?: number;
  jobs_matched?: number;
  top_score?: number | null;
  top_job?: string | null;
  average_score?: number | null;
  routing_decision?: string;
  routing_reason?: string;
}

interface SessionData {
  session_id: string;
  match_results?: MatchResult[];
}

type DemoStatus = "input" | "loading" | "result" | "error";

/* ================================================================
   Helpers
   ================================================================ */

function getGrade(score: number): string {
  if (score >= 0.85) return "A";
  if (score >= 0.70) return "B";
  if (score >= 0.50) return "C";
  return "D";
}

/** 生成纯文本文档版报告 */
function generateReportText(response: MatchResponse, sessionData: SessionData | null): string {
  const results = sessionData?.match_results || [];
  const lines: string[] = [
    "==============================================",
    "  JobInsight AI — 职位匹配分析报告",
    "==============================================",
    "",
    `生成时间: ${new Date().toLocaleString("zh-CN")}`,
    `会话 ID: ${response.session_id}`,
    `路由决策: ${response.routing_decision} — ${response.routing_reason}`,
    "",
    "----------------------------------------------",
    "  摘要",
    "----------------------------------------------",
    "",
    `职位总量: ${response.jobs_found}`,
    `匹配通过: ${response.jobs_matched}`,
    `最佳匹配: ${response.top_job || "—"} (${response.top_score != null ? (response.top_score * 100).toFixed(1) + "%" : "—"})`,
    `平均分数: ${response.average_score != null ? (response.average_score * 100).toFixed(1) + "%" : "—"}`,
    "",
    "----------------------------------------------",
    "  详细匹配结果",
    "----------------------------------------------",
    "",
  ];

  results.forEach((r, i) => {
    const name = r.job?.title || r.title || "未知职位";
    const company = r.job?.company || r.company || "";
    const score = r.score ?? 0;
    lines.push(`#${i + 1}  ${name}${company ? " @ " + company : ""}`);
    lines.push(`   匹配度: ${(score * 100).toFixed(1)}% (等级: ${getGrade(score)})`);
    if (r.semantic_score != null) lines.push(`   语义分: ${(r.semantic_score * 100).toFixed(0)}%`);
    if (r.llm_score != null) lines.push(`   LLM 分: ${(r.llm_score * 100).toFixed(0)}%`);
    if (r.skill_overlap?.length) lines.push(`   技能匹配: ${r.skill_overlap.join(", ")}`);
    if (r.missing_skills?.length) lines.push(`   待提升: ${r.missing_skills.join(", ")}`);
    if (r.recommendations?.length) lines.push(`   建议: ${r.recommendations.slice(0, 2).join("; ")}`);
    lines.push("");
  });

  lines.push("==============================================");
  lines.push("  报告由 JobInsight AI 自动生成");
  lines.push("==============================================");

  return lines.join("\n");
}

/* ================================================================
   LiveDemo Component
   ================================================================ */

export function LiveDemo() {
  const [status, setStatus] = useState<DemoStatus>("input");
  const [urls, setUrls] = useState([""]);
  const [resumeText, setResumeText] = useState("");
  const [jobMode, setJobMode] = useState<"url" | "text">("url");
  const [jobDescription, setJobDescription] = useState("");
  const [response, setResponse] = useState<MatchResponse | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [error, setError] = useState("");
  const [expandedResults, setExpandedResults] = useState(false);

  /* ---- 降级/演示相关状态 ---- */
  const [useProxy, setUseProxy] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [toast, setToast] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [showDemoLimitModal, setShowDemoLimitModal] = useState(false);

  /* ---- Toast 自动消失 ---- */
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  /* ---- 预设示例选择 ---- */
  const handleSelectPreset = useCallback((title: string) => {
    const job = PRESET_JOBS.find((j) => j.title === title);
    if (job) {
      setJobMode("text");
      setJobDescription(job.description);
      setShowPresets(false);
    }
  }, []);

  const handleSelectPresetResume = useCallback((label: string) => {
    const preset = PRESET_RESUMES.find((p) => p.label === label);
    if (preset) {
      setResumeText(preset.text);
      setShowPresets(false);
    }
  }, []);

  const addUrl = () => setUrls((prev) => [...prev, ""]);
  const updateUrl = (i: number, v: string) =>
    setUrls((prev) => prev.map((u, idx) => (idx === i ? v : u)));
  const removeUrl = (i: number) =>
    setUrls((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const handleSubmit = useCallback(async () => {
    const validUrls = urls.map((u) => u.trim()).filter(Boolean);
    if (jobMode === "url") {
      if (!validUrls.length || !resumeText.trim()) return;
    } else {
      if (!jobDescription.trim() || !resumeText.trim()) return;
    }

    setStatus("loading");
    setError("");
    setResponse(null);
    setSessionData(null);
    setDownloadStatus("idle");

    /* ---- 文本模式：本地模拟演示 ---- */
    if (jobMode === "text") {
      await new Promise(r => setTimeout(r, 1500));
      const jWords = jobDescription.toLowerCase().split(/[\s,，、\n().;；:：]+/).filter(w => w.length > 2);
      const rWords = resumeText.toLowerCase().split(/[\s,，、\n().;；:：]+/).filter(w => w.length > 2);
      const common = [...new Set(jWords.filter(w => rWords.includes(w)))];
      const baseScore = Math.min(0.92, Math.max(0.2, common.length / Math.max(jWords.length * 0.15, 1)));

      const mockResults: MatchResult[] = [{
        title: "模拟匹配结果",
        company: "文本模式（离线演示）",
        score: baseScore,
        skill_overlap: common.slice(0, 10),
        missing_skills: common.length < 3 ? ["建议使用职位链接进行精确匹配"] : [],
        match_reasons: common.length > 2
          ? [`简历包含 ${common.slice(0, 3).join("、")} 等关键词`]
          : ["文本模式基于关键词简单匹配"],
        recommendations: ["切换到「职位链接」模式获得 AI 精确多维匹配"],
      }];

      setResponse({
        session_id: "demo-" + Date.now(),
        status: "completed",
        routing_decision: "text_demo",
        routing_reason: "文本模式为离线演示，使用职位链接可获得精确 AI 匹配",
        jobs_found: 1,
        jobs_matched: 1,
        top_score: baseScore,
        top_job: "文本模式演示",
        average_score: baseScore,
        errors: [],
      });
      setSessionData({ session_id: "demo", match_results: mockResults });
      setStatus("result");
      return;
    }

    /* ---- URL 模式：异步 API + 轮询 ---- */
    try {
      const res = await fetch("/api/v1/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_urls: validUrls,
          resume_text: resumeText.trim(),
          use_llm: true,
          use_embedding: true,
        }),
      });

      const wrapper: ApiResponse<{ task_id: string; status: string; status_url: string }> = await res.json();

      if (!res.ok || !wrapper.success) {
        if (wrapper.error?.code === "DEMO_LIMIT_REACHED") {
          setShowDemoLimitModal(true);
          setStatus("input");
          return;
        }
        throw new Error(wrapper.error?.message || `HTTP ${res.status}`);
      }

      const taskId = wrapper.data!.task_id;

      /* 轮询任务，最多 120 秒 (60 次 × 2s) */
      let taskData: TaskData | null = null;
      for (let attempt = 0; attempt < 60; attempt++) {
        await new Promise(r => setTimeout(r, 2000));
        try {
          const pollRes = await fetch(`/api/v1/tasks/${taskId}`);
          const pollWrap: ApiResponse<TaskData> = await pollRes.json();
          if (!pollWrap.success || !pollWrap.data) continue;

          taskData = pollWrap.data;
          if (taskData.status === "completed") break;
          if (taskData.status === "failed") {
            throw new Error(taskData.errors?.join("; ") || "匹配任务执行失败");
          }
        } catch (e) {
          if (e instanceof Error && (e.message.includes("执行失败") || e.message.includes("超时"))) throw e;
          /* 网络抖动继续轮询 */
        }
      }

      if (!taskData || taskData.status !== "completed") {
        throw new Error("匹配超时，请稍后重试");
      }

      /* 构建 MatchResponse */
      setResponse({
        session_id: taskData.session_id || taskId,
        status: "completed",
        routing_decision: taskData.routing_decision || "",
        routing_reason: taskData.routing_reason || "",
        jobs_found: taskData.jobs_found || 0,
        jobs_matched: taskData.jobs_matched || 0,
        top_score: taskData.top_score ?? null,
        top_job: taskData.top_job ?? null,
        average_score: taskData.average_score ?? null,
        errors: taskData.errors || [],
      });

      /* 拉取详细匹配结果 */
      if (taskData.session_id) {
        try {
          const sessRes = await fetch(`/api/v1/sessions/${taskData.session_id}`);
          const sessWrap: ApiResponse<SessionData> = await sessRes.json();
          if (sessWrap.success && sessWrap.data) setSessionData(sessWrap.data);
        } catch { /* 非关键 */ }
      }

      setStatus("result");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "未知错误";
      setError(msg);
      if (msg.includes("超时") || msg.includes("执行失败")) {
        setError(msg + " — 可尝试使用「预设示例」离线体验");
      }
      setStatus("error");
    }
  }, [urls, resumeText, jobMode, jobDescription]);

  /* ---- 下载报告（降级友好） ---- */
  const handleDownload = useCallback(async () => {
    if (!response) return;
    setDownloadStatus("loading");

    try {
      // 优先尝试 API 下载端点（通过 Vercel 代理）
      const reportRes = await fetch(`/api/v1/sessions/${response.session_id}/report?fmt=json`, {
        method: "GET",
      });

      if (reportRes.ok) {
        const blob = await reportRes.blob();
        const urlObj = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = urlObj;
        a.download = `job-match-report-${response.session_id}.pdf`;
        a.click();
        URL.revokeObjectURL(urlObj);
        setDownloadStatus("success");
        setToast({ type: "success", message: "报告下载成功" });
        return;
      }
      // API 端点不存在或失败 → 走客户端降级
      throw new Error("API 报告端点不可用");
    } catch {
      // 降级：生成纯文本报告
      try {
        const text = generateReportText(response, sessionData);
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const urlObj = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = urlObj;
        a.download = `job-match-report-${response.session_id}.txt`;
        a.click();
        URL.revokeObjectURL(urlObj);

        setDownloadStatus("success");
        // 虽然后台下载失败，但客户端生成了降级版 → 轻提醒但不阻塞
        setToast({
          type: "error",
          message: "报告后台下载失败，已生成纯文本降级版；评分结果仍在页面展示",
        });
      } catch {
        // 完全失败 → toast 提醒，主结果卡片不受影响
        setDownloadStatus("error");
        setToast({
          type: "error",
          message: "报告下载失败，但评分与匹配结果仍然可用",
        });
      }
    }
  }, [response, sessionData]);

  const handleReset = useCallback(() => {
    setStatus("input");
    setResponse(null);
    setSessionData(null);
    setError("");
    setExpandedResults(false);
    setDownloadStatus("idle");
    setToast(null);
  }, []);

  const isFormValid = (
    jobMode === "url" ? urls.some((u) => u.trim()) : jobDescription.trim().length > 0
  ) && resumeText.trim().length > 0;

  /* ==============================================================
     Render: Input State
     ============================================================== */
  if (status === "input") {
    return (
      <>
        {showDemoLimitModal && <DemoLimitModal onClose={() => setShowDemoLimitModal(false)} />}
        <div className="ji-demo">
        <div className="ji-demo-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--ji-blue-light)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[var(--ji-blue)]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--ji-text)]">在线体验</h3>
              <p className="text-xs text-[var(--ji-muted)]">输入职位链接和简历，体验 AI 智能匹配</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* ================================================
                 Mode Toggle + Advanced Settings
                 ================================================ */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ji-text)] mb-2">
                职位来源
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setJobMode("url")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    jobMode === "url"
                      ? "bg-[var(--ji-blue)] text-white shadow-sm"
                      : "bg-white/80 text-[var(--ji-text)] border border-black/10 hover:border-[var(--ji-blue)]/30"
                  }`}
                >
                  职位链接
                </button>
                <button
                  type="button"
                  onClick={() => setJobMode("text")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    jobMode === "text"
                      ? "bg-[var(--ji-blue)] text-white shadow-sm"
                      : "bg-white/80 text-[var(--ji-text)] border border-black/10 hover:border-[var(--ji-blue)]/30"
                  }`}
                >
                  岗位描述
                </button>
              </div>

              {/* ★ 高级设置 + 预设示例入口 */}
              {(jobMode === "url") && (
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[0.65rem] font-medium transition-colors ${
                      showSettings
                        ? "bg-[var(--ji-blue-light)] text-[var(--ji-blue)]"
                        : "text-[var(--ji-muted)] hover:text-[var(--ji-text)] hover:bg-white/60"
                    }`}
                  >
                    <Settings className="w-3 h-3" />
                    高级设置
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[0.65rem] font-medium text-[var(--ji-muted)] hover:text-[var(--ji-text)] hover:bg-white/60 transition-colors"
                  >
                    <BookOpen className="w-3 h-3" />
                    预设示例
                  </button>
                </div>
              )}

              {/* ★ 高级设置面板：Playwright 代理开关 */}
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 p-3 rounded-lg bg-white/60 border border-black/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[var(--ji-muted)]" />
                      <span className="text-xs text-[var(--ji-text)] font-medium">Playwright 代理</span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={useProxy}
                      onClick={() => setUseProxy(!useProxy)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${
                        useProxy ? "bg-[var(--ji-blue)]" : "bg-black/20"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                          useProxy ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[0.6rem] text-[var(--ji-muted)] mt-1.5 leading-relaxed">
                    开启后通过 Playwright 代理抓取外部职位页面，可绕过部分反爬限制。
                    若关闭且 URL 无法访问，可使用左侧"预设示例"进行演示。
                  </p>
                </motion.div>
              )}

              {/* ★ 预设示例面板 */}
              {showPresets && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 p-3 rounded-lg bg-white/60 border border-black/5"
                >
                  <p className="text-[0.6rem] font-medium text-[var(--ji-muted)] mb-2">
                    选择预设职位和简历，快速体验 AI 匹配逻辑
                  </p>

                  {/* 预设职位 */}
                  <div className="mb-2">
                    <p className="text-[0.55rem] font-semibold text-[var(--ji-text)] uppercase tracking-wider mb-1.5">职位预设</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PRESET_JOBS.map((job) => (
                        <button
                          key={job.title}
                          type="button"
                          onClick={() => handleSelectPreset(job.title)}
                          className="text-left px-2.5 py-2 rounded-md bg-white/80 border border-black/5 hover:border-[var(--ji-blue)]/30 hover:bg-white text-[0.65rem] text-[var(--ji-text)] transition-all"
                        >
                          <span className="font-medium block truncate">{job.title}</span>
                          <span className="text-[0.55rem] text-[var(--ji-muted)] block mt-0.5">
                            {job.description.split("\n")[0].replace("岗位职责：", "").replace("岗位职责：", "").trim().slice(0, 30)}…
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 预设简历 */}
                  <div>
                    <p className="text-[0.55rem] font-semibold text-[var(--ji-text)] uppercase tracking-wider mb-1.5">简历预设</p>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_RESUMES.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => handleSelectPresetResume(p.label)}
                          className="px-2.5 py-1.5 rounded-md bg-white/80 border border-black/5 hover:border-[var(--ji-blue)]/30 hover:bg-white text-[0.65rem] text-[var(--ji-text)] transition-all"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ================================================
                 Job Input
                 ================================================ */}
            {jobMode === "url" ? (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ji-text)] mb-2">
                  <LinkIcon className="w-3.5 h-3.5 text-[var(--ji-blue)]" />
                  职位链接
                </label>
                <div className="space-y-2">
                  {urls.map((url, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-[var(--ji-muted)] w-4 shrink-0">{i + 1}</span>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateUrl(i, e.target.value)}
                        placeholder="https://careers.tencent.com/jobdesc.html?postId=..."
                        className="flex-1 px-3 py-2 rounded-lg border border-black/10 text-sm text-[var(--ji-text)] bg-white/80 placeholder:text-[var(--ji-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ji-blue)]/30 focus:border-[var(--ji-blue)] transition-all"
                      />
                      {urls.length > 1 && (
                        <button
                          onClick={() => removeUrl(i)}
                          className="p-1.5 rounded-lg text-[var(--ji-muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addUrl}
                  className="mt-2 text-xs text-[var(--ji-blue)] hover:text-[var(--ji-text)] transition-colors flex items-center gap-1"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  添加链接
                </button>
              </div>
            ) : (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ji-text)] mb-2">
                  <FileText className="w-3.5 h-3.5 text-[var(--ji-blue)]" />
                  岗位描述
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  placeholder={`粘贴岗位 JD，例如：

负责 AI 产品规划
熟悉 LLM
负责用户需求分析...`}
                  className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm text-[var(--ji-text)] bg-white/80 placeholder:text-[var(--ji-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ji-blue)]/30 focus:border-[var(--ji-blue)] transition-all font-mono leading-relaxed"
                />
              </div>
            )}

            {/* ================================================
                 Resume
                 ================================================ */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ji-text)] mb-2">
                <FileText className="w-3.5 h-3.5 text-[var(--ji-blue)]" />
                简历内容
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={6}
                placeholder={`张三\n高级前端工程师 | 5年经验\n技能: React, TypeScript, Node.js, Python...`}
                className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm text-[var(--ji-text)] bg-white/80 placeholder:text-[var(--ji-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ji-blue)]/30 focus:border-[var(--ji-blue)] transition-all font-mono leading-relaxed"
              />
            </div>

            {/* ================================================
                 Actions
                 ================================================ */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--ji-blue)] hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                开始匹配
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  /* ==============================================================
     Render: Loading State
     ============================================================== */
  if (status === "loading") {
    return (
      <>
        {showDemoLimitModal && <DemoLimitModal onClose={() => setShowDemoLimitModal(false)} />}
        <div className="ji-demo">
        <div className="ji-demo-card p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-[var(--ji-blue)] animate-spin mb-4" />
          <p className="text-base font-medium text-[var(--ji-text)] mb-2">AI 正在分析...</p>
          <p className="text-sm text-[var(--ji-muted)]">
            爬取职位 → 解析简历 → 语义匹配 → LLM 评分
          </p>
          <div className="flex gap-2 mt-6">
            {["🔍", "📄", "🧠", "📊"].map((emoji, i) => (
              <motion.span
                key={emoji}
                className="text-xl"
                initial={{ opacity: 0.3, y: 0 }}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
                transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  }

  /* ==============================================================
     Render: Error State
     ============================================================== */
  if (status === "error") {
    return (
      <>
        {showDemoLimitModal && <DemoLimitModal onClose={() => setShowDemoLimitModal(false)} />}
        <div className="ji-demo">
        <div className="ji-demo-card p-6">
          <div className="flex items-start gap-3 mb-4">
            <XCircle className="w-6 h-6 text-red-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-[var(--ji-text)]">运行出错</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>

          {error.includes("反爬") || error.includes("无法访问") || error.includes("403") || error.includes("fetch") ? (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-[0.65rem] text-amber-800 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                外部网站可能存在反爬限制。试试
                <button
                  type="button"
                  onClick={() => { handleReset(); setShowPresets(true); }}
                  className="underline font-medium hover:text-amber-900"
                >
                  预设示例
                </button>
                ，无需网络访问即可体验。
              </p>
            </div>
          ) : null}

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-[var(--ji-muted)] hover:text-[var(--ji-text)] border border-black/10 hover:bg-white/60 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重试
          </button>
        </div>
      </div>
      </>
    );
  }

  /* ==============================================================
     Render: Result State
     ============================================================== */
  const results = sessionData?.match_results || [];
  const topJobs = results.slice(0, 3);
  const showCount = expandedResults ? results.length : 3;

  return (
    <>
      {showDemoLimitModal && <DemoLimitModal onClose={() => setShowDemoLimitModal(false)} />}
      <div className="ji-demo">
      {/* ★ Toast 通知 — 独立于主内容渲染，不影响结果 */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`ji-toast ${toast.type === "error" ? "ji-toast--error" : "ji-toast--success"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span className="text-xs">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-auto p-0.5 rounded hover:bg-black/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Summary row — 主结果卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <SummaryCard icon={Award} label="最佳匹配" value={response?.top_job || "—"} sub={response?.top_score != null ? `${(response.top_score * 100).toFixed(1)}%` : ""} />
        <SummaryCard icon={TrendingUp} label="平均分" value={response?.average_score != null ? `${(response.average_score * 100).toFixed(1)}%` : "—"} sub={`${response?.jobs_matched || 0} 个匹配`} />
        <SummaryCard icon={AlertCircle} label="职位总量" value={`${response?.jobs_found || 0}`} sub={`${response?.jobs_matched || 0} 个通过`} />
      </div>

      {/* Results */}
      <div className="ji-demo-card divide-y divide-black/5">
        <div className="px-5 py-3 flex items-center justify-between">
          <h4 className="text-xs font-bold text-[var(--ji-text)] uppercase tracking-wider">匹配排名</h4>
          <span className="text-[0.65rem] text-[var(--ji-muted)]">{results.length} 个职位</span>
        </div>

        {(results.length > 0 ? results.slice(0, showCount) : topJobs.length > 0 ? topJobs : []).map((r, i) => (
          <ResultRow key={i} result={r} rank={i + 1} />
        ))}

        {results.length > 3 && (
          <button
            onClick={() => setExpandedResults(!expandedResults)}
            className="w-full px-5 py-3 text-xs text-[var(--ji-blue)] hover:text-blue-700 hover:bg-[var(--ji-blue-light)] transition-colors flex items-center justify-center gap-1"
          >
            {expandedResults ? (
              <>收起 <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>查看全部 {results.length} 个 <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        )}
      </div>

      {/* Routing decision */}
      {response?.routing_decision && (
        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--ji-muted)] bg-white/50 rounded-lg px-4 py-2 border border-black/5">
          <span className="font-medium">路由决策:</span>
          <span className="text-[var(--ji-blue)] font-semibold">{response.routing_decision}</span>
          <span className="text-black/30">·</span>
          <span>{response.routing_reason}</span>
        </div>
      )}

      {/* ★ 辅助操作：下载报告 + 重置 — 下载失败不影响上方主结果 */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleDownload}
          disabled={downloadStatus === "loading"}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-[var(--ji-blue)] hover:text-white hover:bg-[var(--ji-blue)] border border-[var(--ji-blue)]/30 hover:border-[var(--ji-blue)] transition-all disabled:opacity-40"
        >
          {downloadStatus === "loading" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {downloadStatus === "loading" ? "下载中..." : "下载报告"}
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-[var(--ji-muted)] hover:text-[var(--ji-text)] border border-black/10 hover:bg-white/60 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重新体验
        </button>
      </div>
    </div>
    </>
  );
}

/* ================================================================
   Sub-components
   ================================================================ */

function SummaryCard({ icon: Icon, label, value, sub }: {
  icon: typeof Award;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-black/5 bg-white p-4 flex items-start gap-3 shadow-sm"
    >
      <div className="w-9 h-9 rounded-xl bg-[var(--ji-blue-light)] flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-[var(--ji-blue)]" />
      </div>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-medium text-[var(--ji-muted)]">{label}</p>
        <p className="text-sm font-semibold text-[var(--ji-text)] truncate">{value || "—"}</p>
        {sub && <p className="text-[0.6rem] text-[var(--ji-muted)] mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

function ResultRow({ result, rank }: { result: MatchResult; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const score = result.score ?? 0;
  const grade = getGrade(score);
  const jobName = result.job?.title || result.title || "未知职位";
  const company = result.job?.company || result.company || "";
  const location = result.job?.location || "";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
    >
      <div
        className="px-5 py-3.5 hover:bg-white/60 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          {/* Rank */}
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
            ${rank === 1 ? "bg-amber-100 text-amber-700" :
              rank === 2 ? "bg-slate-100 text-slate-600" :
              rank === 3 ? "bg-blue-100 text-blue-700" :
              "bg-black/5 text-[var(--ji-muted)]"}`}
          >
            #{rank}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-[var(--ji-text)]">{jobName}</h4>
                {company && (
                  <p className="text-xs text-[var(--ji-muted)] mt-0.5">
                    {company}{location ? ` · ${location}` : ""}
                  </p>
                )}
              </div>
              <GradeBadge grade={grade} score={score} />
            </div>

            {/* Score bar */}
            <div className="mt-2 h-1.5 rounded-full bg-black/5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  grade === "A" ? "bg-emerald-500" :
                  grade === "B" ? "bg-blue-500" :
                  grade === "C" ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${score * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[0.6rem] text-[var(--ji-muted)]">
                得分 {(score * 100).toFixed(1)}%
              </span>
              {result.semantic_score != null && (
                <span className="text-[0.6rem] text-[var(--ji-muted)]">
                  语义 {(result.semantic_score * 100).toFixed(0)}%
                </span>
              )}
              {result.llm_score != null && (
                <span className="text-[0.6rem] text-[var(--ji-muted)]">
                  LLM {(result.llm_score * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>

          {/* Expand */}
          <ChevronDown className={`w-4 h-4 text-[var(--ji-muted)] shrink-0 mt-1 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-3 ml-10 space-y-3">
            {/* Match reasons */}
            {result.match_reasons && result.match_reasons.length > 0 && (
              <div>
                <h5 className="text-[0.65rem] font-semibold text-emerald-700 flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  匹配项
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {result.skill_overlap?.slice(0, 8).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[0.6rem] bg-emerald-50 text-emerald-700 border border-emerald-200">{s}</span>
                  ))}
                </div>
                <ul className="mt-1 space-y-0.5">
                  {result.match_reasons.slice(0, 3).map((r, i) => (
                    <li key={i} className="text-[0.65rem] text-emerald-600 flex items-start gap-1">
                      <span className="mt-1 w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing skills */}
            {result.missing_skills && result.missing_skills.length > 0 && (
              <div>
                <h5 className="text-[0.65rem] font-semibold text-red-600 flex items-center gap-1 mb-1.5">
                  <XCircle className="w-3 h-3" />
                  待提升
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {result.missing_skills.slice(0, 6).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[0.6rem] bg-red-50 text-red-700 border border-red-200">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div>
                <h5 className="text-[0.65rem] font-semibold text-indigo-600 flex items-center gap-1 mb-1.5">
                  <Lightbulb className="w-3 h-3" />
                  建议
                </h5>
                <ul className="space-y-0.5">
                  {result.recommendations.slice(0, 2).map((r, i) => (
                    <li key={i} className="text-[0.65rem] text-[var(--ji-text)] flex items-start gap-1">
                      <span className="mt-1 w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ================================================================
   DemoLimitModal — Demo 体验次数已用完弹窗
   ================================================================ */

function DemoLimitModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-[var(--ji-text)] mb-2">Demo体验次数已完成</h3>
        <p className="text-sm text-[var(--ji-muted)] mb-6 leading-relaxed">
          当前版本开放一次完整Agent体验
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--ji-blue)] hover:bg-blue-700 transition-all"
        >
          知道了
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   GradeBadge
   ================================================================ */

function GradeBadge({ grade, score }: { grade: string; score: number }) {
  const styles: Record<string, string> = {
    A: "bg-emerald-100 text-emerald-700 border-emerald-300",
    B: "bg-blue-100 text-blue-700 border-blue-300",
    C: "bg-amber-100 text-amber-700 border-amber-300",
    D: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[0.6rem] font-bold border shrink-0 ${styles[grade] || styles.D}`}>
      {grade}
    </span>
  );
}
