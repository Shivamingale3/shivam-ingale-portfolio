"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RESUME_DATA } from "@/lib/data";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-md border-b border-white/10">
      <div className="text-xl font-bold tracking-tighter text-foreground">
        <Link href="/">
          {RESUME_DATA.name.toUpperCase()}
          <span className="text-primary">.DEV</span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        <Link href="#projects" className="text-sm font-medium hover:text-primary transition-colors">
          PROJECTS
        </Link>
        <Link href="#experience" className="text-sm font-medium hover:text-primary transition-colors">
          EXPERIENCE
        </Link>
        <Link href="#skills" className="text-sm font-medium hover:text-primary transition-colors">
          SKILLS
        </Link>
        <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
          CONTACT
        </Link>
        
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
          RESUME
        </Button>
      </div>
    </nav>
  );
}
