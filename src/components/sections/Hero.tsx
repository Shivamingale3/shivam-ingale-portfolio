"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RESUME_DATA } from "@/lib/data";

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-12">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Content (Spans 7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-8 space-y-8"
        >
          {/* Glass Card for Intro */}
          <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-transparent" />

            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-border">
                <Image
                  src={RESUME_DATA.avatarUrl}
                  alt={RESUME_DATA.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs tracking-widest uppercase">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                  System Online
                </div>
                <h2 className="text-foreground text-lg font-bold">
                  Shivam Ingale
                </h2>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-foreground leading-[0.9]">
              FULL STACK <br />
              <span className="text-muted-foreground/50">ARCHITECT</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed font-light">
              Building scalable digital infrastructure with precision and
              aesthetic excellence.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:opacity-90 font-bold h-14 px-10"
              asChild
            >
              <Link href="#projects">
                VIEW WORK <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-border text-foreground hover:bg-secondary/50 h-14 px-10 backdrop-blur-sm"
              asChild
            >
              <Link href="#contact">
                <Terminal className="mr-2 w-4 h-4" /> CONTACT
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Right: Technical Metadata (Spans 4 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="md:col-span-4 hidden md:flex flex-col h-full"
        >
          <div className="glass rounded-3xl p-8 font-mono text-sm text-muted-foreground h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between border-b border-border pb-4 mb-6">
                <span>USER_DATA</span>
                <span className="text-emerald-500">ACTIVE</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>ROLE:</span>
                  <span className="text-foreground">ENGINEER</span>
                </div>
                <div className="flex justify-between">
                  <span>LOC:</span>
                  <span className="text-foreground">INDIA</span>
                </div>
                <div className="flex justify-between">
                  <span>STACK:</span>
                  <span className="text-foreground">NEXT / JAVA</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground/50 truncate">
              ID: {RESUME_DATA.contact.email}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
