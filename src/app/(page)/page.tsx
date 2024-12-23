"use client";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCodeEditor } from "@/components/create-code-editor";

export default function Landing() {
  const [code, setCode] = useState("");

  return (
    <main className="p-6 px-8">
      <Card>
        <CardHeader>
          <CardTitle>Paste</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCodeEditor code={code} setCode={setCode} />
        </CardContent>
      </Card>
    </main>
  );
}
