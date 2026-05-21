"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const skills = [
  { name: "Python", category: "language" },
  { name: "AutoHotkey v2", category: "language" },
  { name: "Tkinter", category: "library" },
  { name: "CustomTkinter", category: "library" },
  { name: "Discord Bots", category: "platform" },
  { name: "APIs", category: "platform" },
  { name: "Automation", category: "specialty" },
  { name: "Mouse & Keyboard", category: "specialty" },
  { name: "Desktop Apps", category: "specialty" },
  { name: "Tooling Systems", category: "specialty" },
];

const categoryColors: Record<string, string> = {
  language: "rgba(124, 106, 255, 0.12)",
  library: "rgba(100, 180, 255, 0.08)",
  platform: "rgba(160, 130, 255, 0.1)",
  specialty: "rgba(180, 160, 255, 0.07)",
};

const categoryBorder: Record<string, string> = {
  language: "rgba(124, 106, 255, 0.3)",
  library: "rgba(100, 180, 255, 0.2)",
  platform: "rgba(160, 130, 255, 0.25)",
  specialty: "rgba(180, 160, 255, 0.18)",
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="skills" className="relative z-10 py-32 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: "var(--accent)" }}
        >
          Skills
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-3xl md:text-4xl font-bold mb-12 tracking-tight"
          style={{ color: "var(--text)" }}
        >
          What I work with
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.05 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="group relative p-4 rounded-xl cursor-default select-none"
              style={{
                background: categoryColors[skill.category],
                border: `1px solid ${categoryBorder[skill.category]}`,
                transition: "box-shadow 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${categoryBorder[skill.category]}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <p
                className="text-sm font-medium leading-snug"
                style={{ color: "var(--text)" }}
              >
                {skill.name}
              </p>
              <p
                className="text-xs mt-1 capitalize"
                style={{ color: "var(--text-muted)" }}
              >
                {skill.category}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
