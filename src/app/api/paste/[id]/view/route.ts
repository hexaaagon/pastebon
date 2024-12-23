import { createServiceServer } from "@/lib/supabase/service-server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const supabase = createServiceServer();
  const pasteDatabase = await supabase
    .from("paste")
    .select("*")
    .eq("id", (await params).id)
    .single();

  if (pasteDatabase.error)
    return Response.json(
      {
        success: false,
        error: pasteDatabase.error.message,
      },
      {
        status: 400,
      },
    );

  const pasteData = await supabase.storage
    .from("paste")
    .download(pasteDatabase.data.path);

  if (pasteData.error) {
    return Response.json(
      {
        success: false,
        error: "No file found",
      },
      {
        status: 404,
      },
    );
  }

  const paste = await pasteData.data.text();

  return Response.json({
    success: true,
    data: {
      paste,
    },
  });
}
