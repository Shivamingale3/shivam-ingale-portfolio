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
        <h2 className="text-4xl font-bold tracking-tight text-white">
          Selected Work
        </h2>
        <span className="font-mono text-white/30 text-sm mb-2">01 // ARCHIVE</span>
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
               <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />
               
               <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <Folder className="w-6 h-6 text-white" />
                 </div>
                 <Link href={project.link.href} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all text-xs font-mono uppercase flex items-center gap-2">
                   View Project <ArrowUpRight className="w-3 h-3" />
                 </Link>
               </div>
               
               <h3 className="text-2xl font-bold text-white mb-3 relative z-10">
                 {project.title}
               </h3>
               
               <p className="text-gray-400 mb-8 text-sm leading-relaxed flex-grow font-light border-b border-white/5 pb-8 relative z-10">
                 {project.description}
               </p>
               
               <div className="flex flex-wrap gap-2 relative z-10">
                 {project.techStack.map((tech) => (
                   <span key={tech} className="px-3 py-1 text-[10px] font-mono text-white/80 bg-black/40 rounded-full border border-white/5">
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
