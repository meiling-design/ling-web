import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  index: string;
  label: string;
  /** 眉题与默认英文副标题使用的短标签 */
  enLabel: string;
  /** 可选的完整英文标题，仅替换副标题行 */
  enSubtitle?: string;
  lede?: ReactNode;
}

export function SectionHeading({ index, label, enLabel, enSubtitle, lede }: SectionHeadingProps) {
  return (
    <div className="cunxi-section-head">
      <Reveal>
        <span className="cunxi-eyebrow">
          {index} · {enLabel}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="cunxi-h2">{label}</h2>
      </Reveal>
      <Reveal delay={0.08}>
        <p className={enSubtitle ? "cunxi-h2-en cunxi-h2-en--sub" : "cunxi-h2-en"}>
          {enSubtitle ?? enLabel}
        </p>
      </Reveal>
      {lede ? (
        <Reveal delay={0.12}>
          <p className="cunxi-lede">{lede}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
