"use client";

import { memo } from "react";
import { getBezierPath, type EdgeProps } from "@xyflow/react";
import { motion } from "framer-motion";

export interface CustomEdgeData {
  isActive?: boolean;
  color?: "write" | "read" | "error" | "process";
}

const COLOR_MAP: Record<string, [string, string]> = {
  write: ["#a78bfa", "#7c3aed"],
  read: ["#22d3ee", "#0891b2"],
  error: ["#fbbf24", "#ef4444"],
  process: ["#a78bfa", "#22d3ee"],
};

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const d = data as CustomEdgeData | undefined;
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  const gradientId = `grad-${id}`;
  const glowId = `glow-${id}`;
  const isActive = d?.isActive ?? false;
  const color = d?.color ?? "read";
  const [c1, c2] = COLOR_MAP[color] ?? COLOR_MAP.read;

  return (
    <>
      <defs>
        {isActive && (
          <>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c1} stopOpacity="0.9" />
              <stop offset="100%" stopColor={c2} stopOpacity="0.9" />
            </linearGradient>
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </>
        )}
      </defs>

      {/* Base path — always visible, subtle */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth={1.2}
        strokeLinecap="round"
      />

      {/* Animated active path */}
      {isActive && (
        <motion.path
          d={edgePath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={2.5}
          strokeLinecap="round"
          filter={`url(#${glowId})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </>
  );
}

export default memo(CustomEdge);
