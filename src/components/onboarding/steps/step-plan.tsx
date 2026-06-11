"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Crown,
  Globe,
  Loader2,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";
import { formatIDR } from "@/lib/utils";
import type { PlanId } from "@/lib/types";

interface StepPlanProps {
  selected: PlanId;
  onSelect: (plan: PlanId) => void;
  onFinish: () => void;
  onBack: () => void;
  submitting: boolean;
}

export function StepPlan({
  selected,
  onSelect,
  onFinish,
  onBack,
  submitting,
}: StepPlanProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-magenta/10 px-3 py-1 text-xs font-semibold text-magenta">
          <Sparkles className="h-3.5 w-3.5" /> Langkah 4 dari 4
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
          Pilih paket tokomu
        </h1>
        <p className="mt-2 text-muted-foreground">
          Mulai jualan hari ini. Ganti paket kapan saja.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {PLANS.map((plan, i) => {
          const isSelected = selected === plan.id;
          const Icon = plan.id === "pro" ? Crown : Rocket;
          return (
            <motion.button
              key={plan.id}
              type="button"
              onClick={() => onSelect(plan.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              whileHover={{ y: -3 }}
              className={`relative overflow-hidden rounded-2xl border p-6 text-left transition-shadow ${
                isSelected
                  ? "border-magenta ring-2 ring-magenta/20 shadow-xl"
                  : "border-border shadow-sm hover:shadow-md"
              } ${plan.highlight ? "bg-navy text-navy-foreground" : "bg-card"}`}
            >
              {plan.highlight && (
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-magenta/30 blur-2xl" />
              )}

              <div className="relative flex items-center justify-between">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl ${
                    plan.highlight
                      ? "bg-magenta text-magenta-foreground"
                      : "bg-magenta/10 text-magenta"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {plan.highlight && (
                  <span className="rounded-full bg-magenta px-2.5 py-1 text-xs font-bold text-magenta-foreground">
                    Populer
                  </span>
                )}
                {isSelected && !plan.highlight && (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-magenta text-magenta-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              <h3 className="relative mt-5 text-lg font-bold">{plan.name}</h3>
              <p
                className={`relative text-sm ${
                  plan.highlight ? "text-white/70" : "text-muted-foreground"
                }`}
              >
                {plan.tagline}
              </p>

              <div className="relative mt-4 flex items-end gap-1">
                <span className="text-3xl font-extrabold">
                  {formatIDR(plan.price)}
                </span>
                <span
                  className={`mb-1 text-sm ${
                    plan.highlight ? "text-white/60" : "text-muted-foreground"
                  }`}
                >
                  /bulan
                </span>
              </div>

              <div
                className={`relative mt-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                  plan.highlight
                    ? "bg-white/10 text-white"
                    : "bg-secondary text-foreground"
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                {plan.domainNote}
              </div>

              <ul className="relative mt-5 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        plan.highlight ? "text-magenta" : "text-success"
                      }`}
                    />
                    <span
                      className={
                        plan.highlight ? "text-white/85" : "text-foreground"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {isSelected && plan.highlight && (
                <span className="relative mt-5 flex items-center justify-center gap-1.5 rounded-lg bg-magenta py-2 text-sm font-semibold text-magenta-foreground">
                  <Check className="h-4 w-4" /> Terpilih
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} disabled={submitting}>
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
        <Button
          variant="magenta"
          size="lg"
          onClick={onFinish}
          disabled={submitting}
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Menyiapkan toko..." : "Selesai & buka dashboard"}
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Dengan melanjutkan kamu menyetujui Syarat & Ketentuan WEBOSS.
      </p>
    </div>
  );
}
