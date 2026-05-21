"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 1.9 + delay, ease: [0.25, 0.1, 0.25, 1] },
});

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6"
    >
      <div className="max-w-3xl w-full">
        <motion.p
          {...fadeUp(0)}
          className="text-sm font-mono mb-6 tracking-widest uppercase"
          style={{ color: "var(--accent)" }}
        >
          developer
        </motion.p>

        <motion.h1
          {...fadeUp(0.1)}
          className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6"
          style={{ color: "var(--text)" }}
        >
          Cys
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="text-lg md:text-xl leading-relaxed mb-12 max-w-xl"
          style={{ color: "var(--text-dim)" }}
        >
          I build automation tools, desktop software, and macro systems. Focused
          on workflow efficiency and tools that actually get used.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-wrap gap-3"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: "var(--accent)",
              color: "#fff",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--accent-soft)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px var(--accent-glow-strong)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--accent)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            View Projects
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: "transparent",
              color: "var(--text-dim)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
              (e.currentTarget as HTMLElement).style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-dim)";
            }}
          >
            Contact
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10"
            style={{
              background: "linear-gradient(to bottom, var(--accent), transparent)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
