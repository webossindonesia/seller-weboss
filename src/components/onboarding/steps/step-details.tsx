"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/utils";
import type { DraftProduct, OnboardingState } from "@/components/onboarding/types";

interface StepDetailsProps {
  store: OnboardingState["store"];
  products: DraftProduct[];
  isImport: boolean;
  sourcePlatform: string | null;
  onStoreChange: (partial: Partial<OnboardingState["store"]>) => void;
  onProductChange: (id: string, partial: Partial<DraftProduct>) => void;
  onAddProduct: () => void;
  onRemoveProduct: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepDetails({
  store,
  products,
  isImport,
  sourcePlatform,
  onStoreChange,
  onProductChange,
  onAddProduct,
  onRemoveProduct,
  onNext,
  onBack,
}: StepDetailsProps) {
  function handleNext() {
    if (!store.name.trim()) {
      toast.error("Nama toko wajib diisi.");
      return;
    }
    if (products.length === 0) {
      toast.error("Tambahkan minimal satu produk.");
      return;
    }
    const invalid = products.find((p) => !p.name.trim() || p.price <= 0);
    if (invalid) {
      toast.error("Setiap produk butuh nama dan harga yang valid.");
      return;
    }
    onNext();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-magenta/10 px-3 py-1 text-xs font-semibold text-magenta">
          <Sparkles className="h-3.5 w-3.5" /> Langkah 2 dari 4
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
          {isImport ? "Review data tokomu" : "Detail toko"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isImport ? (
            <>
              AI berhasil menarik data
              {sourcePlatform ? ` dari ${sourcePlatform}` : ""}. Periksa & sesuaikan
              sebelum lanjut.
            </>
          ) : (
            "Isi informasi toko dan tambahkan produkmu."
          )}
        </p>
      </div>

      {/* Store info */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="font-bold">Informasi Toko</h2>
          {isImport && (
            <Badge variant="soft">
              <Sparkles className="h-3 w-3" /> Diisi AI
            </Badge>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row">
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-border bg-secondary">
              {store.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={store.logoUrl}
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-muted-foreground">
                  <ImageIcon className="h-7 w-7" />
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">Logo Toko</span>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="store-name">Nama toko</Label>
              <Input
                id="store-name"
                value={store.name}
                onChange={(e) => onStoreChange({ name: e.target.value })}
                placeholder="Toko Maju Jaya"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="logo-url">URL logo (opsional)</Label>
              <Input
                id="logo-url"
                value={store.logoUrl}
                onChange={(e) => onStoreChange({ logoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <Label htmlFor="store-desc">Deskripsi toko</Label>
          <Textarea
            id="store-desc"
            value={store.description}
            onChange={(e) => onStoreChange({ description: e.target.value })}
            placeholder="Ceritakan tentang tokomu..."
            rows={3}
          />
        </div>
      </div>

      {/* Products */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold">Produk</h2>
            <Badge variant="secondary">{products.length}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={onAddProduct}>
            <Plus className="h-4 w-4" /> Tambah
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted-foreground">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2.5">
                  <Input
                    value={p.name}
                    onChange={(e) =>
                      onProductChange(p.id, { name: e.target.value })
                    }
                    placeholder="Nama produk"
                    className="h-9 font-medium"
                  />
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    <div>
                      <span className="mb-1 block text-[11px] text-muted-foreground">
                        Harga (Rp)
                      </span>
                      <Input
                        type="number"
                        value={p.price || ""}
                        onChange={(e) =>
                          onProductChange(p.id, {
                            price: Number(e.target.value),
                          })
                        }
                        placeholder="0"
                        className="h-9"
                      />
                    </div>
                    <div>
                      <span className="mb-1 block text-[11px] text-muted-foreground">
                        Harga coret
                      </span>
                      <Input
                        type="number"
                        value={p.compareAtPrice || ""}
                        onChange={(e) =>
                          onProductChange(p.id, {
                            compareAtPrice: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        placeholder="—"
                        className="h-9"
                      />
                    </div>
                    <div>
                      <span className="mb-1 block text-[11px] text-muted-foreground">
                        Stok
                      </span>
                      <Input
                        type="number"
                        value={p.stock || ""}
                        onChange={(e) =>
                          onProductChange(p.id, {
                            stock: Number(e.target.value),
                          })
                        }
                        placeholder="0"
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveProduct(p.id)}
                  className="h-9 w-9 shrink-0 rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Hapus produk"
                >
                  <Trash2 className="mx-auto h-4 w-4" />
                </button>
              </div>
              {p.price > 0 && (
                <p className="mt-2 pl-24 text-xs text-muted-foreground">
                  Tampil sebagai{" "}
                  <span className="font-semibold text-foreground">
                    {formatIDR(p.price)}
                  </span>
                  {p.compareAtPrice ? (
                    <span className="ml-1.5 line-through">
                      {formatIDR(p.compareAtPrice)}
                    </span>
                  ) : null}
                </p>
              )}
            </motion.div>
          ))}

          {products.length === 0 && (
            <button
              type="button"
              onClick={onAddProduct}
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-sm text-muted-foreground transition hover:border-magenta/50 hover:text-foreground"
            >
              <Plus className="h-5 w-5" />
              Tambah produk pertamamu
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
        <Button variant="magenta" size="lg" onClick={handleNext}>
          Lanjut <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
