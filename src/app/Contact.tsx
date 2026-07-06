import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, MessageSquare, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

type FormStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; message: string };

interface FormData {
  name: string;
  email: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: FormData): string | null {
  if (!data.name.trim()) return "请输入您的姓名";
  if (!data.email.trim()) return "请输入您的邮箱";
  if (!EMAIL_REGEX.test(data.email)) return "邮箱格式不正确";
  if (!data.message.trim()) return "请输入留言内容";
  return null;
}

export function Contact() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  const setField = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (status.type === "error") setStatus({ type: "idle" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const error = validate(form);
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    setStatus({ type: "loading" });

    try {
      const { error: insertError } = await supabase.from("contacts").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      if (insertError) {
        setStatus({ type: "error", message: `提交失败：${insertError.message}` });
        return;
      }

      setStatus({ type: "success" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "网络异常，请稍后重试",
      });
    }
  };

  const inputBase = "w-full bg-transparent border-b border-[#1A1A1A]/10 py-4 focus:outline-none focus:border-[#1A1A1A] transition-colors";

  return (
    <div className="pt-32 pb-20 min-h-[90vh] flex flex-col justify-center">
      <div className="container mx-auto px-6 max-w-[1440px]">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[3rem] md:text-[5rem] font-medium tracking-[0.2em] mb-20 text-[#1A1A1A]"
          >
            SAY HELLO.
          </motion.h1>

          <div className="grid md:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <p className="text-[1.2rem] text-[#666] leading-relaxed">
                  感谢你的时间。希望这些作品不仅展示设计成果，更展现我对产品思考、系统设计与持续探索的过程。
                  如果您有任何想法，请随时联系我。期待与你交流更多可能。
                </p>
              </div>

              <div className="space-y-6 pt-10 border-t border-[#F2F2F2]">
                <a href="mailto:1350900062@qq.com" className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-[#F2F2F2] flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <span className="text-[1.1rem] text-[#1A1A1A] font-medium tracking-wide">1350900062@qq.com</span>
                </a>
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-[#F2F2F2] flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <span className="text-[1.1rem] text-[#1A1A1A] font-medium tracking-wide">微信 / ling_design</span>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-[#F2F2F2] flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <span className="text-[1.1rem] text-[#1A1A1A] font-medium tracking-wide">中国 / CHINA</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#F2F2F2] p-10 rounded-[12px]"
            >
              <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <label className="text-[0.7rem] tracking-widest text-[#999] uppercase font-bold" htmlFor="contact-name">
                    您的姓名 / NAME <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={setField("name")}
                    className={inputBase}
                    placeholder="请输入..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.7rem] tracking-widest text-[#999] uppercase font-bold" htmlFor="contact-email">
                    电子邮箱 / EMAIL <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={setField("email")}
                    className={inputBase}
                    placeholder="example@mail.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.7rem] tracking-widest text-[#999] uppercase font-bold" htmlFor="contact-message">
                    留言 / MESSAGE <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={setField("message")}
                    className={`${inputBase} resize-none`}
                    placeholder="您的想法..."
                  />
                </div>

                {/* 状态反馈 */}
                {status.type === "error" && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-[8px] text-[0.8rem] text-red-700">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{status.message}</span>
                  </div>
                )}

                {status.type === "success" && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-[8px] text-[0.8rem] text-green-700">
                    <CheckCircle size={16} className="shrink-0" />
                    <span>留言已发送！我会尽快回复您的邮件。</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.type === "loading"}
                  className="w-full py-5 bg-[#1A1A1A] text-white text-[0.8rem] tracking-widest uppercase hover:opacity-90 transition-opacity font-bold mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {status.type === "loading" ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      发送中...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      发送消息 / SEND MESSAGE
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
