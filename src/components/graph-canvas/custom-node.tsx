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
  sm: { w: 160, px: 12, py: 13 },
  md: { w: 185, px: 14, py: 14 },
  lg: { w: 210, px: 16, py: 16 },
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
        border: `1px solid ${d.isActive ? "var(--node-active-border)" : "var(--node-border)"}`,
        background: d.isActive ? "var(--node-active-bg)" : "var(--node-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        cursor: "default",
        boxShadow: d.isActive ? "var(--node-active-glow)" : "var(--node-shadow)",
      }}
    >
      <AnimatePresence>
        {d.isPulsing && (
          <motion.div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: 9,
              border: "1px solid var(--node-pulse)",
              pointerEvents: "none",
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: "var(--node-inset-line)",
          borderRadius: "0 0 4px 4px",
          pointerEvents: "none",
        }}
      />

      <motion.div
        animate={d.isActive ? { scale: [1, 1.025, 1] } : { scale: 1 }}
        transition={d.isActive ? { duration: 0.35 } : { duration: 0.2 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
            minWidth: 0,
          }}
        >
          <IconComp
            style={{
              width: 16,
              height: 16,
              color: d.isActive ? "var(--accent-cyan)" : "var(--node-icon)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              color: d.isActive ? "var(--accent-cyan-soft)" : "var(--text-primary)",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
          >
            {d.label}
          </span>
        </div>

        <p
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "var(--text-xs)",
            color: d.isActive ? "var(--accent-cyan-soft)" : "var(--text-muted)",
            opacity: d.isActive ? 0.85 : 1,
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
