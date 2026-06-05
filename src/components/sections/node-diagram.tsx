"use client";

import { useRef, useEffect } from "react";

const nodes = [
  { id: "approvals", label: "HUMAN APPROVALS", x: 202, y: 162, delay: ".78s", dotDelay: ".72s", dotX: 199, dotY: 159 },
  { id: "executions", label: "LIVE EXECUTIONS", x: 500, y: 162, delay: ".78s", dotDelay: ".72s", dotX: 497, dotY: 159 },
  { id: "agents", label: "CONNECTED AGENTS", x: 96, y: 240, delay: ".88s", dotDelay: ".82s", dotX: 93, dotY: 237 },
  { id: "queues", label: "REVIEW QUEUES", x: 608, y: 240, delay: ".88s", dotDelay: ".82s", dotX: 605, dotY: 237 },
  { id: "events", label: "SYSTEM EVENTS", x: 350, y: 108, delay: ".62s", dotDelay: ".62s", dotX: 347, dotY: 105 },
];

const curves = [
  { d: "M350 272 C350 228, 350 185, 350 108", delay: ".28s", flowDelay: "0s" },
  { d: "M350 272 C276 272, 276 217, 202 162", delay: ".40s", flowDelay: "1.0s" },
  { d: "M350 272 C223 272, 223 256, 96 240", delay: ".52s", flowDelay: "2.0s" },
  { d: "M350 272 C425 272, 425 217, 500 162", delay: ".40s", flowDelay: "1.5s" },
  { d: "M350 272 C479 272, 479 256, 608 240", delay: ".52s", flowDelay: "2.5s" },
  { d: "M350 272 C350 290, 350 300, 350 308", delay: ".18s", flowDelay: ".5s" },
];

const endpoints = [
  { cx: 350, cy: 108, delay: ".42s" },
  { cx: 202, cy: 162, delay: ".54s" },
  { cx: 96, cy: 240, delay: ".66s" },
  { cx: 500, cy: 162, delay: ".54s" },
  { cx: 608, cy: 240, delay: ".66s" },
  { cx: 350, cy: 308, delay: ".32s" },
  { cx: 350, cy: 272, delay: ".18s" },
];

const styles = `
  @keyframes drawLine { to { stroke-dashoffset: 0; } }
  @keyframes flowDash1 { to { stroke-dashoffset: -60; } }
  @keyframes flowDash2 { to { stroke-dashoffset: -60; } }
  @keyframes flowDash3 { to { stroke-dashoffset: -100; } }
  @keyframes nodeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes glowPulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
  @keyframes dotPulse { 0%,100% { r: 3; opacity: 0.4; } 50% { r: 6.5; opacity: 0.85; } }

  .line-base  { fill: none; stroke: rgba(255,255,255,0.45); stroke-width: 1; stroke-linecap: round; stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: drawLine 1.2s ease forwards var(--d,.3s); }

  /* Three staggered flow layers = continuous stream */
  .line-flow-a { fill: none; stroke: rgba(255,255,255,0.55); stroke-width: 1.2; stroke-linecap: round; stroke-dasharray: 4 14;  stroke-dashoffset: 0;  animation: flowDash1 1.2s linear infinite; animation-delay: var(--fd,0s); }
  .line-flow-b { fill: none; stroke: rgba(255,255,255,0.55); stroke-width: 1.2; stroke-linecap: round; stroke-dasharray: 4 14;  stroke-dashoffset: -9; animation: flowDash2 1.2s linear infinite; animation-delay: var(--fd,0s); }
  .line-flow-c { fill: none; stroke: #fff;                        stroke-width: 1.0; stroke-linecap: round; stroke-dasharray: 3 18;  stroke-dashoffset: -5; animation: flowDash3 0.9s linear infinite; animation-delay: var(--fd,0s); }

  .ep-core    { fill: #fff; animation: glowPulse 2.4s ease-in-out infinite; animation-delay: var(--d,.3s); }
  .ep-dot     { fill: #fff; animation: dotPulse 2.4s ease-in-out infinite; animation-delay: var(--d,.3s); }
  .node-label { opacity: 0; animation: nodeIn .5s ease forwards var(--d,.5s); }
`;

function NodeDiagramSVG() {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!document.querySelector("#node-diagram-styles")) {
      const style = document.createElement("style");
      style.id = "node-diagram-styles";
      style.textContent = styles;
      document.head.appendChild(style);
      styleRef.current = style;
    }
    return () => {
      styleRef.current?.remove();
    };
  }, []);

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 700 430"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Layered blur filters for smooth gradient glow */}
        <filter id="glow-outer" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="8" result="b" />
        </filter>
        <filter id="glow-mid" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
        </filter>
        <filter id="glow-inner" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.5" result="b" />
        </filter>

        {/* Combined glow: outer + mid + inner + core */}
        <filter id="glow-full" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="outer" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="mid" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="inner" />
          <feMerge>
            <feMergeNode in="outer" />
            <feMergeNode in="mid" />
            <feMergeNode in="inner" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dot halo filter */}
        <filter id="dot-halo" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="outer" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="mid" />
          <feMerge>
            <feMergeNode in="outer" />
            <feMergeNode in="mid" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="circleShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="16" floodColor="rgba(0,0,0,0.22)" />
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.12)" />
          <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="rgba(0,0,0,0.06)" />
        </filter>
      </defs>

      {/* === CURVES — glow + base + flow === */}
      <g filter="url(#glow-full)">
        {curves.map((c, i) => (
          <path key={`g-${i}`} className="line-base" style={{ "--d": c.delay } as React.CSSProperties} d={c.d} />
        ))}
      </g>

      {/* Flowing dash animation — three staggered layers for continuous stream */}
      {curves.map((c, i) => (
        <path key={`fa-${i}`} className="line-flow-a" style={{ "--fd": c.flowDelay } as React.CSSProperties} d={c.d} />
      ))}
      {curves.map((c, i) => (
        <path key={`fb-${i}`} className="line-flow-b" style={{ "--fd": c.flowDelay } as React.CSSProperties} d={c.d} />
      ))}
      {curves.map((c, i) => (
        <path key={`fc-${i}`} className="line-flow-c" style={{ "--fd": c.flowDelay } as React.CSSProperties} d={c.d} />
      ))}

      {/* === ENDPOINTS — halo dots === */}
      <g filter="url(#dot-halo)">
        {endpoints.map((ep, i) => (
          <circle key={`eh-${i}`} className="ep-dot" style={{ "--d": ep.delay } as React.CSSProperties} cx={ep.cx} cy={ep.cy} r="3.5" />
        ))}
      </g>

      {/* Core white dot on top of halo */}
      {endpoints.map((ep, i) => (
        <circle key={`ec-${i}`} className="ep-core" style={{ "--d": ep.delay } as React.CSSProperties} cx={ep.cx} cy={ep.cy} r="2" />
      ))}

      {/* Central dot — with halo */}
      <g filter="url(#dot-halo)">
        <rect className="node-label" style={{ "--d": ".16s" } as React.CSSProperties} x="345" y="267" width="10" height="10" rx="2" fill="rgba(255,255,255,0.85)" />
      </g>

      {/* Base platform — layered rings for depth */}
      <circle cx="350" cy="422" r="130" fill="white" filter="url(#circleShadow)" />
      <circle cx="350" cy="422" r="130" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
      <circle cx="350" cy="422" r="120" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
      <circle cx="350" cy="422" r="130" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" opacity="0.5" />

      {/* Center hub icon */}
      <g transform="translate(350,412)">
        <circle r="28" fill="none" stroke="#151515" strokeWidth="4.5" />
        <line x1="-26" y1="7" x2="26" y2="7" stroke="#151515" strokeWidth="3.8" />
        <line x1="-22" y1="16" x2="22" y2="16" stroke="#151515" strokeWidth="2.8" />
        <line x1="-14" y1="24" x2="14" y2="24" stroke="#151515" strokeWidth="1.5" />
      </g>

      {/* Node dots — with halo */}
      <g filter="url(#dot-halo)">
        {nodes.map((n) => (
          <rect
            key={`nd-${n.id}`}
            className="node-label"
            style={{ "--d": n.dotDelay } as React.CSSProperties}
            x={n.dotX - 2}
            y={n.dotY - 2}
            width="10"
            height="10"
            rx="2"
            fill="rgba(255,255,255,0.75)"
          />
        ))}
      </g>

      {/* Node labels */}
      {nodes.map((n) => {
        const widths: Record<string, number> = {
          approvals: 150,
          executions: 138,
          agents: 160,
          queues: 138,
          events: 142,
        };
        const w = widths[n.id] || 142;
        return (
          <g key={`label-${n.id}`} className="node-label" style={{ "--d": n.delay } as React.CSSProperties}>
            <rect
              x={n.x - w / 2}
              y={n.y - 15}
              width={w}
              height="30"
              rx="15"
              fill="rgba(235,234,228,.94)"
              stroke="rgba(0,0,0,.11)"
              strokeWidth=".5"
            />
            <text
              x={n.x}
              y={n.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="system-ui,sans-serif"
              fontSize="9.5"
              fontWeight="700"
              fill="#1e1e1e"
              letterSpacing=".4"
            >
              {n.id === "approvals" && "⊟ "}
              {n.id === "executions" && "↺ "}
              {n.id === "agents" && "✦ "}
              {n.id === "queues" && "☰ "}
              {n.id === "events" && "▷ "}
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function NodeDiagramSection() {
  return (
    <section id="how-it-works" className="relative h-[460px] w-full overflow-hidden">
      <video
        src="/bg-section.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/20" />

      <NodeDiagramSVG />
    </section>
  );
}
