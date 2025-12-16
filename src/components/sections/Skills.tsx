"use client";

import { RESUME_DATA } from "@/lib/data";
import { motion } from "framer-motion";

const SLUGS: Record<string, string> = {
  "JavaScript": "javascript",
  "TypeScript": "typescript",
  "Java": "openjdk",
  "React.js": "react",
  "Next.js": "nextdotjs",
  "Node.js": "nodedotjs",
  "Express.js": "express",
  "Spring Boot": "springboot",
  "PostgreSQL": "postgresql",
  "MongoDB": "mongodb",
  "MySQL": "mysql",
  "AWS (S3, EC2, Amplify, Cognito)": "amazonaws",
  "GCP": "googlecloud",
  "Docker": "docker",
  "Linux": "linux",
};

export function Skills() {
  const skills = RESUME_DATA.skills;
  // Double the list for seamless loop
  const loopingSkills = [...skills, ...skills];

  return (
    <section id="skills" className="py-24 w-full overflow-hidden">
      <div className="px-6 max-w-6xl mx-auto mb-12 flex items-end gap-4">
        <h2 className="text-4xl font-bold tracking-tight text-white">
          Stack
        </h2>
        <span className="font-mono text-white/30 text-sm mb-2">03 // TECHNOLOGIES</span>
      </div>

      <div className="relative w-full">
        {/* Gradients for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Row 1: Scrolling Left */}
        <div className="flex mb-8 overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: "-50%" }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ width: "200%" }} // Ensure container is wide enough
          >
            {loopingSkills.map((skill, index) => {
               const slug = SLUGS[skill] || "github";
               return (
                 <div 
                   key={`${skill}-${index}`} 
                   className="flex items-center gap-3 px-6 py-4 rounded-full bg-white/5 border border-white/10 shrink-0 backdrop-blur-sm grayscale hover:grayscale-0 transition-all duration-300"
                 >
                    <div className="w-6 h-6 relative">
                      {/* Using standard img for reliability */}
                      <img 
                        src={`https://cdn.simpleicons.org/${slug}`} 
                        alt={skill}
                        className="w-full h-full object-contain invert dark:invert-0"
                        onError={(e) => {
                           // Fallback to generic icon if 404
                           (e.target as HTMLImageElement).src = "https://cdn.simpleicons.org/github";
                        }}
                      />
                    </div>
                    <span className="text-sm font-mono text-white/80 font-bold whitespace-nowrap">
                      {skill}
                    </span>
                 </div>
               );
            })}
          </motion.div>
        </div>

        {/* Row 2: Scrolling Right (Optional, or just one row. User asked for "a constant horizontal scrolling". One row is often cleaner, but two shows more if list is long. Let's do one multi-line or just one long one? Resume has ~15 skills. One row might be too fast/long. Let's stick to one consistent row to keep it clean, maybe slower.) 
           Actually, let's do a second row in reverse for visual interest if the user has many skills.
        */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: "0%" }}
            initial={{ x: "-50%" }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ width: "200%" }}
          >
             {loopingSkills.map((skill, index) => {
               const slug = SLUGS[skill] || "github";
               return (
                 <div 
                   key={`rev-${skill}-${index}`} 
                    className="flex items-center gap-3 px-6 py-4 rounded-full bg-white/5 border border-white/10 shrink-0 backdrop-blur-sm grayscale hover:grayscale-0 transition-all duration-300"
                 >
                    <div className="w-6 h-6 relative">
                      <img 
                        src={`https://cdn.simpleicons.org/${slug}`} 
                        alt={skill}
                        className="w-full h-full object-contain" // SimpleIcons are SVG, usually black. In dark mode we need them white? Next.js Image invert? 
                        // Actually SimpleIcons defaults to brand color. 
                        // The user wanted "coloured 3D icon". So here we want colored 2D icon.
                        // But my theme is monochrome?
                        // "grayscale hover:grayscale-0" handles the reveal.
                      />
                    </div>
                    <span className="text-sm font-mono text-white/80 font-bold whitespace-nowrap">
                      {skill}
                    </span>
                 </div>
               );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
