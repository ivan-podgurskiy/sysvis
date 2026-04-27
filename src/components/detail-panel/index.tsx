"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Clock } from "lucide-react";
import type { Scenario, ScenarioStep } from "@/lib/architectures";

const COLOR_BADGE: Record<string, { label: string; bg: string; color: string; border: string }> = {
  write: {
    label: "WRITE",
    bg: "rgba(124,58,237,0.12)",
    color: "#c4b5fd",
    border: "rgba(167,139,250,0.3)",
  },
  read: {
    label: "READ",
    bg: "rgba(8,145,178,0.1)",
    color: "#67e8f9",
    border: "rgba(34,211,238,0.25)",
  },
  process: {
    label: "PROC",
    bg: "rgba(124,58,237,0.08)",
    color: "#a78bfa",
    border: "rgba(167,139,250,0.2)",
  },
  error: {
    label: "ERR",
    bg: "rgba(220,38,38,0.1)",
    color: "#fca5a5",
    border: "rgba(248,113,113,0.3)",
  },
};

interface DetailPanelProps {
  scenario: Scenario | null;
  currentStepIndex: number;
  isPlaying: boolean;
  onClose: () => void;
}

export function DetailPanel({
  scenario,
  currentStepIndex,
  isPlaying,
  onClose,
}: DetailPanelProps) {
  return (
    <AnimatePresence>
      {scenario && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 290, damping: 29 }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 380,
            borderLeft: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(10,10,15,0.95)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            display: "flex",
            flexDirection: "column",
            zIndex: 20,
            boxShadow:
              "-24px 0 64px rgba(0,0,0,0.55), inset 1px 0 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Top inset highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
              pointerEvents: "none",
            }}
          />

          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "18px 20px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 9,
                  color: "#52525b",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                Scenario
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: "#fafafa",
                  margin: 0,
                }}
              >
                {scenario.label}
              </h3>
            </div>

            <motion.button
              onClick={onClose}
              whileHover={{ background: "rgba(255,255,255,0.06)" }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                color: "#52525b",
                cursor: "pointer",
                marginTop: 2,
                flexShrink: 0,
              }}
            >
              <X style={{ width: 12, height: 12 }} />
            </motion.button>
          </div>

          {/* Progress segments */}
          <div style={{ padding: "12px 20px 8px", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 3 }}>
              {scenario.steps.map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    height: 2,
                    flex: 1,
                    borderRadius: 99,
                    background:
                      i < currentStepIndex
                        ? "rgba(167,139,250,0.9)"
                        : i === currentStepIndex
                        ? "rgba(167,139,250,0.55)"
                        : "rgba(255,255,255,0.07)",
                  }}
                  animate={
                    i === currentStepIndex && isPlaying
                      ? { opacity: [0.55, 1, 0.55] }
                      : {}
                  }
                  transition={
                    i === currentStepIndex && isPlaying
                      ? { repeat: Infinity, duration: 1.1 }
                      : {}
                  }
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 9,
                  color: "#52525b",
                }}
              >
                Step {Math.min(currentStepIndex + 1, scenario.steps.length)}/
                {scenario.steps.length}
              </span>
              {isPlaying && (
                <motion.span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 9,
                    color: "#a78bfa",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ repeat: Infinity, duration: 1.3 }}
                >
                  Live
                </motion.span>
              )}
            </div>
          </div>

          {/* Step list */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "4px 20px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {scenario.steps.map((step, i) => (
              <StepItem
                key={i}
                step={step}
                index={i}
                isCurrent={i === currentStepIndex}
                isDone={i < currentStepIndex}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StepItem({
  step,
  index,
  isCurrent,
  isDone,
}: {
  step: ScenarioStep;
  index: number;
  isCurrent: boolean;
  isDone: boolean;
}) {
  const badge = COLOR_BADGE[step.color] ?? COLOR_BADGE.read;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.035,
        type: "spring",
        stiffness: 220,
        damping: 22,
      }}
      style={{
        position: "relative",
        borderRadius: 8,
        padding: "10px 12px",
        border: isCurrent
          ? "1px solid rgba(167,139,250,0.28)"
          : "1px solid rgba(255,255,255,0.055)",
        background: isCurrent
          ? "rgba(167,139,250,0.04)"
          : isDone
          ? "transparent"
          : "rgba(255,255,255,0.015)",
        opacity: isDone ? 0.48 : 1,
      }}
    >
      {/* Current item top glow */}
      {isCurrent && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(167,139,250,0.5), transparent)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* From → To + badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 6,
          flexWrap: "nowrap",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10,
            fontWeight: 500,
            color: isCurrent ? "#e4e4e7" : "#71717a",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "36%",
          }}
        >
          {step.from}
        </span>
        <ArrowRight
          style={{
            width: 10,
            height: 10,
            color: "#3f3f46",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10,
            fontWeight: 500,
            color: isCurrent ? "#e4e4e7" : "#71717a",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
          }}
        >
          {step.to}
        </span>
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 8,
            fontWeight: 500,
            padding: "2px 6px",
            borderRadius: 4,
            background: badge.bg,
            color: badge.color,
            border: `1px solid ${badge.border}`,
            letterSpacing: "0.06em",
            flexShrink: 0,
          }}
        >
          {badge.label}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: 11,
          color: isCurrent ? "#a1a1aa" : "#52525b",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {step.description}
      </p>

      {/* Delay indicator */}
      {step.delayMs > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 6,
          }}
        >
          <Clock style={{ width: 9, height: 9, color: "#3f3f46" }} />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 9,
              color: "#3f3f46",
            }}
          >
            +{step.delayMs}ms
          </span>
        </div>
      )}
    </motion.div>
  );
}
