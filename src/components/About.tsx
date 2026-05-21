"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="relative z-10 py-32 px-6">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: "var(--accent)" }}
        >
          About
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-3xl md:text-4xl font-bold mb-10 tracking-tight"
          style={{ color: "var(--text)" }}
        >
          A bit about me
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-base leading-7"
              style={{ color: "var(--text-dim)" }}
            >
              I mainly work with Python and AutoHotkey v2. Most of what I build
              is around automation: tools that handle repetitive tasks, custom
              macro systems, and desktop applications with clean interfaces.
            </motion.p>

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-base leading-7"
              style={{ color: "var(--text-dim)" }}
            >
              On the Python side I use Tkinter and CustomTkinter for building
              desktop GUIs. I also work with mouse and keyboard automation,
              Discord bots, and APIs. Still going deeper on backend and API
              work, but I have working experience with it.
            </motion.p>
          </div>

          <div className="space-y-5">
            <motion.p
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-base leading-7"
              style={{ color: "var(--text-dim)" }}
            >
              I like building utility-focused stuff. Tools that slot into a
              workflow and make something faster or easier to manage. If a
              process is manual and repetitive, there is usually a better way.
            </motion.p>

            <motion.p
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-base leading-7"
              style={{ color: "var(--text-dim)" }}
            >
              I take commissions for custom projects. If you need an automation
              tool, desktop app, macro system, or Discord bot built to your
              specs, feel free to reach out.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
