"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { architectures, type Architecture } from "@/lib/architectures";
import {
  TwitterPreview,
  NetflixPreview,
  UberPreview,
  GooglePreview,
  StripePreview,
} from "./mini-previews";

const PREVIEW_MAP: Record<string, React.ComponentType> = {
  twitter: TwitterPreview,
  netflix: NetflixPreview,
  uber: UberPreview,
  google: GooglePreview,
  stripe: StripePreview,
};

// Shorter display labels for mono tag so they don't truncate
const SHORT_DESC: Record<string, string> = {
  twitter: "Fan-out write",
  netflix: "Streaming CDN",
  uber: "Geo matching",
  google: "Inv. index",
  stripe: "Payments",
};

interface CardProps {
  arch: Architecture;
  isActive: boolean;
  onSelect: () => void;
  index: number;
}

function ArchCard({ arch, isActive, onSelect, index }: CardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-40, 40], [3, -3]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-60, 60], [-3, 3]), {
    stiffness: 200,
    damping: 25,
  });

  const onMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const Preview = PREVIEW_MAP[arch.id];

  return (
    <motion.button
      ref={cardRef}
      onClick={onSelect}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.055,
        type: "spring",
        stiffness: 260,
        damping: 24,
      }}
      whileHover={{ y: -2 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        overflow: "hidden",
        borderRadius: 9,
        padding: "10px 12px 8px",
        cursor: "pointer",
        outline: "none",
        width: "100%",
        border: isActive
          ? "1px solid rgba(167,139,250,0.38)"
          : "1px solid rgba(255,255,255,0.07)",
        background: isActive
          ? "rgba(167,139,250,0.05)"
          : "rgba(255,255,255,0.018)",
      }}
    >
      {/* Active top glow */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 9,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 100% 55% at 50% 0%, rgba(167,139,250,0.12) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Top inset highlight line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 12,
          right: 12,
          height: 1,
          pointerEvents: "none",
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.09), transparent)",
        }}
      />

      {/* Label row */}
      <div style={{ marginBottom: 6 }}>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 9,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: isActive ? "#a78bfa" : "#52525b",
            marginBottom: 2,
          }}
        >
          {SHORT_DESC[arch.id] ?? arch.description}
        </span>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-geist-sans)",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            color: isActive ? "#fafafa" : "#a1a1aa",
            lineHeight: 1.2,
          }}
        >
          {arch.label}
        </span>
      </div>

      {/* Mini preview */}
      <div
        style={{
          opacity: isActive ? 0.85 : 0.45,
          transform: "scale(0.85)",
          transformOrigin: "left bottom",
          marginTop: 2,
          marginBottom: -8,
          marginLeft: -4,
          pointerEvents: "none",
        }}
      >
        <Preview />
      </div>
    </motion.button>
  );
}

interface ArchitectureSelectorProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export function ArchitectureSelector({
  activeId,
  onSelect,
}: ArchitectureSelectorProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 8,
        padding: "14px 24px 0",
      }}
    >
      {architectures.map((arch, i) => (
        <ArchCard
          key={arch.id}
          arch={arch}
          isActive={arch.id === activeId}
          onSelect={() => onSelect(arch.id)}
          index={i}
        />
      ))}
    </div>
  );
}
