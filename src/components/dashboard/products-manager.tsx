"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Package,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatIDR } from "@/lib/utils";
import { addProduct, deleteProduct } from "@/app/dashboard/products/actions";
import type { Product } from "@/lib/types";

export function ProductsManager({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
  });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await addProduct({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        description: form.description,
        imageUrl: form.imageUrl,
      });
      if (res.ok) {
        toast.success("Produk ditambahkan.");
        setModalOpen(false);
        setForm({ name: "", price: "", stock: "", description: "", imageUrl: "" });
      } else {
        toast.error(res.error ?? "Gagal menambah produk.");
      }
    });
  }

  function handleDelete(id: string) {
    setPendingId(id);
    startTransition(async () => {
      const res = await deleteProduct(id);
      if (res.ok) toast.success("Produk dihapus.");
      else toast.error(res.error ?? "Gagal menghapus.");
      setPendingId(null);
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="pl-9"
          />
        </div>
        <Button variant="magenta" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title={query ? "Produk tidak ditemukan" : "Belum ada produk"}
          description={
            query
              ? "Coba kata kunci lain."
              : "Tambahkan produk pertamamu untuk mulai berjualan."
          }
          action={
            !query && (
              <Button variant="magenta" onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" /> Tambah Produk
              </Button>
            )
          }
        />
      ) : (
        <Card className="overflow-hidden">
          {/* header row (desktop) */}
          <div className="hidden grid-cols-[1fr_120px_90px_110px_50px] gap-4 border-b border-border bg-secondary/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
            <span>Produk</span>
            <span>Harga</span>
            <span>Stok</span>
            <span>Status</span>
            <span />
          </div>
          <div className="divide-y divide-border">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="grid grid-cols-1 gap-3 px-5 py-3.5 sm:grid-cols-[1fr_120px_90px_110px_50px] sm:items-center sm:gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-muted-foreground">
                        <Package className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                      {p.name}
                      {p.ai_imported && (
                        <Sparkles className="h-3 w-3 shrink-0 text-magenta" />
                      )}
                    </p>
                    {p.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {p.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-sm font-semibold">{formatIDR(p.price)}</div>
                <div className="text-sm text-muted-foreground">{p.stock}</div>
                <div>
                  <Badge
                    variant={p.status === "active" ? "success" : "secondary"}
                    className="capitalize"
                  >
                    {p.status}
                  </Badge>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={isPending && pendingId === p.id}
                  className="justify-self-start rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive sm:justify-self-center"
                  aria-label="Hapus"
                >
                  {isPending && pendingId === p.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Produk"
        description="Isi detail produk baru untuk tokomu."
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Nama produk</Label>
            <Input
              id="p-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Kaos Premium Cotton"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-price">Harga (Rp)</Label>
              <Input
                id="p-price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="99000"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-stock">Stok</Label>
              <Input
                id="p-stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="50"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-img">URL gambar (opsional)</Label>
            <Input
              id="p-img"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-desc">Deskripsi (opsional)</Label>
            <Textarea
              id="p-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Deskripsi produk..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="magenta" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan Produk
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
