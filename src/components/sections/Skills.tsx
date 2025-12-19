"use client";

import { RESUME_DATA } from "@/lib/data";
import { motion } from "framer-motion";
import {
  SiAmazonwebservices,
  SiDocker,
  SiExpress,
  SiGooglecloud,
  SiJavascript,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiReact,
  SiSpringboot,
  SiTypescript,
} from "react-icons/si";
import { IconType } from "react-icons";
import { useState } from "react";

// Mapping of skill names to Icons and Brand Colors
const SKILL_ICONS: Record<string, { icon: IconType; color: string }> = {
  JavaScript: { icon: SiJavascript, color: "#F7DF1E" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  Java: { icon: SiOpenjdk, color: "#FFFFFF" },
  "React.js": { icon: SiReact, color: "#61DAFB" },
  "Next.js": { icon: SiNextdotjs, color: "#AAA" }, // Neutral
  "Node.js": { icon: SiNodedotjs, color: "#339933" },
  "Express.js": { icon: SiExpress, color: "#AAAAAA" },
  "Spring Boot": { icon: SiSpringboot, color: "#6DB33F" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
  MongoDB: { icon: SiMongodb, color: "#47A248" },
  MySQL: { icon: SiMysql, color: "#4479A1" },
  "AWS (S3, EC2, Amplify, Cognito)": {
    icon: SiAmazonwebservices,
    color: "#FF9900",
  },
  GCP: { icon: SiGooglecloud, color: "#4285F4" },
  Docker: { icon: SiDocker, color: "#2496ED" },
  Linux: { icon: SiLinux, color: "#FCC624" },
};

export function Skills() {
  const skills = RESUME_DATA.skills;
  const loopingSkills = [...skills, ...skills];

  return (
    <section id="skills" className="py-24 w-full overflow-hidden">
      <div className="px-6 max-w-6xl mx-auto mb-12 flex items-end gap-4">
        <h2 className="text-4xl font-bold tracking-tight text-foreground">
          Stack
        </h2>
        <span className="font-mono text-muted-foreground text-sm mb-2">
          03 // TECHNOLOGIES
        </span>
      </div>

      <div className="relative w-full">
        {/* Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Row 1 */}
        <div className="flex mb-8 overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: "-50%" }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ width: "200%" }}
          >
            {loopingSkills.map((skill, index) => (
              <SkillItem key={`${skill}-${index}`} skill={skill} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: "0%" }}
            initial={{ x: "-50%" }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ width: "200%" }}
          >
            {loopingSkills.map((skill, index) => (
              <SkillItem key={`rev-${skill}-${index}`} skill={skill} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SkillItem({ skill }: { skill: string }) {
  const data = SKILL_ICONS[skill] || { icon: SiJavascript, color: "#888" };
  const Icon = data.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex items-center gap-3 px-6 py-4 rounded-full border transition-all duration-300 backdrop-blur-md cursor-default"
      style={{
        borderColor: isHovered ? data.color : "rgba(255,255,255,0.1)",
        backgroundColor: isHovered
          ? `${data.color}20` // 20 hex opacity (~12%)
          : "rgba(120, 120, 120, 0.1)",
        boxShadow: isHovered ? `0 0 20px -5px ${data.color}` : "none",
      }}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <Icon
          className="w-full h-full transition-transform duration-300 group-hover:scale-110"
          style={{ color: data.color }}
        />
      </div>
      <span
        className="text-sm font-mono font-bold whitespace-nowrap transition-colors duration-300"
        style={{
          color: isHovered ? data.color : "", // Inherit standard text color usually, or force white/foreground
        }}
      >
        <span className={isHovered ? "" : "text-muted-foreground"}>
          {skill}
        </span>
      </span>
    </div>
  );
}
