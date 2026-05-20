"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Activity, Sun, Moon } from "lucide-react";
import { architectures, getArchitecture, type Scenario } from "@/lib/architectures";
import { ArchitectureSelector } from "@/components/architecture-selector";
import { GraphCanvas } from "@/components/graph-canvas";
import { DetailPanel } from "@/components/detail-panel";
import { useScenarioRunner } from "@/hooks/use-scenario-runner";
import { useCursorGlow } from "@/hooks/use-cursor-glow";
import { useTheme } from "@/hooks/use-theme";

export function Visualizer() {
  useCursorGlow();
  const { theme, toggleTheme } = useTheme();

  const [activeArchId, setActiveArchId] = useState(architectures[0].id);
  const [muted, setMuted] = useState(true);

  const activeArch = getArchitecture(activeArchId)!;
  const { state, runScenario, stopScenario, jumpToStep } = useScenarioRunner();

  const panelOpen = !!state.activeScenario;
  const PANEL_WIDTH = 392;

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
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 52,
          flexShrink: 0,
          borderBottom: "1px solid var(--border-subtle)",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "rgba(167,139,250,0.15)",
              border: "1px solid rgba(167,139,250,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Activity
              style={{ width: 11, height: 11, color: "var(--accent-violet)" }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              flexShrink: 0,
            }}
          >
            sysvis
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--text-tertiary)",
              flexShrink: 0,
            }}
          >
            /
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeArchId}
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--text-tertiary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
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

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
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
                    background: "var(--accent-violet)",
                  }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "var(--text-2xs)",
                    color: "var(--accent-violet)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {state.activeScenario?.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <IconButton
            label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun style={{ width: 13, height: 13 }} />
            ) : (
              <Moon style={{ width: 13, height: 13 }} />
            )}
          </IconButton>
          <IconButton
            label={muted ? "Unmute" : "Mute"}
            onClick={() => setMuted(!muted)}
          >
            {muted ? (
              <VolumeX style={{ width: 13, height: 13 }} />
            ) : (
              <Volume2 style={{ width: 13, height: 13 }} />
            )}
          </IconButton>
        </div>
      </nav>

      <div style={{ flexShrink: 0, minWidth: 0 }}>
        <ArchitectureSelector activeId={activeArchId} onSelect={handleSelectArch} />
      </div>

      <div style={{ flexShrink: 0, padding: "10px 24px 4px", minWidth: 0 }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={activeArchId}
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "var(--text-xs)",
              color: "var(--text-tertiary)",
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

      <div
        style={{
          flex: 1,
          position: "relative",
          minHeight: 0,
          minWidth: 0,
        }}
      >
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
            minWidth: 0,
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

        <DetailPanel
          scenario={state.activeScenario}
          currentStepIndex={state.currentStepIndex}
          isPlaying={state.isPlaying}
          onClose={stopScenario}
          onStepClick={jumpToStep}
          width={PANEL_WIDTH}
        />
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: "14px 24px",
          borderTop: "1px solid var(--border-subtle)",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--text-tertiary)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginRight: 8,
              flexShrink: 0,
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

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="icon-btn"
      whileHover={{
        borderColor: "var(--border-hover)",
        color: "var(--text-secondary)",
      }}
    >
      {children}
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
              borderColor: "var(--border-hover)",
              color: "var(--text-primary)",
              background: "var(--glass-bg-hover)",
            }
          : undefined
      }
      style={{
        position: "relative",
        padding: "8px 20px",
        borderRadius: 99,
        fontSize: "var(--text-base)",
        fontWeight: 500,
        fontFamily: "var(--font-geist-sans)",
        letterSpacing: "-0.01em",
        border: isActive
          ? "1px solid rgba(167,139,250,0.45)"
          : "1px solid var(--border-base)",
        color: isActive ? "var(--accent-violet-soft)" : "var(--text-secondary)",
        background: isActive ? "rgba(167,139,250,0.12)" : "transparent",
        cursor: "pointer",
        overflow: "hidden",
        flexShrink: 0,
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
      <span style={{ position: "relative", whiteSpace: "nowrap" }}>{label}</span>
    </motion.button>
  );
}
