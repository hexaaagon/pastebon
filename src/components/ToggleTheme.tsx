"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Sun, Moon, LucideProps } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ToggleTheme({ ...props }: LucideProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Skeleton className="h-9 w-9" />;

  return (
    <Button
      onClick={() =>
        resolvedTheme === "dark" ? setTheme("light") : setTheme("dark")
      }
      size="icon"
    >
      {resolvedTheme === "dark" ? <Sun {...props} /> : <Moon {...props} />}
    </Button>
  );
}
