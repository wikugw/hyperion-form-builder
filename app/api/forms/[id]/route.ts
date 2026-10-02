import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id: string }> };

async function parseId(ctx: Ctx) {
  const { id } = await ctx.params;
  const parsed = z.string().uuid().safeParse(id);
  return parsed.success ? parsed.data : null;
}

export async function GET(_req: Request, ctx: Ctx) {
  const id = await parseId(ctx);
  if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const { data, error } = await getSupabaseAdmin()
    .from("forms")
    .select("schema")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal memuat form" }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Form tidak ditemukan" }, { status: 404 });

  return NextResponse.json(data.schema);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const id = await parseId(ctx);
  if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const { error } = await getSupabaseAdmin().from("forms").delete().eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus form" }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}