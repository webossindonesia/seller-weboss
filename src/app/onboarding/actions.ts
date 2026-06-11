"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { getPlan } from "@/lib/plans";
import type { CompleteOnboardingPayload } from "@/components/onboarding/types";

interface ActionResult {
  ok: boolean;
  error?: string;
  storeId?: string;
}

function randomSuffix(len = 4): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + len);
}

export async function completeOnboarding(
  payload: CompleteOnboardingPayload,
): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "Sesi tidak valid. Silakan masuk lagi." };
  }

  // Build a unique slug + subdomain.
  const base = slugify(payload.store.name) || "toko";
  const desiredSub = slugify(payload.store.subdomain) || base;
  const slug = `${base}-${randomSuffix()}`;
  const subdomain = `${desiredSub}-${randomSuffix()}`;

  // 1) Create the store.
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .insert({
      owner_id: user.id,
      name: payload.store.name,
      slug,
      description: payload.store.description,
      logo_url: payload.store.logoUrl || null,
      brand_color: payload.store.brandColor,
      template_id: payload.store.templateId,
      setup_method: payload.setupMethod,
      import_source_url: payload.importSourceUrl,
      subdomain,
      status: "active",
      onboarding_step: "done",
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (storeError || !store) {
    const message = storeError?.message ?? "Gagal membuat toko.";
    if (message.includes("schema cache") || message.includes("Could not find the table")) {
      return {
        ok: false,
        error:
          "Database belum disetup. Jalankan `npm run db:push` setelah mengisi SUPABASE_DB_PASSWORD di .env.local.",
      };
    }
    return { ok: false, error: message };
  }

  // 2) Insert products (best effort).
  if (payload.products.length > 0) {
    const rows = payload.products.map((p, i) => ({
      store_id: store.id,
      name: p.name,
      description: p.description || null,
      price: p.price,
      compare_at_price: p.compareAtPrice ?? null,
      image_url: p.imageUrl || null,
      stock: p.stock,
      sort_order: i,
      ai_imported: p.aiImported,
      status: "active" as const,
    }));

    const { error: productError } = await supabase.from("products").insert(rows);
    if (productError) {
      return { ok: false, error: productError.message };
    }
  }

  // 3) Create the subscription.
  const plan = getPlan(payload.plan);
  const { error: subError } = await supabase.from("subscriptions").insert({
    store_id: store.id,
    owner_id: user.id,
    plan: plan.id,
    price: plan.price,
    status: "active",
  });

  if (subError) {
    return { ok: false, error: subError.message };
  }

  // 4) Mark onboarding complete on the profile.
  await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);

  return { ok: true, storeId: store.id };
}
