import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { PlanId } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: store } = await supabase
    .from("stores")
    .select("id, name, subdomain")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  // No store yet -> finish onboarding first.
  if (!store) redirect("/onboarding");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("store_id", store.id)
    .maybeSingle();

  const fullName =
    profile?.full_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    "Seller";
  const email = profile?.email || user.email || "";
  const plan = (subscription?.plan as PlanId) ?? "basic";
  const storeUrl = `https://${store.subdomain ?? "toko"}.weboss.com`;

  return (
    <DashboardShell
      fullName={fullName}
      email={email}
      storeName={store.name}
      storeUrl={storeUrl}
      plan={plan}
    >
      {children}
    </DashboardShell>
  );
}
