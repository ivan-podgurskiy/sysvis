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
        minWidth: 0,
        border: isActive
          ? "1px solid var(--border-active)"
          : "1px solid var(--border-base)",
        background: isActive
          ? "rgba(167,139,250,0.06)"
          : "var(--glass-bg)",
        boxShadow: isActive
          ? "0 0 0 1px rgba(124,58,237,0.08)"
          : "0 1px 2px rgba(24,24,27,0.04)",
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 9,
            pointerEvents: "none",
            background: "var(--card-active-glow)",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 12,
          right: 12,
          height: 1,
          pointerEvents: "none",
          background: "var(--card-inset-line)",
        }}
      />

      <div style={{ marginBottom: 6, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "var(--text-2xs)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: isActive ? "var(--accent-violet)" : "var(--text-tertiary)",
            marginBottom: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {SHORT_DESC[arch.id] ?? arch.description}
        </span>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-geist-sans)",
            fontSize: "var(--text-base)",
            fontWeight: 600,
            letterSpacing: "-0.025em",
            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {arch.label}
        </span>
      </div>

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
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        gap: 8,
        padding: "14px 24px 0",
        minWidth: 0,
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
