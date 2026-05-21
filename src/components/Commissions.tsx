"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  { label: "Automation tools", desc: "Script-based or app-based automation for repetitive tasks." },
  { label: "Desktop applications", desc: "Python GUI apps using Tkinter or CustomTkinter." },
  { label: "Macro systems", desc: "AutoHotkey v2 macros, suites, and supporting tooling." },
  { label: "Discord bots", desc: "Bots built to your spec, from simple commands to full systems." },
  { label: "Custom utilities", desc: "Private tools built for specific workflows or setups." },
];

export default function Commissions() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="commissions" className="relative z-10 py-32 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: "var(--accent)" }}
        >
          Commissions
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Open for work
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="text-base mb-12 max-w-lg"
          style={{ color: "var(--text-dim)" }}
        >
          Taking commissions for custom tools and projects. Reach out on Discord
          with what you need and we can go from there.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.07 }}
              whileHover={{ y: -2 }}
              className="p-5 rounded-xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")
              }
            >
              <div
                className="w-2 h-2 rounded-full mb-4"
                style={{ background: "var(--accent)" }}
              />
              <p
                className="text-sm font-medium mb-1.5"
                style={{ color: "var(--text)" }}
              >
                {s.label}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: "var(--accent-glow)",
              color: "var(--accent-soft)",
              border: "1px solid rgba(124, 106, 255, 0.25)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(124, 106, 255, 0.2)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(124, 106, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--accent-glow)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(124, 106, 255, 0.25)";
            }}
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
