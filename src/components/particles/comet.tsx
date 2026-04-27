"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export type CometColor = "write" | "read" | "error" | "process";

const COLOR_MAP: Record<CometColor, { head: string; trail: string }> = {
  write: { head: "#c4b5fd", trail: "#7c3aed" },
  read: { head: "#67e8f9", trail: "#0e7490" },
  error: { head: "#fde68a", trail: "#dc2626" },
  process: { head: "#c4b5fd", trail: "#22d3ee" },
};

interface PathPoint {
  x: number;
  y: number;
}

function getPointOnPath(path: SVGPathElement, t: number): PathPoint {
  const len = path.getTotalLength();
  const pt = path.getPointAtLength(t * len);
  return { x: pt.x, y: pt.y };
}

interface CometProps {
  pathD: string;
  color: CometColor;
  duration: number;
  onComplete: () => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function Comet({ pathD, color, duration, onComplete, svgRef }: CometProps) {
  const colors = COLOR_MAP[color];
  const progress = useMotionValue(0);
  const pathRef = useRef<SVGPathElement | null>(null);

  const TRAIL_COUNT = 7;

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: duration / 1000,
      ease: [0.16, 1, 0.3, 1],
      onComplete,
    });
    return () => controls.stop();
  }, [duration, onComplete, progress]);

  // We render the comet as an absolutely positioned div tracking SVG coords
  return (
    <>
      {/* Invisible path for reference */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth="0"
      />
      <CometTracker
        pathD={pathD}
        progress={progress}
        colors={colors}
        trailCount={TRAIL_COUNT}
      />
    </>
  );
}

interface CometTrackerProps {
  pathD: string;
  progress: ReturnType<typeof useMotionValue<number>>;
  colors: { head: string; trail: string };
  trailCount: number;
}

function CometTracker({ pathD, progress, colors, trailCount }: CometTrackerProps) {
  const pathRef = useRef<SVGPathElement | null>(null);

  // We can't use useTransform with SVGPathElement easily, so
  // we use motion values for x and y of each trail point
  const positions = Array.from({ length: trailCount + 1 }, (_, i) => ({
    // eslint-disable-next-line react-hooks/rules-of-hooks
    x: useMotionValue(0),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    y: useMotionValue(0),
  }));

  useEffect(() => {
    const unsub = progress.on("change", (t) => {
      if (!pathRef.current) return;
      const len = pathRef.current.getTotalLength();
      for (let i = 0; i <= trailCount; i++) {
        const offset = (trailCount - i) * 0.035;
        const tt = Math.max(0, t - offset);
        const pt = pathRef.current.getPointAtLength(tt * len);
        positions[i].x.set(pt.x);
        positions[i].y.set(pt.y);
      }
    });
    return unsub;
    // positions array is stable across renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, trailCount]);

  return (
    <>
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth="0"
      />
      {positions.map((pos, i) => {
        const isHead = i === 0;
        const trailOpacity = isHead ? 1 : (trailCount - i) / trailCount;
        const radius = isHead ? 4 : 2.5 * (1 - i / (trailCount + 1));
        return (
          <motion.circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r={radius}
            fill={isHead ? colors.head : colors.trail}
            opacity={trailOpacity * 0.9}
            style={{
              filter: isHead
                ? `drop-shadow(0 0 6px ${colors.head}) drop-shadow(0 0 12px ${colors.head}80)`
                : undefined,
            }}
          />
        );
      })}
    </>
  );
}
