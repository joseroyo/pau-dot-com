"use client";

import { useEffect, useState } from "react";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
};

const SYMBOLS = ["✦", "✧", "✩", "★", "♡"];
const COLORS = ["var(--pink-strong)", "var(--pink-light)", "#ffffff"];
let nextId = 0;

export default function MouseSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    let lastSpawn = 0;

    function handleMouseMove(e: MouseEvent) {
      const now = Date.now();
      if (now - lastSpawn < 5) return;
      lastSpawn = now;

      const count = 3;
      const newSparkles = Array.from({ length: count }, () => ({
        id: nextId++,
        x: e.clientX + (Math.random() - 0.5) * 20,
        y: e.clientY + (Math.random() - 0.5) * 20,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));

      setSparkles((prev) => [...prev, ...newSparkles]);

      newSparkles.forEach((s) => {
        setTimeout(() => {
            setSparkles((prev) => prev.filter((sp) => sp.id !== s.id));
        }, 1000);
      });
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute text-pink-strong animate-sparkle text-lg"
          style={{ left: `${s.x}px`, top: `${s.y}px`, color: s.color, }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}