"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Activity } from "lucide-react";
import { architectures, getArchitecture, type Scenario } from "@/lib/architectures";
import { ArchitectureSelector } from "@/components/architecture-selector";
import { GraphCanvas } from "@/components/graph-canvas";
import { DetailPanel } from "@/components/detail-panel";
import { useScenarioRunner } from "@/hooks/use-scenario-runner";
import { useCursorGlow } from "@/hooks/use-cursor-glow";

export function Visualizer() {
  useCursorGlow();

  const [activeArchId, setActiveArchId] = useState(architectures[0].id);
  const [muted, setMuted] = useState(true);

  const activeArch = getArchitecture(activeArchId)!;
  const { state, runScenario, stopScenario } = useScenarioRunner();

  const panelOpen = !!state.activeScenario;
  const PANEL_WIDTH = 380;

  const handleSelectArch = useCallback(
    (id: string) => {
      stopScenario();
      setActiveArchId(id);
    },
    [stopScenario]
  );

  const handleRunScenario = useCallback(
    (scenario: Scenario) => {
      if (state.isPlaying && state.activeScenario?.id === scenario.id) {
        stopScenario();
      } else {
        runScenario(scenario);
      }
    },
    [state, runScenario, stopScenario]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* ── Nav ────────────────────────────────────────────────── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 48,
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              background: "rgba(167,139,250,0.15)",
              border: "1px solid rgba(167,139,250,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity style={{ width: 10, height: 10, color: "#a78bfa" }} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
              fontWeight: 500,
              color: "#fafafa",
              letterSpacing: "-0.02em",
            }}
          >
            sysvis
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              color: "#52525b",
            }}
          >
            /
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeArchId}
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11,
                color: "#52525b",
              }}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              transition={{ duration: 0.18 }}
            >
              {activeArch.label.toLowerCase().replace(" ", "-")}
            </motion.span>
          </AnimatePresence>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <AnimatePresence mode="wait">
            {state.isPlaying && (
              <motion.div
                key="live"
                initial={{ opacity: 0, scale: 0.85, x: 8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 99,
                  background: "rgba(167,139,250,0.1)",
                  border: "1px solid rgba(167,139,250,0.25)",
                }}
              >
                <motion.div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#a78bfa",
                  }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 9,
                    color: "#a78bfa",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {state.activeScenario?.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <MuteButton muted={muted} onToggle={() => setMuted(!muted)} />
        </div>
      </nav>

      {/* ── Selector ───────────────────────────────────────────── */}
      <div style={{ flexShrink: 0 }}>
        <ArchitectureSelector activeId={activeArchId} onSelect={handleSelectArch} />
      </div>

      {/* ── Tagline ─────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, padding: "10px 24px 4px" }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={activeArchId}
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 11,
              color: "#52525b",
              lineHeight: 1.5,
              margin: 0,
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {activeArch.tagline}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Graph + Panel ───────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          minHeight: 0,
        }}
      >
        {/* Graph — shrinks to make room for panel, overflow hidden only here */}
        <motion.div
          animate={{
            right: panelOpen ? PANEL_WIDTH : 0,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeArchId}
              style={{ position: "absolute", inset: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GraphCanvas
                architecture={activeArch}
                activeStep={state.activeStep}
                activeNodes={state.activeNodes}
                pulsingNodes={state.pulsingNodes}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Detail panel — outside overflow:hidden so slide-in animation works */}
        <DetailPanel
          scenario={state.activeScenario}
          currentStepIndex={state.currentStepIndex}
          isPlaying={state.isPlaying}
          onClose={stopScenario}
        />
      </div>

      {/* ── Scenario Controls ───────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          padding: "12px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              color: "#52525b",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginRight: 4,
            }}
          >
            Scenarios
          </span>
          {activeArch.scenarios.map((scenario, i) => {
            const isActive =
              state.activeScenario?.id === scenario.id && state.isPlaying;
            return (
              <ScenarioButton
                key={`${activeArchId}-${scenario.id}`}
                label={scenario.label}
                isActive={isActive}
                index={i}
                onClick={() => handleRunScenario(scenario)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MuteButton({
  muted,
  onToggle,
}: {
  muted: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.92 }}
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "transparent",
        color: "#52525b",
        cursor: "pointer",
      }}
      whileHover={{ borderColor: "rgba(255,255,255,0.18)", color: "#a1a1aa" }}
    >
      {muted ? (
        <VolumeX style={{ width: 12, height: 12 }} />
      ) : (
        <Volume2 style={{ width: 12, height: 12 }} />
      )}
    </motion.button>
  );
}

function ScenarioButton({
  label,
  isActive,
  index,
  onClick,
}: {
  label: string;
  isActive: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 260,
        damping: 22,
      }}
      whileTap={{ scale: 0.95 }}
      whileHover={
        !isActive
          ? {
              borderColor: "rgba(255,255,255,0.22)",
              color: "#fafafa",
              background: "rgba(255,255,255,0.04)",
            }
          : undefined
      }
      style={{
        position: "relative",
        padding: "6px 14px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 500,
        fontFamily: "var(--font-geist-sans)",
        letterSpacing: "-0.01em",
        border: isActive
          ? "1px solid rgba(167,139,250,0.45)"
          : "1px solid rgba(255,255,255,0.1)",
        color: isActive ? "#c4b5fd" : "#a1a1aa",
        background: isActive ? "rgba(167,139,250,0.12)" : "transparent",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {isActive && (
        <motion.span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 99,
            background: "rgba(167,139,250,0.08)",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
      <span style={{ position: "relative" }}>{label}</span>
    </motion.button>
  );
}
