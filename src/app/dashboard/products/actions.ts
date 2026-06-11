"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface ActionResult {
  ok: boolean;
  error?: string;
}

async function getOwnerStore() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, store: null };

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return { supabase, user, store };
}

export async function addProduct(input: {
  name: string;
  price: number;
  stock: number;
  description?: string;
  imageUrl?: string;
}): Promise<ActionResult> {
  const { supabase, store } = await getOwnerStore();
  if (!store) return { ok: false, error: "Toko tidak ditemukan." };

  if (!input.name.trim() || input.price <= 0) {
    return { ok: false, error: "Nama dan harga produk wajib diisi." };
  }

  const { error } = await supabase.from("products").insert({
    store_id: store.id,
    name: input.name,
    price: input.price,
    stock: input.stock,
    description: input.description || null,
    image_url: input.imageUrl || null,
    status: "active",
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const { supabase, store } = await getOwnerStore();
  if (!store) return { ok: false, error: "Toko tidak ditemukan." };

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("store_id", store.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateProductStatus(
  id: string,
  status: "active" | "draft" | "archived",
): Promise<ActionResult> {
  const { supabase, store } = await getOwnerStore();
  if (!store) return { ok: false, error: "Toko tidak ditemukan." };

  const { error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", id)
    .eq("store_id", store.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/products");
  return { ok: true };
}
