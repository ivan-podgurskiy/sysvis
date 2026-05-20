"use client";

import { motion } from "framer-motion";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: 0.4 },
});

export function TwitterPreview() {
  const center = { x: 38, y: 50 };
  const spokes = [
    { x: 82, y: 18 },
    { x: 100, y: 48 },
    { x: 88, y: 80 },
    { x: 115, y: 25 },
    { x: 128, y: 55 },
    { x: 112, y: 78 },
  ];
  return (
    <svg width="150" height="100" viewBox="0 0 150 100" fill="none">
      {spokes.map((s, i) => (
        <motion.line
          key={i}
          x1={center.x}
          y1={center.y}
          x2={s.x}
          y2={s.y}
          stroke="var(--preview-line)"
          strokeOpacity={0.2 + i * 0.05}
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.07 + 0.1, duration: 0.35 }}
        />
      ))}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={6}
        fill="var(--preview-accent)"
        {...fadeIn(0)}
      />
      {spokes.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={3}
          fill="var(--preview-accent)"
          fillOpacity={0.4 + i * 0.06}
          {...fadeIn(i * 0.07 + 0.15)}
        />
      ))}
    </svg>
  );
}

export function NetflixPreview() {
  return (
    <svg width="150" height="100" viewBox="0 0 150 100" fill="none">
      {[
        { x: 8, y: 8, w: 134, h: 84 },
        { x: 22, y: 20, w: 106, h: 60 },
        { x: 36, y: 32, w: 78, h: 36 },
      ].map((r, i) => (
        <motion.rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={3}
          stroke="var(--accent-cyan)"
          strokeOpacity={0.18 + i * 0.18}
          strokeWidth="1"
          fill="var(--accent-cyan)"
          fillOpacity={0.02 + i * 0.02}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.09, duration: 0.35, ease: "easeOut" }}
          style={{ transformOrigin: "75px 50px" }}
        />
      ))}
      <motion.circle
        cx={75}
        cy={50}
        r={7}
        fill="var(--accent-cyan)"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.35, duration: 0.45 }}
      />
      <motion.path
        d="M 71 50 L 78 46 L 78 54 Z"
        fill="var(--bg-base)"
        fillOpacity={0.85}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
    </svg>
  );
}

export function UberPreview() {
  return (
    <svg width="150" height="100" viewBox="0 0 150 100" fill="none">
      <motion.circle
        cx={22}
        cy={35}
        r={7}
        fill="var(--preview-accent)"
        fillOpacity={0.7}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, delay: 0 }}
      />
      <motion.circle
        cx={22}
        cy={68}
        r={7}
        fill="var(--accent-cyan)"
        fillOpacity={0.7}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
      />
      <motion.circle
        cx={128}
        cy={51}
        r={9}
        fill="var(--preview-accent)"
        fillOpacity={0.85}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, delay: 0.3 }}
      />
      <motion.path
        d="M 29 35 C 60 10 100 30 120 46"
        stroke="var(--preview-line)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      />
      <motion.path
        d="M 29 68 C 60 90 100 72 120 56"
        stroke="var(--preview-cyan)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
      <motion.circle
        cx={128}
        cy={51}
        r={14}
        fill="none"
        stroke="var(--preview-line)"
        strokeWidth="1"
        initial={{ scale: 0.5, opacity: 0.8 }}
        animate={{ scale: 1.4, opacity: 0 }}
        transition={{ delay: 0.7, duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }}
      />
    </svg>
  );
}

export function GooglePreview() {
  const shards = [18, 34, 50, 66];
  return (
    <svg width="150" height="100" viewBox="0 0 150 100" fill="none">
      <motion.circle
        cx={18}
        cy={50}
        r={6}
        fill="var(--preview-accent)"
        fillOpacity={0.8}
        {...fadeIn(0)}
      />
      {shards.map((y, i) => (
        <g key={i}>
          <motion.line
            x1={24}
            y1={50}
            x2={72}
            y2={y}
            stroke="var(--preview-line)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.05 + 0.1, duration: 0.28 }}
          />
          <motion.rect
            x={72}
            y={y - 6}
            width={34}
            height={12}
            rx={3}
            fill="var(--accent-cyan)"
            fillOpacity={0.06}
            stroke="var(--accent-cyan)"
            strokeOpacity={0.28}
            strokeWidth="0.8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: i * 0.06 + 0.18, duration: 0.28 }}
            style={{ transformOrigin: "72px 50px" } as React.CSSProperties}
          />
          <motion.line
            x1={106}
            y1={y}
            x2={132}
            y2={50}
            stroke="var(--preview-cyan)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.06 + 0.32, duration: 0.22 }}
          />
        </g>
      ))}
      <motion.circle
        cx={132}
        cy={50}
        r={7}
        fill="var(--accent-cyan)"
        fillOpacity={0.8}
        {...fadeIn(0.5)}
      />
    </svg>
  );
}

export function StripePreview() {
  const pts = [
    { x: 16, y: 50 },
    { x: 44, y: 20 },
    { x: 80, y: 50 },
    { x: 116, y: 22 },
    { x: 134, y: 50 },
    { x: 116, y: 78 },
    { x: 80, y: 50 },
    { x: 44, y: 80 },
    { x: 16, y: 50 },
  ];
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  return (
    <svg width="150" height="100" viewBox="0 0 150 100" fill="none">
      <motion.path
        d={d}
        stroke="var(--preview-line)"
        strokeWidth="1.2"
        fill="var(--preview-accent)"
        fillOpacity={0.04}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />
      {pts.slice(0, -1).map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === 0 ? 5 : 3}
          fill="var(--preview-accent)"
          fillOpacity={i === 0 ? 1 : 0.3 + i * 0.08}
          {...fadeIn(i * 0.09 + 0.1)}
        />
      ))}
    </svg>
  );
}
