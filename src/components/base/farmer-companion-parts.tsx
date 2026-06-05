"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";

export function FarmerSprite({
  mood,
  size = 56,
}: {
  mood: "happy" | "thinking" | "worried" | "excited";
  size?: number;
}) {
  const hatColor = mood === "worried" ? "var(--danger)" : "var(--warning)";
  const skin = mood === "excited" ? "var(--primary)" : "color-mix(in srgb, var(--warning) 35%, white)";
  const eyeChar = mood === "thinking" ? "–" : mood === "worried" ? ">" : "•";

  return (
    <svg
      width={size}
      height={size * 1.125}
      viewBox="0 0 32 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="7" width="24" height="3" rx="1.5" fill={hatColor} />
      <rect x="8" y="1" width="16" height="8" rx="3" fill={hatColor} />
      <rect x="8" y="7" width="16" height="2" rx="1" fill="var(--warning)" />
      <ellipse cx="16" cy="16" rx="9" ry="10" fill={skin} />
      <text x="11.5" y="16.5" fontSize="3.8" fill="var(--neutral-700)" fontWeight="bold">
        {eyeChar}
      </text>
      <text x="18" y="16.5" fontSize="3.8" fill="var(--neutral-700)" fontWeight="bold">
        {eyeChar}
      </text>
      {mood === "happy" || mood === "excited" ? (
        <path d="M12 20 Q16 24 20 20" stroke="var(--neutral-700)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      ) : mood === "worried" ? (
        <path d="M12 22 Q16 19 20 22" stroke="var(--neutral-700)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      ) : (
        <rect x="12" y="20" width="8" height="1.5" rx="0.75" fill="var(--neutral-700)" />
      )}
      <ellipse cx="9" cy="18" rx="2.5" ry="1.5" fill="var(--danger)" opacity="0.18" />
      <ellipse cx="23" cy="18" rx="2.5" ry="1.5" fill="var(--danger)" opacity="0.18" />
      <rect x="9" y="25" width="14" height="10" rx="3" fill="var(--success)" />
      <rect x="10" y="24" width="4" height="10" rx="2" fill="var(--success-strong)" />
      <rect x="18" y="24" width="4" height="10" rx="2" fill="var(--success-strong)" />
      <rect x="10" y="29" width="4" height="4" rx="1" fill="var(--success-strong)" />
      <rect x="18" y="29" width="4" height="4" rx="1" fill="var(--success-strong)" />
    </svg>
  );
}

export function MarketBadge({ agentData }: { agentData: GardenAgentResult | null }) {
  if (!agentData) return null;
  const moodVal = agentData.marketMood.mood;
  const Icon = moodVal === "bullish" ? TrendingUp : moodVal === "bearish" ? TrendingDown : Minus;
  const styles = {
    bullish: "border-emerald-200 bg-emerald-50 text-emerald-700",
    neutral: "border-amber-200 bg-amber-50 text-amber-700",
    bearish: "border-red-200 bg-red-50 text-red-700",
  }[moodVal];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black ${styles}`}>
      <Icon className="size-3" />
      {moodVal.charAt(0).toUpperCase() + moodVal.slice(1)}
    </span>
  );
}

export function ThinkingBubble() {
  return (
    <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-[var(--surface-soft)] p-1">
      <motion.span
        className="relative flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-200/80"
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute size-2 rounded-full bg-emerald-500/80" />
      </motion.span>
      <div className="flex items-center gap-1">
        {[0, 0.18, 0.36].map((delay) => (
          <motion.span
            key={delay}
            className="block size-1.5 rounded-full bg-emerald-500"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay }}
          />
        ))}
      </div>
    </div>
  );
}

function isSafeHref(href: string) {
  try {
    const url = new URL(href, "https://example.com");
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const output: ReactNode[] = [];
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let index = 0;

  for (const match of text.matchAll(regex)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      output.push(text.slice(lastIndex, start));
    }

    const [raw, _linkLabel, linkText, linkHref, boldText, codeText, italicText] = match;
    if (linkText && linkHref) {
      if (isSafeHref(linkHref)) {
        output.push(
          <a
            key={`${keyPrefix}-link-${index++}`}
            href={linkHref}
            target="_blank"
            rel="noreferrer noopener"
            className="text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
          >
            {linkText}
          </a>,
        );
      } else {
        output.push(linkText);
      }
    } else if (boldText) {
      output.push(
        <strong key={`${keyPrefix}-bold-${index++}`} className="font-bold text-[var(--text)]">
          {boldText}
        </strong>,
      );
    } else if (codeText) {
      output.push(
        <code
          key={`${keyPrefix}-code-${index++}`}
          className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.93em] text-emerald-900"
        >
          {codeText}
        </code>,
      );
    } else if (italicText) {
      output.push(
        <em key={`${keyPrefix}-italic-${index++}`} className="italic text-[var(--text)]">
          {italicText}
        </em>,
      );
    } else {
      output.push(raw);
    }

    lastIndex = start + raw.length;
  }

  if (lastIndex < text.length) {
    output.push(text.slice(lastIndex));
  }

  return output.length ? output : [text];
}

export function MarkdownMessage({ text }: { text: string }) {
  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;
  let blockIndex = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length && lines[i].startsWith("```")) i += 1;

      nodes.push(
        <pre
          key={`code-${blockIndex++}`}
          className="overflow-x-auto rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-[11px] leading-5 text-emerald-950"
        >
          {language ? <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-600">{language}</div> : null}
          <code className="font-mono whitespace-pre-wrap">{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const textValue = heading[2] ?? "";
      nodes.push(
        <div
          key={`heading-${blockIndex++}`}
          className={level === 1 ? "text-sm font-black" : level === 2 ? "text-[13px] font-black" : "text-[12px] font-bold"}
        >
          {renderInlineMarkdown(textValue, `heading-${blockIndex}`)}
        </div>,
      );
      i += 1;
      continue;
    }

    if (/^>\s+/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s+/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s+/, ""));
        i += 1;
      }
      nodes.push(
        <blockquote
          key={`quote-${blockIndex++}`}
          className="border-l-2 border-emerald-300 pl-3 text-[11px] italic text-[var(--text-muted)]"
        >
          {renderInlineMarkdown(quoteLines.join(" "), `quote-${blockIndex}`)}
        </blockquote>,
      );
      continue;
    }

    if (/^(\-|\*|\d+\.)\s+/.test(line)) {
      const items: Array<{ ordered: boolean; text: string }> = [];
      while (i < lines.length && /^(\-|\*|\d+\.)\s+/.test(lines[i])) {
        const current = lines[i];
        const ordered = /^\d+\./.test(current);
        items.push({ ordered, text: current.replace(/^(\-|\*|\d+\.)\s+/, "") });
        i += 1;
      }
      const ordered = items.some((item) => item.ordered);
      const ListTag = ordered ? "ol" : "ul";
      nodes.push(
        <ListTag
          key={`list-${blockIndex++}`}
          className={`ml-4 space-y-1 ${ordered ? "list-decimal" : "list-disc"}`}
        >
          {items.map((item, itemIndex) => (
            <li key={`${blockIndex}-${itemIndex}`} className="pl-1">
              {renderInlineMarkdown(item.text, `list-${blockIndex}-${itemIndex}`)}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    const isTableSeparator = (value: string) =>
      /^\s*\|?(\s*:?-+:?\s*\|)+\s*$/.test(value.trim()) && value.includes("-");

    if (line.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const rows: string[][] = [];
      rows.push(
        line
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((cell) => cell.trim()),
      );
      i += 2;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        rows.push(
          lines[i]
            .trim()
            .replace(/^\||\|$/g, "")
            .split("|")
            .map((cell) => cell.trim()),
        );
        i += 1;
      }

      const header = rows[0] ?? [];
      const body = rows.slice(1);

      nodes.push(
        <div key={`table-${blockIndex++}`} className="overflow-x-auto">
          <table className="min-w-full border-collapse overflow-hidden rounded-xl border border-emerald-200 text-left text-[11px]">
            <thead className="bg-emerald-50">
              <tr>
                {header.map((cell, cellIndex) => (
                  <th
                    key={`th-${blockIndex}-${cellIndex}`}
                    className="border-b border-emerald-200 px-2.5 py-2 font-bold text-emerald-900"
                  >
                    {renderInlineMarkdown(cell, `th-${blockIndex}-${cellIndex}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {body.map((row, rowIndex) => (
                <tr key={`tr-${blockIndex}-${rowIndex}`} className="odd:bg-emerald-50/30">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`td-${blockIndex}-${rowIndex}-${cellIndex}`}
                      className="border-b border-emerald-100 px-2.5 py-2 align-top text-[var(--text)]"
                    >
                      {renderInlineMarkdown(cell, `td-${blockIndex}-${rowIndex}-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const paragraphLines = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("```") &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !/^>\s+/.test(lines[i]) &&
      !/^(\-|\*|\d+\.)\s+/.test(lines[i])
    ) {
      paragraphLines.push(lines[i]);
      i += 1;
    }

    nodes.push(
      <p key={`para-${blockIndex++}`} className="whitespace-pre-wrap">
        {renderInlineMarkdown(paragraphLines.join(" "), `para-${blockIndex}`)}
      </p>,
    );
  }

  return <div className="space-y-2">{nodes}</div>;
}
