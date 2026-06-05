"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Bot, Fingerprint, Radio, ShieldCheck, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeContainerRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<Map<number, HTMLDivElement>>(new Map());
  const rotationRef = useRef(0);
  const rafRef = useRef<number>(0);

  const getRelatedItems = useCallback((itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  }, [timelineData]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulseEffect[relId] = true; });
        setPulseEffect(newPulseEffect);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  // Smooth rotation via rAF — no React re-renders
  useEffect(() => {
    if (!autoRotate) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    let lastTime = performance.now();
    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      rotationRef.current = (rotationRef.current + delta * 0.03) % 360;

      const container = nodeContainerRef.current;
      if (!container) { rafRef.current = requestAnimationFrame(animate); return; }

      const total = timelineData.length;
      const radius = 180;
      const children = container.children;

      for (let i = 0; i < total; i++) {
        const el = children[i] as HTMLDivElement;
        if (!el) continue;
        const angle = ((i / total) * 360 + rotationRef.current) * Math.PI / 180;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.opacity = String(Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(angle)) / 2))));
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [autoRotate, timelineData.length]);

  const getStatusColor = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed": return "bg-[var(--primary)] text-white";
      case "in-progress": return "bg-[#B3DF46] text-[#0e1a10]";
      case "pending": return "bg-[var(--surface-muted)] text-[var(--text-muted)]";
      default: return "bg-[var(--surface-muted)] text-[var(--text-muted)]";
    }
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden py-16"
      ref={containerRef}
      onClick={handleContainerClick}
      style={{ minHeight: "520px" }}
    >
      <div
        className="relative flex items-center justify-center"
        ref={orbitRef}
        style={{ width: 460, height: 460 }}
      >
        {/* Center hub */}
        <div className="absolute z-10 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[#0a6760] shadow-[0_0_32px_rgba(13,127,118,0.25)]">
          <div className="absolute size-20 rounded-full border border-[var(--primary)]/20 animate-ping opacity-70" />
          <div className="absolute size-24 rounded-full border border-[var(--primary)]/10 animate-ping opacity-50" style={{ animationDelay: "0.5s" }} />
          <Sprout className="size-6 text-white" />
        </div>

        {/* Orbit ring */}
        <div className="absolute size-[360px] rounded-full border border-dashed border-[var(--border)] opacity-50" />

        {/* Nodes — positioned via rAF for smooth animation */}
        <div ref={nodeContainerRef} className="absolute inset-0 flex items-center justify-center">
          {timelineData.map((item) => {
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="absolute cursor-pointer"
                style={{
                  zIndex: isExpanded ? 200 : 10,
                  transition: isExpanded ? "transform 0.3s ease" : "none",
                  willChange: "transform",
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {isPulsing && (
                  <div
                    className="absolute animate-pulse rounded-full"
                    style={{
                      background: `radial-gradient(circle, rgba(13,127,118,0.15) 0%, transparent 70%)`,
                      width: item.energy * 0.5 + 40,
                      height: item.energy * 0.5 + 40,
                      left: -(item.energy * 0.5 + 40 - 10) / 2,
                      top: -(item.energy * 0.5 + 40 - 10) / 2,
                    }}
                  />
                )}

                <div
                  className={`
                    flex size-10 items-center justify-center rounded-full border-2 transition-[background,border-color,box-shadow,transform] duration-300
                    ${isExpanded ? "scale-150 border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_0_16px_rgba(13,127,118,0.3)]" : ""}
                    ${isRelated && !isExpanded ? "border-[#B3DF46] bg-[var(--primary-soft)] text-[var(--primary)] animate-pulse" : ""}
                    ${!isExpanded && !isRelated ? "border-[var(--border)] bg-white text-[var(--text-muted)]" : ""}
                  `}
                >
                  <Icon size={16} />
                </div>

                <div className={`absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold tracking-wider transition-all duration-300 ${isExpanded ? "scale-110 text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 z-[999] w-56 -translate-x-1/2 bg-white shadow-[0_8px_40px_rgba(13,26,23,0.12)]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-3 w-px bg-[var(--border)]" />
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusColor(item.status)}`}>
                          {item.status === "completed" ? "ACTIVE" : item.status === "in-progress" ? "RUNNING" : "QUEUED"}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-subtle)]">{item.date}</span>
                      </div>
                      <CardTitle className="text-sm mt-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-[var(--text-muted)]">
                      <p className="leading-relaxed">{item.content}</p>
                      <div className="mt-3 pt-3 border-t border-[var(--border)]">
                        <div className="mb-1 flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-[var(--text-subtle)]">Confidence</span>
                          <span className="font-mono font-bold text-[var(--text)]">{item.energy}%</span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#B3DF46] to-[var(--primary)]" style={{ width: `${item.energy}%` }} />
                        </div>
                      </div>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[var(--border)]">
                          <div className="mb-2 flex items-center gap-1">
                            <div className="size-1 rounded-full bg-[var(--primary)]" />
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)]">Connected</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <button
                                  key={relatedId}
                                  className="flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
