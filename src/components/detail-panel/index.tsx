"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Clock } from "lucide-react";
import type { Scenario, ScenarioStep } from "@/lib/architectures";

const COLOR_BADGE: Record<string, { label: string; bg: string; color: string; border: string }> = {
  write: {
    label: "WRITE",
    bg: "var(--badge-write-bg)",
    color: "var(--badge-write-color)",
    border: "var(--badge-write-border)",
  },
  read: {
    label: "READ",
    bg: "var(--badge-read-bg)",
    color: "var(--badge-read-color)",
    border: "var(--badge-read-border)",
  },
  process: {
    label: "PROC",
    bg: "var(--badge-proc-bg)",
    color: "var(--badge-proc-color)",
    border: "var(--badge-proc-border)",
  },
  error: {
    label: "ERR",
    bg: "var(--badge-err-bg)",
    color: "var(--badge-err-color)",
    border: "var(--badge-err-border)",
  },
};

interface DetailPanelProps {
  scenario: Scenario | null;
  currentStepIndex: number;
  isPlaying: boolean;
  onClose: () => void;
  onStepClick: (index: number) => void;
  width?: number;
}

export function DetailPanel({
  scenario,
  currentStepIndex,
  isPlaying,
  onClose,
  onStepClick,
  width = 392,
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
            width,
            borderLeft: "1px solid var(--border-subtle)",
            background: "var(--panel-bg)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            display: "flex",
            flexDirection: "column",
            zIndex: 20,
            boxShadow: "var(--panel-shadow)",
            minWidth: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: "var(--panel-highlight)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "18px 20px 14px",
              borderBottom: "1px solid var(--border-subtle)",
              flexShrink: 0,
              minWidth: 0,
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "var(--text-2xs)",
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 5,
                }}
              >
                Scenario
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: "var(--text-primary)",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {scenario.label}
              </h3>
            </div>

            <motion.button
              type="button"
              aria-label="Close scenario"
              onClick={onClose}
              whileHover={{ background: "var(--glass-bg-hover)" }}
              whileTap={{ scale: 0.92 }}
              className="icon-btn"
              style={{ marginTop: 2 }}
            >
              <X style={{ width: 13, height: 13 }} />
            </motion.button>
          </div>

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
                        ? "var(--progress-done)"
                        : i === currentStepIndex
                        ? "var(--progress-current)"
                        : "var(--progress-idle)",
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
                  fontSize: "var(--text-xs)",
                  color: "var(--text-tertiary)",
                }}
              >
                Step {Math.min(currentStepIndex + 1, scenario.steps.length)}/
                {scenario.steps.length}
              </span>
              {isPlaying && (
                <motion.span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--accent-violet)",
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

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "4px 20px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              minHeight: 0,
            }}
          >
            {scenario.steps.map((step, i) => (
              <StepItem
                key={i}
                step={step}
                index={i}
                isCurrent={i === currentStepIndex}
                isDone={i < currentStepIndex}
                onClick={() => onStepClick(i)}
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
  onClick,
}: {
  step: ScenarioStep;
  index: number;
  isCurrent: boolean;
  isDone: boolean;
  onClick: () => void;
}) {
  const badge = COLOR_BADGE[step.color] ?? COLOR_BADGE.read;

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.035,
        type: "spring",
        stiffness: 220,
        damping: 22,
      }}
      whileHover={{
        borderColor: isCurrent
          ? "rgba(167,139,250,0.5)"
          : "var(--border-hover)",
        background: isCurrent
          ? "rgba(167,139,250,0.07)"
          : "var(--glass-bg-hover)",
        opacity: 1,
      }}
      whileTap={{ scale: 0.985 }}
      style={{
        position: "relative",
        borderRadius: 8,
        padding: "10px 12px",
        border: isCurrent
          ? "1px solid var(--border-active)"
          : "1px solid var(--border-base)",
        background: isCurrent
          ? "rgba(167,139,250,0.04)"
          : isDone
          ? "transparent"
          : "var(--glass-bg)",
        opacity: isDone ? 0.48 : 1,
        cursor: "pointer",
        minWidth: 0,
      }}
    >
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 6,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            color: isCurrent ? "var(--text-primary)" : "var(--text-muted)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "36%",
            minWidth: 0,
          }}
        >
          {step.from}
        </span>
        <ArrowRight
          style={{
            width: 12,
            height: 12,
            color: "var(--text-faint)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            color: isCurrent ? "var(--text-primary)" : "var(--text-muted)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
            minWidth: 0,
          }}
        >
          {step.to}
        </span>
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "var(--text-2xs)",
            fontWeight: 500,
            padding: "2px 7px",
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

      <p
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "var(--text-base)",
          color: isCurrent ? "var(--text-secondary)" : "var(--text-tertiary)",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {step.description}
      </p>

      {step.delayMs > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 6,
          }}
        >
          <Clock style={{ width: 11, height: 11, color: "var(--text-faint)" }} />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--text-faint)",
            }}
          >
            +{step.delayMs}ms
          </span>
        </div>
      )}
    </motion.div>
  );
}
