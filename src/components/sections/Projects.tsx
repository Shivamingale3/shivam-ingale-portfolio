"use client";

import { motion } from "framer-motion";
import { RESUME_DATA } from "@/lib/data";
import { ArrowUpRight, Folder } from "lucide-react";
import Link from "next/link";

export function Projects() {
  return (
    <section id="projects" className="px-6 py-24 max-w-6xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mb-16 flex items-end gap-4"
      >
        <h2 className="text-4xl font-bold tracking-tight text-foreground">
          Selected Work
        </h2>
        <span className="font-mono text-muted-foreground text-sm mb-2">
          01 // ARCHIVE
        </span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {RESUME_DATA.projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="glass glass-hover rounded-3xl p-8 h-full flex flex-col relative overflow-hidden">
              {/* Decorative Gradient Blob */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

              <div className="flex justify-between items-start mb-8 relative z-10">
                {project.logo ? (
                  <div className="w-12 h-12 bg-secondary/30 rounded-2xl border border-border p-2 flex items-center justify-center">
                    <img
                      src={project.logo}
                      className="w-full h-full object-contain"
                      alt={project.title}
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-secondary/30 rounded-2xl border border-border">
                    <Folder className="w-6 h-6 text-foreground" />
                  </div>
                )}
                <Link
                  href={project.link.href}
                  className="px-4 py-2 rounded-full bg-secondary/30 border border-border hover:bg-primary hover:text-primary-foreground transition-all text-xs font-mono uppercase flex items-center gap-2"
                >
                  View Project <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3 relative z-10">
                {project.title}
              </h3>

              <p className="text-muted-foreground mb-8 text-sm leading-relaxed grow font-light border-b border-border pb-8 relative z-10">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 relative z-10">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-[10px] font-mono text-muted-foreground font-bold bg-secondary/50 rounded-full border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
