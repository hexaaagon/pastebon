"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Loader2 } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DraftsList } from "@/components/drafts-list";

export default function DraftsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="p-8 px-10">
      <header className="pb-4 leading-tight">
        <span className="flex items-center gap-2">
          <Image
            src="/static/images/logo-light.png"
            alt="Pastebon Logo"
            width={48}
            height={48}
            priority
            className="hidden size-6 items-center dark:block"
          />
          <Image
            src="/static/images/logo-dark.png"
            alt="Pastebon Logo"
            width={48}
            height={48}
            priority
            className="block size-6 items-center dark:hidden"
          />
          <p className="font-grotesque font-medium text-xl">
            Pastebon - Drafts
          </p>
        </span>
        <p className="text-sm">
          Paste your codes, logs, and errors{" "}
          <strong className="font-semibold underline">anonymously</strong>.
        </p>
      </header>
      {!mounted ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Loader2 className="animate-spin" />
            </EmptyMedia>
            <EmptyTitle>Loading Drafts...</EmptyTitle>
            <EmptyDescription>
              We're sorting out your drafts...
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <DraftsList showEmpty />
      )}
    </main>
  );
}
