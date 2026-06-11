import type { Metadata } from "next";
import { Clock, Package, ShoppingCart, Truck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Pesanan" };

const STAGES = [
  { label: "Menunggu Bayar", value: 0, icon: Clock },
  { label: "Diproses", value: 0, icon: Package },
  { label: "Dikirim", value: 0, icon: Truck },
  { label: "Selesai", value: 0, icon: ShoppingCart },
];

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="Pesanan"
        subtitle="Pantau dan kelola semua pesanan masuk."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xl font-extrabold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <EmptyState
        icon={ShoppingCart}
        title="Belum ada pesanan"
        description="Pesanan dari pelangganmu akan tampil di sini. Bagikan link tokomu untuk mulai menerima pesanan pertama."
      />
    </div>
  );
}
