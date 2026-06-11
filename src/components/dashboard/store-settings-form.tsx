"use client";

import { useState, useTransition } from "react";
import {
  Check,
  Crown,
  Globe,
  ImageIcon,
  Loader2,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateStore } from "@/app/dashboard/settings/actions";
import { formatIDR } from "@/lib/utils";
import { getPlan } from "@/lib/plans";
import type { PlanId, Store } from "@/lib/types";

const PRESET_COLORS = [
  "#d6266f",
  "#7c3aed",
  "#2563eb",
  "#0d9488",
  "#16a34a",
  "#ea580c",
  "#dc2626",
  "#1e293b",
];

export function StoreSettingsForm({
  store,
  plan,
}: {
  store: Store;
  plan: PlanId;
}) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: store.name,
    description: store.description ?? "",
    logoUrl: store.logo_url ?? "",
    brandColor: store.brand_color,
  });

  const planInfo = getPlan(plan);
  const domain =
    plan === "pro"
      ? store.custom_domain ?? `${store.subdomain ?? "toko"}.weboss.com`
      : `${store.subdomain ?? "toko"}.weboss.com`;

  function handleSave() {
    startTransition(async () => {
      const res = await updateStore(form);
      if (res.ok) toast.success("Pengaturan tersimpan.");
      else toast.error(res.error ?? "Gagal menyimpan.");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Store profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profil Toko</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex gap-5">
              <div className="flex flex-col items-center gap-2">
                <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border bg-secondary">
                  {form.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.logoUrl}
                      alt="Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">Logo</span>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="s-name">Nama toko</Label>
                  <Input
                    id="s-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="s-logo">URL logo</Label>
                  <Input
                    id="s-logo"
                    value={form.logoUrl}
                    onChange={(e) =>
                      setForm({ ...form, logoUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-desc">Deskripsi</Label>
              <Textarea
                id="s-desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Brand color */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-magenta" /> Warna Brand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2.5">
              {PRESET_COLORS.map((c) => {
                const selected =
                  form.brandColor.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, brandColor: c })}
                    className={`grid h-9 w-9 place-items-center rounded-full transition ${
                      selected ? "ring-2 ring-offset-2 ring-offset-card" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    {selected && <Check className="h-4 w-4 text-white" />}
                  </button>
                );
              })}
              <label className="relative ml-1 flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground hover:text-foreground">
                <span
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: form.brandColor }}
                />
                Kustom
                <input
                  type="color"
                  value={form.brandColor}
                  onChange={(e) =>
                    setForm({ ...form, brandColor: e.target.value })
                  }
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="magenta" onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </div>
      </div>

      {/* Sidebar: domain + plan */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-magenta" /> Domain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm font-medium">
              {domain}
            </div>
            {plan === "basic" && (
              <p className="mt-2 text-xs text-muted-foreground">
                Upgrade ke Pro untuk memakai custom domain milikmu.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Crown className="h-4 w-4 text-magenta" /> Paket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold capitalize">
                {planInfo.name}
              </span>
              <Badge variant="soft">Aktif</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatIDR(planInfo.price)}/bulan
            </p>
            {plan === "basic" && (
              <Button variant="outline" className="mt-4 w-full">
                Upgrade ke Pro
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
