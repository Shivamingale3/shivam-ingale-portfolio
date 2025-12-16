"use client";

import { motion } from "framer-motion";
import { RESUME_DATA } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="px-6 py-24 max-w-4xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mb-16 flex items-center justify-between"
      >
        <div className="flex items-end gap-4">
            <h2 className="text-4xl font-bold tracking-tight text-white">
            Experience
            </h2>
            <span className="font-mono text-white/30 text-sm mb-2">02 // LOG</span>
        </div>
      </motion.div>

      <div className="space-y-8 relative">
        {/* Continuous Line */}
        <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />

        {RESUME_DATA.work.map((role, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-0 md:pl-12"
          >
            {/* Timeline Dot */}
            <div className="absolute left-[13px] top-8 w-2 h-2 rounded-full bg-white hidden md:block z-10 box-content border-4 border-black" />

            <div className="glass rounded-3xl p-8 transition-all hover:bg-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                   <div>
                      <h3 className="text-2xl font-bold text-white">{role.company}</h3>
                      <p className="text-white/60 font-medium">{role.title}</p>
                   </div>
                   <span className="font-mono text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      {role.start} — {role.end}
                   </span>
                </div>
                
                <p className="text-gray-400 leading-relaxed mb-6 font-light">
                  {role.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                   {role.badges.map((badge) => (
                     <span key={badge} className="text-[10px] font-mono text-white/80 border border-white/100 px-3 py-1 rounded-full uppercase tracking-wider">
                       {badge}
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
