import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Background3D } from "@/components/layout/Background3D";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers/Providers";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Shivam Ingale | Full Stack Engineer",
  description:
    "Developer portfolio of Shivam Ingale, specializing in Next.js, React, and Java Spring Boot.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          jetbrainsMono.variable,
          "antialiased bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground font-sans"
        )}
      >
        <Providers attribute="class" defaultTheme="dark" enableSystem>
          <Background3D />
          <Navbar />
          <main className="relative z-10 min-h-screen flex flex-col">
            {children}
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
