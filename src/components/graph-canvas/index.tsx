"use client";

import {
  ReactFlow,
  Background,
  Position,
  useNodesState,
  useEdgesState,
  useViewport,
  useReactFlow,
  type Node,
  type Edge,
  type ReactFlowInstance,
} from "@xyflow/react";
import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import "@xyflow/react/dist/style.css";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { getBezierPath } from "@xyflow/react";
import CustomNode, { type CustomNodeData } from "./custom-node";
import CustomEdge from "./custom-edge";
import { Comet } from "@/components/particles/comet";
import { useTheme } from "@/hooks/use-theme";
import type { Architecture, ScenarioStep } from "@/lib/architectures";

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const CANVAS_DOT = {
  dark: "rgba(255,255,255,0.025)",
  light: "rgba(24,24,27,0.1)",
} as const;

function CanvasBackground() {
  const { theme } = useTheme();
  return <Background color={CANVAS_DOT[theme]} gap={40} size={1} />;
}

const NODE_HEIGHT_BY_SIZE: Record<string, number> = { sm: 72, md: 84, lg: 96 };
const NODE_WIDTH_BY_SIZE: Record<string, number> = { sm: 160, md: 185, lg: 210 };

interface ActiveParticle {
  id: string;
  step: ScenarioStep;
  pathD: string;
}

function ZoomControls() {
  const { zoomIn, zoomOut } = useReactFlow();

  const btnStyle: React.CSSProperties = {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--glass-bg)",
    border: "1px solid var(--border-base)",
    borderRadius: 6,
    cursor: "pointer",
    color: "var(--text-muted)",
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        zIndex: 20,
      }}
    >
      <motion.button
        style={btnStyle}
        whileHover={{ borderColor: "var(--border-hover)", color: "var(--text-secondary)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => zoomIn({ duration: 200 })}
      >
        <Plus style={{ width: 13, height: 13 }} />
      </motion.button>
      <motion.button
        style={btnStyle}
        whileHover={{ borderColor: "var(--border-hover)", color: "var(--text-secondary)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => zoomOut({ duration: 200 })}
      >
        <Minus style={{ width: 13, height: 13 }} />
      </motion.button>
    </div>
  );
}

// Rendered inside ReactFlow context — correct viewport transform
function ParticleLayer({
  activeStep,
  archNodes,
}: {
  activeStep: ScenarioStep | null;
  archNodes: Architecture["nodes"];
}) {
  const { x: vpX, y: vpY, zoom } = useViewport();
  const { getNodes } = useReactFlow();
  const [particles, setParticles] = useState<ActiveParticle[]>([]);
  const particleIdRef = useRef(0);
  const prevStepRef = useRef<ScenarioStep | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!activeStep || activeStep === prevStepRef.current) return;
    prevStepRef.current = activeStep;

    const rfNodes = getNodes();
    const src = rfNodes.find((n) => n.id === activeStep.from);
    const tgt = rfNodes.find((n) => n.id === activeStep.to);
    if (!src || !tgt) return;

    const srcArch = archNodes.find((n) => n.id === activeStep.from);
    const tgtArch = archNodes.find((n) => n.id === activeStep.to);
    const srcW = NODE_WIDTH_BY_SIZE[srcArch?.size ?? "md"];
    const srcH = NODE_HEIGHT_BY_SIZE[srcArch?.size ?? "md"];
    const tgtH = NODE_HEIGHT_BY_SIZE[tgtArch?.size ?? "md"];

    // Flow-space path — viewport transform is applied on the parent <g> so
    // particles stay aligned when fitView runs during resize / panel open.
    const sx = src.position.x + srcW;
    const sy = src.position.y + srcH / 2;
    const tx = tgt.position.x;
    const ty = tgt.position.y + tgtH / 2;

    const [d] = getBezierPath({
      sourceX: sx,
      sourceY: sy,
      targetX: tx,
      targetY: ty,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    const id = `p-${particleIdRef.current++}`;
    setParticles((prev) => [...prev, { id, step: activeStep, pathD: d }]);
  }, [activeStep, archNodes, getNodes]);

  const removeParticle = useCallback((id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  if (particles.length === 0) return null;

  return (
    <svg
      ref={svgRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      <g transform={`matrix(${zoom}, 0, 0, ${zoom}, ${vpX}, ${vpY})`}>
        <AnimatePresence>
          {particles.map((p) => (
            <Comet
              key={p.id}
              pathD={p.pathD}
              color={p.step.color}
              duration={700}
              onComplete={() => removeParticle(p.id)}
              svgRef={svgRef}
            />
          ))}
        </AnimatePresence>
      </g>
    </svg>
  );
}

// Inner component that has access to ReactFlow instance
function FlowInner({
  archNodes,
  activeStep,
  activeNodes,
  pulsingNodes,
  containerRef,
}: {
  archNodes: Architecture["nodes"];
  activeStep: ScenarioStep | null;
  activeNodes: Set<string>;
  pulsingNodes: Set<string>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { fitView } = useReactFlow();

  // Re-fit when container resizes (e.g., detail panel open/close)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      // Small delay to let the CSS transition advance
      setTimeout(() => fitView({ padding: 0.15, maxZoom: 1.0, duration: 300 }), 50);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [fitView, containerRef]);

  return (
    <>
      <ParticleLayer activeStep={activeStep} archNodes={archNodes} />
      <ZoomControls />
    </>
  );
}

interface GraphCanvasProps {
  architecture: Architecture;
  activeStep: ScenarioStep | null;
  activeNodes: Set<string>;
  pulsingNodes: Set<string>;
}

export function GraphCanvas({
  architecture,
  activeStep,
  activeNodes,
  pulsingNodes,
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rfInstanceRef = useRef<ReactFlowInstance | null>(null);

  const rfNodes: Node[] = useMemo(
    () =>
      architecture.nodes.map((n) => ({
        id: n.id,
        type: "custom",
        position: n.position,
        data: {
          label: n.label,
          nodeType: n.type,
          description: n.description,
          size: n.size ?? "md",
          isActive: activeNodes.has(n.id),
          isPulsing: pulsingNodes.has(n.id),
        } satisfies CustomNodeData,
        draggable: false,
      })),
    [architecture.nodes, activeNodes, pulsingNodes]
  );

  const rfEdges: Edge[] = useMemo(
    () =>
      architecture.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: "custom",
        data: { isActive: false, color: "read" },
      })),
    [architecture.edges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, , onEdgesChange] = useEdgesState(rfEdges);

  useEffect(() => {
    setNodes(rfNodes);
  }, [rfNodes, setNodes]);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    rfInstanceRef.current = instance;
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.15, maxZoom: 1.0 }}
        minZoom={0.15}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
        style={{ background: "transparent" }}
      >
        <CanvasBackground />
        <FlowInner
          archNodes={architecture.nodes}
          activeStep={activeStep}
          activeNodes={activeNodes}
          pulsingNodes={pulsingNodes}
          containerRef={containerRef}
        />
      </ReactFlow>
    </div>
  );
}
