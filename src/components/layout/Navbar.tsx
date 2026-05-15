"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RESUME_DATA } from "@/lib/data";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-md border-b border-border">
      <div className="text-xl font-bold tracking-tighter text-foreground">
        <Link href="/">
          {RESUME_DATA.name.toUpperCase()}
          <span className="text-primary">.DEV</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        <Link
          href="#projects"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          PROJECTS
        </Link>
        <Link
          href="#experience"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          EXPERIENCE
        </Link>
        <Link
          href="#skills"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          SKILLS
        </Link>
        <Link
          href="#contact"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          CONTACT
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full w-10 h-10 hover:bg-primary/10 transition-colors"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-black"
          asChild
        >
          <a href="/SHIVAM_ASHOK_INGALE_SDE.pdf" target="_blank" >
            RESUME
          </a>
        </Button>
      </div>
    </nav>
  );
}
