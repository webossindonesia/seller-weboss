import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { StoreSettingsForm } from "@/components/dashboard/store-settings-form";
import type { PlanId, Store } from "@/lib/types";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("store_id", store!.id)
    .maybeSingle();

  const plan = (subscription?.plan as PlanId) ?? "basic";

  return (
    <div>
      <PageHeader
        title="Pengaturan Toko"
        subtitle="Atur profil, branding, domain, dan paket tokomu."
      />
      <StoreSettingsForm store={store as Store} plan={plan} />
    </div>
  );
}
