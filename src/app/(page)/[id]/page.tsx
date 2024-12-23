"use client";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewCodeEditor } from "@/components/view-code-editor";

import useSWR from "swr";
import fetcher from "@/lib/fetch";

export default function ViewCode() {
  const params = useParams<{ id: string }>();

  const { data, isLoading } = useSWR<
    {
      success: true;
      data: {
        paste: string;
        language: string;
      };
    },
    { success: false; error: any }
  >(`/api/paste/${params.id}/view`, fetcher);

  return (
    <main className="p-6 px-8">
      <Card>
        <CardHeader>
          <CardTitle>Paste</CardTitle>
        </CardHeader>
        <CardContent>
          <ViewCodeEditor
            language={isLoading ? "plaintext" : data!.data.language}
            code={isLoading ? "Loading..." : data!.data.paste}
          />
        </CardContent>
      </Card>
    </main>
  );
}
