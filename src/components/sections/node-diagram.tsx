"use client";

import { useRef, useEffect } from "react";

const nodes = [
  { id: "approvals", label: "HUMAN APPROVALS", x: 202, y: 162, lineX1: 350, lineY1: 272, lineX2: 202, lineY2: 162, delay: ".78s", dotDelay: ".72s", dotX: 199, dotY: 159 },
  { id: "executions", label: "LIVE EXECUTIONS", x: 500, y: 162, lineX1: 350, lineY1: 272, lineX2: 500, lineY2: 162, delay: ".78s", dotDelay: ".72s", dotX: 497, dotY: 159 },
  { id: "agents", label: "CONNECTED AGENTS", x: 96, y: 240, lineX1: 350, lineY1: 272, lineX2: 96, lineY2: 240, delay: ".88s", dotDelay: ".82s", dotX: 93, dotY: 237 },
  { id: "queues", label: "REVIEW QUEUES", x: 608, y: 240, lineX1: 350, lineY1: 272, lineX2: 608, lineY2: 240, delay: ".88s", dotDelay: ".82s", dotX: 605, dotY: 237 },
  { id: "events", label: "SYSTEM EVENTS", x: 350, y: 108, lineX1: 350, lineY1: 272, lineX2: 350, lineY2: 108, delay: ".62s", dotDelay: ".62s", dotX: 347, dotY: 105 },
];

const styles = `
  @keyframes lG { to { stroke-dashoffset: 0; } }
  @keyframes nI { from { opacity: 0; } to { opacity: 1; } }
  @keyframes connectorPulse { 0%,100% { r: 3; opacity: 0.5; } 50% { r: 5; opacity: 0.85; } }
  .ll { fill: none; stroke: rgba(95,95,95,.42); stroke-width: .65; stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: lG .95s ease forwards var(--d,.3s); }
  .nn { opacity: 0; animation: nI .5s ease forwards var(--d,.5s); }
  .cp { animation: connectorPulse 2.2s ease-in-out infinite; animation-delay: var(--d,.3s); }
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
      {/* Bezier curves to center node */}
      <path className="ll" style={{ "--d": ".28s" } as React.CSSProperties} d="M350 272 C350 228, 350 185, 350 108" />
      <path className="ll" style={{ "--d": ".40s" } as React.CSSProperties} d="M350 272 C276 272, 276 217, 202 162" />
      <path className="ll" style={{ "--d": ".52s" } as React.CSSProperties} d="M350 272 C223 272, 223 256, 96 240" />
      <path className="ll" style={{ "--d": ".40s" } as React.CSSProperties} d="M350 272 C425 272, 425 217, 500 162" />
      <path className="ll" style={{ "--d": ".52s" } as React.CSSProperties} d="M350 272 C479 272, 479 256, 608 240" />
      <path className="ll" style={{ "--d": ".18s" } as React.CSSProperties} d="M350 272 C350 290, 350 300, 350 308" />

      {/* Connector circles at endpoints */}
      <circle className="cp" style={{ "--d": ".42s" } as React.CSSProperties} cx="350" cy="108" r="3" fill="rgba(95,95,95,.5)" />
      <circle className="cp" style={{ "--d": ".54s" } as React.CSSProperties} cx="202" cy="162" r="3" fill="rgba(95,95,95,.5)" />
      <circle className="cp" style={{ "--d": ".66s" } as React.CSSProperties} cx="96" cy="240" r="3" fill="rgba(95,95,95,.5)" />
      <circle className="cp" style={{ "--d": ".54s" } as React.CSSProperties} cx="500" cy="162" r="3" fill="rgba(95,95,95,.5)" />
      <circle className="cp" style={{ "--d": ".66s" } as React.CSSProperties} cx="608" cy="240" r="3" fill="rgba(95,95,95,.5)" />
      <circle className="cp" style={{ "--d": ".32s" } as React.CSSProperties} cx="350" cy="308" r="3" fill="rgba(95,95,95,.5)" />
      <circle className="cp" style={{ "--d": ".18s" } as React.CSSProperties} cx="350" cy="272" r="3" fill="rgba(95,95,95,.5)" />

      {/* Drop shadow filter */}
      <defs>
        <filter id="circleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="rgba(0,0,0,0.18)" />
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.08)" />
        </filter>
      </defs>

      {/* Base platform */}
      <circle cx="350" cy="422" r="130" fill="white" filter="url(#circleShadow)" />
      <circle cx="350" cy="422" r="128" fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="1" />

      {/* Center hub icon */}
      <g transform="translate(350,412)">
        <circle r="28" fill="none" stroke="#151515" strokeWidth="4.5" />
        <line x1="-26" y1="7" x2="26" y2="7" stroke="#151515" strokeWidth="3.8" />
        <line x1="-22" y1="16" x2="22" y2="16" stroke="#151515" strokeWidth="2.8" />
        <line x1="-14" y1="24" x2="14" y2="24" stroke="#151515" strokeWidth="1.5" />
      </g>

      {/* Central dot */}
      <rect className="nn" style={{ "--d": ".16s" } as React.CSSProperties} x="347" y="269" width="6" height="6" rx="1" fill="rgba(115,115,115,.65)" />

      {/* Node dots */}
      {nodes.map((n) => (
        <rect
          key={`dot-${n.id}`}
          className="nn"
          style={{ "--d": n.dotDelay } as React.CSSProperties}
          x={n.dotX}
          y={n.dotY}
          width="6"
          height="6"
          rx="1"
          fill="rgba(115,115,115,.45)"
        />
      ))}

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
          <g key={`label-${n.id}`} className="nn" style={{ "--d": n.delay } as React.CSSProperties}>
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

      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/10 to-black/20" />

      <NodeDiagramSVG />

      {/* <div className="pointer-events-none absolute top-[14px] left-0 right-0 z-10 text-center">
        <h2 className="text-2xl font-bold text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
          Trace every decision across your agent network
        </h2>
      </div> */}
    </section>
  );
}
