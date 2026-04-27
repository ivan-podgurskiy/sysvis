"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Shield,
  Database,
  Radio,
  Cpu,
  HardDrive,
  Search,
  Bell,
  Globe,
  Zap,
  Users,
  MapPin,
  CreditCard,
  Layers,
  GitBranch,
  TrendingUp,
  Webhook,
  FileText,
} from "lucide-react";
import type { NodeType } from "@/lib/architectures";

const TYPE_ICONS: Record<NodeType, React.ComponentType<{ style?: React.CSSProperties }>> = {
  client: Monitor,
  gateway: Shield,
  service: Cpu,
  cache: Zap,
  database: Database,
  queue: Radio,
  cdn: Globe,
  storage: HardDrive,
  worker: GitBranch,
  index: Search,
};

const LABEL_ICONS: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  "Auth Service": Shield,
  "User Service": Users,
  "Location Service": MapPin,
  "Payment Service": CreditCard,
  "Notification Service": Bell,
  "Recommendation": TrendingUp,
  "Metadata Service": FileText,
  "Fraud Detection": Shield,
  "Ledger Service": Layers,
  "Webhook Dispatcher": Webhook,
  "Pricing Service": TrendingUp,
  "Matching Service": Users,
  "Trip Service": Cpu,
  "Fanout Worker": GitBranch,
  "Encoding Pipeline": Cpu,
  "Playback Manifest": FileText,
  "Knowledge Graph": Database,
  "Ads Service": TrendingUp,
  "Spell Correction": Search,
  "Query Parser": Search,
  "Ranker": TrendingUp,
};

const SIZE_DIMS: Record<string, { w: number; px: number; py: number }> = {
  sm: { w: 130, px: 10, py: 9 },
  md: { w: 150, px: 12, py: 10 },
  lg: { w: 170, px: 14, py: 11 },
};

export interface CustomNodeData {
  label: string;
  nodeType: NodeType;
  description: string;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  isPulsing?: boolean;
}

const CustomNode = memo(({ data }: NodeProps) => {
  const d = data as unknown as CustomNodeData;
  const size = d.size ?? "md";
  const dims = SIZE_DIMS[size];
  const IconComp = LABEL_ICONS[d.label] ?? TYPE_ICONS[d.nodeType] ?? Cpu;

  const activeBorder = "rgba(34,211,238,0.55)";
  const baseBorder = "rgba(255,255,255,0.1)";
  const activeBg = "rgba(34,211,238,0.06)";
  const baseBg = "rgba(255,255,255,0.03)";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      style={{
        position: "relative",
        width: dims.w,
        padding: `${dims.py}px ${dims.px}px`,
        borderRadius: 8,
        border: `1px solid ${d.isActive ? activeBorder : baseBorder}`,
        background: d.isActive ? activeBg : baseBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        cursor: "default",
        boxShadow: d.isActive
          ? `0 0 0 1px rgba(34,211,238,0.2), 0 4px 24px rgba(34,211,238,0.1), inset 0 1px 0 rgba(255,255,255,0.08)`
          : `inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 8px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Pulse ring on arrival */}
      <AnimatePresence>
        {d.isPulsing && (
          <motion.div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: 9,
              border: "1px solid rgba(34,211,238,0.7)",
              pointerEvents: "none",
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Top inset glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: "rgba(255,255,255,0.1)",
          borderRadius: "0 0 4px 4px",
          pointerEvents: "none",
        }}
      />

      <motion.div
        animate={d.isActive ? { scale: [1, 1.025, 1] } : { scale: 1 }}
        transition={d.isActive ? { duration: 0.35 } : { duration: 0.2 }}
      >
        {/* Icon + name row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
          }}
        >
          <IconComp
            style={{
              width: 13,
              height: 13,
              color: d.isActive ? "#22d3ee" : "rgba(255,255,255,0.45)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              fontWeight: 500,
              color: d.isActive ? "#67e8f9" : "#e4e4e7",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {d.label}
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 9.5,
            color: d.isActive ? "rgba(34,211,238,0.55)" : "#52525b",
            lineHeight: 1.4,
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {d.description}
        </p>
      </motion.div>

      {/* Handles — invisible */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "transparent", border: "none", width: 6, height: 6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "transparent", border: "none", width: 6, height: 6 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: "transparent", border: "none", width: 6, height: 6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: "transparent", border: "none", width: 6, height: 6 }}
      />
    </motion.div>
  );
});

CustomNode.displayName = "CustomNode";
export default CustomNode;
