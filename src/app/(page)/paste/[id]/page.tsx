import Image from "next/image";

import { Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewCodeEditor } from "@/components/view-code-editor";

import { Skeleton } from "@/components/ui/skeleton";
import { viewCode } from "@/lib/actions/code";

function relativeTime(date: string): string {
  const now = new Date(new Date().toLocaleString("en", { timeZone: "UTC" }));
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60)
    return `${diff} second${diff !== 1 ? "s" : ""} ago`.replace("-", "");
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export default async function ViewCode({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = await viewCode({ id: (await params).id });

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
          <p className="font-grotesque text-xl font-medium">Pastebon</p>
        </span>
        <p className="text-sm">
          Paste your codes, logs, and errors{" "}
          <strong className="font-semibold underline">anonymously</strong>.
        </p>
      </header>
      <Card>
        <CardHeader>
          <span className="flex items-center justify-end gap-2">
            <span className="flex items-center gap-1">
              <Eye size={20} />
              {!data?.success ? (
                <Skeleton className="h-4 w-6" />
              ) : (
                <p className="text-sm">{data!.data?.views}</p>
              )}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={20} />
              {!data?.success ? (
                <Skeleton className="h-4 w-20" />
              ) : (
                <p className="text-sm">{relativeTime(data!.data?.createdAt)}</p>
              )}
            </span>
          </span>
        </CardHeader>
        <CardContent className="-mt-4">
          {!data?.success ? (
            <Skeleton className="h-[calc(60vh)] w-full" />
          ) : (
            <ViewCodeEditor
              language={!data?.success ? "plaintext" : data!.data?.language}
              code={!data?.success ? "Loading..." : data!.data?.paste}
              id={(await params).id}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
