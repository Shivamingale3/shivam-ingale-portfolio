"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (timer <= 0) {
      router.push("/");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="mb-4 text-6xl font-bold tracking-tighter text-primary md:text-8xl">
        404
      </h1>
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
        Page Not Found
      </h2>
      <p className="mb-8 max-w-150 text-muted-foreground md:text-lg">
        We couldn&apos;t find the page you&apos;re looking for. Maybe it was
        moved or doesn&apos;t exist anymore.
      </p>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>
            Redirecting to home in{" "}
            <span className="font-semibold text-foreground">{timer}</span>{" "}
            second
            {timer === 1 ? "" : "s"}...
          </span>
        </div>

        <Button variant="outline" className="cursor-pointer mt-2" onClick={()=>router.replace("/")}>
          <Home className="mr-2 h-4 w-4" />
          Return Home Now
        </Button>
      </div>
    </div>
  );
}
