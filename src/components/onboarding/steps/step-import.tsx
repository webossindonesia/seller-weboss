"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Globe,
  ImageIcon,
  Loader2,
  Package,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockExtractStore, detectPlatform } from "@/lib/mock-import";
import type { ExtractedStore } from "@/lib/types";

const PHASES = [
  { icon: Globe, label: "Mengakses halaman toko" },
  { icon: ImageIcon, label: "Mengekstrak logo & branding" },
  { icon: Package, label: "Menganalisis daftar produk & harga" },
  { icon: Sparkles, label: "Menyusun katalog tokomu" },
];

export function StepImport({
  initialUrl,
  onExtracted,
  onBack,
}: {
  initialUrl: string;
  onExtracted: (data: ExtractedStore, url: string) => void;
  onBack: () => void;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const timers = PHASES.map((_, i) =>
      setTimeout(() => setPhase(i), i * 650),
    );
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Masukkan URL toko terlebih dahulu.");
      return;
    }
    setLoading(true);
    setPhase(0);
    try {
      const data = await mockExtractStore(url);
      toast.success(`Berhasil mengekstrak ${data.products.length} produk!`);
      onExtracted(data, url);
    } catch {
      toast.error("Gagal mengekstrak data. Coba lagi.");
      setLoading(false);
    }
  }

  const platform = url ? detectPlatform(url) : null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-magenta/10 px-3 py-1 text-xs font-semibold text-magenta">
          <Sparkles className="h-3.5 w-3.5" /> Langkah 2 dari 4
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
          Import toko dengan AI
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tempel link tokomu dan biarkan AI WEBOSS bekerja.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!loading ? (
          <motion.form
            key="form"
            onSubmit={handleImport}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <label className="text-sm font-medium" htmlFor="store-url">
              URL toko / produk
            </label>
            <div className="relative mt-2">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="store-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://shopee.co.id/namatoko"
                className="h-12 pl-9"
                autoFocus
              />
            </div>

            {platform && (
              <p className="mt-2 text-xs text-muted-foreground">
                Terdeteksi:{" "}
                <span className="font-semibold text-foreground">{platform}</span>
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-1.5">
              {["Shopee", "Tokopedia", "TikTok Shop", "Lazada"].map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {p}
                </span>
              ))}
            </div>

            <Button
              type="submit"
              variant="magenta"
              size="lg"
              className="mt-6 w-full"
            >
              <Wand2 className="h-4 w-4" />
              Ekstrak data toko
            </Button>

            <button
              type="button"
              onClick={onBack}
              className="mt-3 w-full text-center text-sm text-muted-foreground transition hover:text-foreground"
            >
              ← Pilih metode lain
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative grid h-20 w-20 place-items-center">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-magenta/20"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-magenta text-magenta-foreground shadow-lg shadow-magenta/30">
                  <Wand2 className="h-7 w-7" />
                </div>
              </div>
              <h3 className="mt-5 text-lg font-bold">
                AI sedang menganalisis tokomu
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ini hanya butuh beberapa detik...
              </p>
            </div>

            <div className="mt-8 space-y-1">
              {PHASES.map((p, i) => {
                const done = i < phase;
                const active = i === phase;
                return (
                  <div
                    key={p.label}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      active ? "bg-magenta/5" : ""
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors ${
                        done
                          ? "bg-success/15 text-success"
                          : active
                            ? "bg-magenta text-magenta-foreground"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <Check className="h-4 w-4" />
                      ) : active ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <p.icon className="h-4 w-4" />
                      )}
                    </span>
                    <span
                      className={`text-sm transition-colors ${
                        done || active
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {p.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ArrowRight className="h-3 w-3" />
          Data hasil ekstraksi bisa kamu review & edit di langkah berikutnya.
        </p>
      )}
    </div>
  );
}
