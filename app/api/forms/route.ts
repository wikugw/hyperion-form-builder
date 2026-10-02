import { NextResponse } from "next/server";
import { formSchemaZ } from "@/lib/form-validation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { Json } from "@/lib/supabase/database.types";

export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from("forms")
    .select("id, title, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal memuat daftar form" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body bukan JSON" }, { status: 400 });
  }

  const parsed = formSchemaZ.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Schema tidak valid", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const form = parsed.data;
  const { data, error } = await getSupabaseAdmin()
    .from("forms")
    .upsert({
        id: form.id,
        title: form.title,
        schema: form as unknown as Json,
        updated_at: new Date().toISOString(),
    })
    .select("id, title, updated_at")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menyimpan form" }, { status: 500 });
  }
  return NextResponse.json(data);
}