"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

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
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let animFrame: number;
    let lastTime: number | null = null;
    const speed = 12; // degrees per second

    const tick = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (autoRotate && viewMode === "orbital") {
        setRotationAngle((prev) => (prev + speed * delta) % 360);
      }
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 160;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.5,
      Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)]";
      case "in-progress":
        return "bg-[var(--surface)] text-[var(--text)] border-[var(--primary-border)]";
      case "pending":
        return "bg-[var(--surface-muted)] text-[var(--text-muted)] border-[var(--border)]";
      default:
        return "bg-[var(--surface-muted)] text-[var(--text-muted)] border-[var(--border)]";
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      ref={containerRef}
    >
      <div
        className="relative w-full aspect-square flex items-center justify-center"
        ref={orbitRef}
        onClick={handleContainerClick}
        style={{
          perspective: "1000px",
          transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
        }}
      >
        {/* Orbit rings */}
        <div className="absolute w-[320px] h-[320px] rounded-full border border-[var(--border)] opacity-60" />
        <div className="absolute w-[280px] h-[280px] rounded-full border border-[var(--border)] opacity-40" />
        <div className="absolute w-[240px] h-[240px] rounded-full border border-[var(--border)] opacity-30" />

        {/* Center hub */}
        <div className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] animate-pulse flex items-center justify-center z-10 shadow-[0_0_24px_var(--primary-soft)]">
          <div className="absolute w-[72px] h-[72px] rounded-full border border-[var(--primary-border)] animate-ping opacity-70" />
          <div
            className="absolute w-[88px] h-[88px] rounded-full border border-[var(--primary-soft)] animate-ping opacity-40"
            style={{ animationDelay: "0.5s" }}
          />
          <div className="w-7 h-7 rounded-full bg-[var(--surface)] backdrop-blur-md flex items-center justify-center">
            <span className="text-[9px] font-black text-[var(--primary)]">G</span>
          </div>
        </div>

        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;

          const nodeStyle = {
            transform: `translate(${position.x}px, ${position.y}px)`,
            zIndex: isExpanded ? 200 : position.zIndex,
            opacity: isExpanded ? 1 : position.opacity,
          };

          return (
            <div
              key={item.id}
              ref={(el) => {
                nodeRefs.current[item.id] = el;
              }}
              className="absolute cursor-pointer"
              style={nodeStyle}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              {/* Energy pulse ring */}
              <div
                className={`absolute rounded-full -inset-1 ${
                  isPulsing ? "animate-pulse duration-1000" : ""
                }`}
                style={{
                  background: `radial-gradient(circle, var(--primary-soft) 0%, transparent 70%)`,
                  width: `${item.energy * 0.4 + 36}px`,
                  height: `${item.energy * 0.4 + 36}px`,
                  left: `-${(item.energy * 0.4 + 36 - 36) / 2}px`,
                  top: `-${(item.energy * 0.4 + 36 - 36) / 2}px`,
                }}
              />

              {/* Node circle */}
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300
                  ${
                    isExpanded
                      ? "bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)] shadow-lg shadow-[var(--primary-soft)] scale-150"
                      : isRelated
                      ? "bg-[var(--primary-soft)] text-[var(--primary)] border-[var(--primary)] animate-pulse"
                      : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]"
                  }
                `}
              >
                <Icon size={14} />
              </div>

              {/* Label */}
              <div
                className={`
                  absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-[10px] font-semibold tracking-wider
                  transition-all duration-300
                  ${isExpanded ? "text-[var(--text)] scale-125" : "text-[var(--text-muted)]"}
                `}
              >
                {item.title}
              </div>

              {/* Expanded card */}
              {isExpanded && (
                <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-60 bg-[var(--surface)] border-[var(--primary-border)] shadow-[var(--shadow-lg)] overflow-visible z-[300]">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[var(--primary-border)]" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge className={`px-2 text-[10px] ${getStatusStyles(item.status)}`}>
                        {item.status === "completed"
                          ? "COMPLETE"
                          : item.status === "in-progress"
                          ? "IN PROGRESS"
                          : "PENDING"}
                      </Badge>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {item.date}
                      </span>
                    </div>
                    <CardTitle className="text-sm mt-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-[var(--text-muted)]">
                    <p>{item.content}</p>

                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="flex items-center text-[var(--text)]">
                          <Zap size={10} className="mr-1 text-[var(--primary)]" />
                          Energy Level
                        </span>
                        <span className="font-mono text-[var(--text)]">{item.energy}%</span>
                      </div>
                      <div className="w-full h-1 bg-[var(--surface-muted)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)]"
                          style={{ width: `${item.energy}%` }}
                        />
                      </div>
                    </div>

                    {item.relatedIds.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[var(--border)]">
                        <div className="flex items-center mb-2">
                          <Link size={10} className="text-[var(--text-muted)] mr-1" />
                          <h4 className="text-[10px] uppercase tracking-wider font-medium text-[var(--text-muted)]">
                            Connected Nodes
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((relatedId) => {
                            const relatedItem = timelineData.find(
                              (i) => i.id === relatedId
                            );
                            return (
                              <button
                                key={relatedId}
                                className="flex items-center h-6 px-2 py-0 text-[10px] border border-[var(--border)] bg-transparent hover:bg-[var(--primary-soft)] text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleItem(relatedId);
                                }}
                              >
                                {relatedItem?.title}
                                <ArrowRight
                                  size={8}
                                  className="ml-1 text-[var(--text-subtle)]"
                                />
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
  );
}
