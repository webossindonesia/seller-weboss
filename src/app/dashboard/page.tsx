import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  DollarSign,
  Eye,
  Package,
  Plus,
  Rocket,
  ShoppingCart,
  Sparkles,
  Store as StoreIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/utils";
import type { Product } from "@/lib/types";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: store } = await supabase
    .from("stores")
    .select("id, name, subdomain, created_at")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store!.id)
    .order("sort_order", { ascending: true });

  const productList = (products ?? []) as Product[];
  const inventoryValue = productList.reduce(
    (sum, p) => sum + Number(p.price) * p.stock,
    0,
  );

  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    "Seller";

  return (
    <div>
      <PageHeader
        title={`Halo, ${firstName} 👋`}
        subtitle="Berikut ringkasan performa tokomu hari ini."
        action={
          <Button asChild variant="magenta">
            <Link href="/dashboard/products">
              <Plus className="h-4 w-4" /> Tambah Produk
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pendapatan (bulan ini)"
          value={formatIDR(0)}
          icon={DollarSign}
          delta={0}
          hint="Mulai jualan untuk melihat data"
        />
        <StatCard label="Pesanan" value="0" icon={ShoppingCart} delta={0} />
        <StatCard
          label="Total Produk"
          value={String(productList.length)}
          icon={Package}
        />
        <StatCard
          label="Kunjungan Toko"
          value="0"
          icon={Eye}
          hint="Bagikan link tokomu"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent products */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Produk Terbaru</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/products">
                Lihat semua <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {productList.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Belum ada produk.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {productList.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                      {p.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-muted-foreground">
                          <Package className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Stok {p.stock}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatIDR(p.price)}</p>
                      {p.ai_imported && (
                        <Badge variant="soft" className="mt-0.5">
                          <Sparkles className="h-2.5 w-2.5" /> AI
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side column */}
        <div className="space-y-6">
          <Card className="relative overflow-hidden border-magenta/30 bg-navy text-navy-foreground">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-magenta/30 blur-2xl" />
            <CardContent className="relative p-6">
              <Rocket className="h-7 w-7 text-magenta" />
              <h3 className="mt-3 font-bold">Tokomu sudah live!</h3>
              <p className="mt-1 text-sm text-white/70">
                Bagikan link tokomu dan mulai terima pesanan pertama.
              </p>
              <div className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium">
                {store?.subdomain ?? "toko"}.weboss.com
              </div>
              <Button asChild variant="magenta" className="mt-4 w-full">
                <a
                  href={`https://${store?.subdomain ?? "toko"}.weboss.com`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <StoreIcon className="h-4 w-4" /> Buka Storefront
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nilai Inventaris</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-extrabold">
                {formatIDR(inventoryValue)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Dari {productList.length} produk aktif
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
