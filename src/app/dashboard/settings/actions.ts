"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function updateStore(input: {
  name: string;
  description: string;
  logoUrl: string;
  brandColor: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };

  if (!input.name.trim()) {
    return { ok: false, error: "Nama toko wajib diisi." };
  }

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!store) return { ok: false, error: "Toko tidak ditemukan." };

  const { error } = await supabase
    .from("stores")
    .update({
      name: input.name,
      description: input.description || null,
      logo_url: input.logoUrl || null,
      brand_color: input.brandColor,
    })
    .eq("id", store.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
