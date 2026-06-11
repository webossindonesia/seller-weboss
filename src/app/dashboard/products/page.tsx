import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProductsManager } from "@/components/dashboard/products-manager";
import type { Product } from "@/lib/types";

export const metadata: Metadata = { title: "Produk" };

export default async function ProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store!.id)
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Produk"
        subtitle="Kelola katalog produk tokomu."
      />
      <ProductsManager products={(products ?? []) as Product[]} />
    </div>
  );
}
