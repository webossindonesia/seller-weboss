"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Layout, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/templates";
import { StorePreview } from "@/components/onboarding/store-preview";
import type { DraftProduct, OnboardingState } from "@/components/onboarding/types";

const PRESET_COLORS = [
  "#d6266f", // magenta (brand)
  "#7c3aed", // violet
  "#2563eb", // blue
  "#0d9488", // teal
  "#16a34a", // green
  "#ea580c", // orange
  "#dc2626", // red
  "#1e293b", // slate
];

interface StepTemplateProps {
  store: OnboardingState["store"];
  products: DraftProduct[];
  onStoreChange: (partial: Partial<OnboardingState["store"]>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepTemplate({
  store,
  products,
  onStoreChange,
  onNext,
  onBack,
}: StepTemplateProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-magenta/10 px-3 py-1 text-xs font-semibold text-magenta">
          <Sparkles className="h-3.5 w-3.5" /> Langkah 3 dari 4
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
          Pilih tampilan tokomu
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pilih template dan warna brand. Preview langsung update.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Controls */}
        <div className="space-y-6">
          {/* Templates */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Layout className="h-4 w-4 text-magenta" />
              <h2 className="font-bold">Template</h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {TEMPLATES.map((t) => {
                const selected = store.templateId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!t.available}
                    onClick={() =>
                      t.available && onStoreChange({ templateId: t.id })
                    }
                    className={`relative rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-magenta ring-2 ring-magenta/20"
                        : "border-border hover:border-magenta/40"
                    } ${!t.available ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    {selected && (
                      <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-magenta text-magenta-foreground">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <div
                      className="mb-3 h-16 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${store.brandColor}, ${store.brandColor}40)`,
                      }}
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{t.name}</span>
                      {t.badge && (
                        <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">
                      {t.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color picker */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-magenta" />
              <h2 className="font-bold">Warna brand</h2>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {PRESET_COLORS.map((c) => {
                const selected =
                  store.brandColor.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onStoreChange({ brandColor: c })}
                    className={`grid h-9 w-9 place-items-center rounded-full transition ${
                      selected ? "ring-2 ring-offset-2 ring-offset-card" : ""
                    }`}
                    style={{ backgroundColor: c, boxShadow: `0 0 0 1px ${c}33` }}
                    aria-label={`Warna ${c}`}
                  >
                    {selected && <Check className="h-4 w-4 text-white" />}
                  </button>
                );
              })}

              <label className="relative ml-1 flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition hover:text-foreground">
                <span
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: store.brandColor }}
                />
                Kustom
                <input
                  type="color"
                  value={store.brandColor}
                  onChange={(e) => onStoreChange({ brandColor: e.target.value })}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Warna ini dipakai untuk tombol, header, dan aksen di storefront-mu.
            </p>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Preview Storefront
          </p>
          <motion.div
            key={store.templateId + store.brandColor}
            initial={{ opacity: 0.6, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <StorePreview
              name={store.name}
              description={store.description}
              logoUrl={store.logoUrl}
              brandColor={store.brandColor}
              products={products}
            />
          </motion.div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
        <Button variant="magenta" size="lg" onClick={onNext}>
          Lanjut <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
