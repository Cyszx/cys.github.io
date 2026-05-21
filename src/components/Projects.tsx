"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface Project {
  title: string;
  tags: string[];
  description: string[];
  link?: { label: string; href: string };
}

const projects: Project[] = [
  {
    title: "Macro Suite",
    tags: ["AutoHotkey v2", "Automation", "Tooling"],
    description: [
      "Roblox macro platform supporting 7+ games.",
      "Includes automation systems and custom tooling built around efficiency and repeatable workflows.",
      "Connected to an active Discord community.",
    ],
    link: { label: "discord.gg/cys", href: "https://discord.gg/cys" },
  },
  {
    title: "Key System",
    tags: ["Python", "AutoHotkey", "Security"],
    description: [
      "Authentication and licensing platform for macros.",
      "Generates secure keys, locks them to HWID, and prevents unauthorized sharing.",
      "Designed for AutoHotkey-based tools.",
    ],
  },
  {
    title: "Desktop Utilities",
    tags: ["Python", "Tkinter", "CustomTkinter"],
    description: [
      "Collection of Python and AutoHotkey applications.",
      "Workflow tools, automation utilities, mouse and keyboard systems, and custom desktop software.",
    ],
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative p-6 md:p-8 rounded-2xl flex flex-col gap-5"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 32px rgba(124, 106, 255, 0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--accent-glow-strong), transparent)",
          opacity: 0,
          transition: "opacity 0.25s",
        }}
        ref={(el) => {
          if (!el) return;
          const parent = el.parentElement;
          if (!parent) return;
          parent.addEventListener("mouseenter", () => (el.style.opacity = "1"));
          parent.addEventListener("mouseleave", () => (el.style.opacity = "0"));
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <h3
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          {project.title}
        </h3>
        <span
          className="text-xs font-mono px-2 py-1 rounded-md shrink-0"
          style={{
            background: "var(--accent-glow)",
            color: "var(--accent-soft)",
            border: "1px solid rgba(124, 106, 255, 0.2)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-md"
            style={{
              background: "var(--surface-2)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <ul className="space-y-2">
        {project.description.map((d, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-sm leading-relaxed"
            style={{ color: "var(--text-dim)" }}
          >
            <span
              className="shrink-0 mt-2 w-1 h-1 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            {d}
          </li>
        ))}
      </ul>

      {project.link && (
        <a
          href={project.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm mt-auto self-start transition-colors duration-200"
          style={{ color: "var(--accent-soft)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--text)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--accent-soft)")
          }
        >
          {project.link.label}
          <ExternalLink size={12} />
        </a>
      )}
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="projects" className="relative z-10 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div ref={ref}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono uppercase tracking-widest mb-4"
            style={{ color: "var(--accent)" }}
          >
            Projects
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-3xl md:text-4xl font-bold mb-12 tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Things I have built
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
