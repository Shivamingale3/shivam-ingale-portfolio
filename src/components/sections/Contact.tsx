"use client";

import { motion } from "framer-motion";
import { RESUME_DATA } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Mail, Copy } from "lucide-react";
import { toast } from "sonner";

export function Contact() {
  return (
    <section id="contact" className="px-6 py-32 max-w-3xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="glass rounded-[2rem] p-8 md:p-16 text-center"
      >
        <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-8 border border-white/10">
          <Mail className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Let's work together.
        </h2>

        <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
          Currently open for new opportunities. Whether you have a question or
          just want to say hi, my inbox is open.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="rounded-full bg-white text-black hover:bg-gray-200 font-bold h-14 px-10 text-base"
            asChild
          >
            <a href={`mailto:${RESUME_DATA.contact.email}`}>Say Hello</a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 h-14 px-10 backdrop-blur-md"
            onClick={() => {
              navigator.clipboard.writeText(RESUME_DATA.contact.email);
              toast.success("Email copied to clipboard!");
            }}
          >
            <Copy className="mr-2 w-4 h-4" /> Copy Email
          </Button>
        </div>
      </motion.div>

      <footer className="mt-24 text-center text-xs text-gray-600 font-mono tracking-widest uppercase">
        <p>© 2024 {RESUME_DATA.name} // ALL SYSTEMS OPERATIONAL</p>
      </footer>
    </section>
  );
}
