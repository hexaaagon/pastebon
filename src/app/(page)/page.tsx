"use client";
import { Suspense, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeEditor } from "@/components/code-editor";

export default function Landing() {
  const [code, setCode] = useState("");

  return (
    <main className="p-6 px-8">
      <Card>
        <CardHeader>
          <CardTitle>Paste</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeEditor code={code} setCode={setCode} />
        </CardContent>
      </Card>
    </main>
  );
}
