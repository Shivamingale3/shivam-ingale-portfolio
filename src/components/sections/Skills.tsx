"use client";

import { RESUME_DATA } from "@/lib/data";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const SLUGS: Record<string, string> = {
  JavaScript: "javascript",
  TypeScript: "typescript",
  Java: "openjdk",
  "React.js": "react",
  "Next.js": "nextdotjs",
  "Node.js": "nodedotjs",
  "Express.js": "express",
  "Spring Boot": "springboot",
  PostgreSQL: "postgresql",
  MongoDB: "mongodb",
  MySQL: "mysql",
  "AWS (S3, EC2, Amplify, Cognito)": "amazonaws",
  GCP: "googlecloud",
  Docker: "docker",
  Linux: "linux",
};

export function Skills() {
  const skills = RESUME_DATA.skills;
  // Double the list for seamless loop
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
        {/* Gradients for fade effect - Use from-background to match theme */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

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
            style={{ width: "200%" }}
          >
            {loopingSkills.map((skill, index) => {
              const slug = SLUGS[skill] || "github";
              return (
                <SkillItem
                  key={`${skill}-${index}`}
                  skill={skill}
                  slug={slug}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Row 2: Scrolling Right */}
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
                <SkillItem
                  key={`rev-${skill}-${index}`}
                  skill={skill}
                  slug={slug}
                />
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SkillItem({ skill, slug }: { skill: string; slug: string }) {
  const [src, setSrc] = useState(`https://cdn.simpleicons.org/${slug}`);

  return (
    <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-secondary/30 border border-border shrink-0 backdrop-blur-sm grayscale hover:grayscale-0 transition-all duration-300">
      <div className="w-6 h-6 relative">
        <Image
          src={src}
          alt={skill}
          fill
          className="object-contain dark:invert"
          onError={() => {
            setSrc("https://cdn.simpleicons.org/github");
          }}
        />
      </div>
      <span className="text-sm font-mono text-muted-foreground font-bold whitespace-nowrap">
        {skill}
      </span>
    </div>
  );
}
