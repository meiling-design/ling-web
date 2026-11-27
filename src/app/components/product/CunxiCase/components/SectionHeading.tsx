import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  index: string;
  label: string;
  enLabel: string;
  lede?: ReactNode;
}

export function SectionHeading({ index, label, enLabel, lede }: SectionHeadingProps) {
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
        <p className="cunxi-h2-en">{enLabel}</p>
      </Reveal>
      {lede ? (
        <Reveal delay={0.12}>
          <p className="cunxi-lede">{lede}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
