"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Store, Wand2 } from "lucide-react";
import type { SetupMethod } from "@/components/onboarding/types";

const cards: {
  id: SetupMethod;
  icon: typeof Store;
  title: string;
  desc: string;
  cta: string;
  badge: string;
  accent: boolean;
}[] = [
  {
    id: "import",
    icon: Wand2,
    title: "Import via URL",
    desc: "Punya toko di Shopee, Tokopedia, atau TikTok Shop? Tempel link-nya dan biarkan AI WEBOSS menarik logo, produk, dan harga secara otomatis.",
    cta: "Import dengan AI",
    badge: "Tercepat",
    accent: true,
  },
  {
    id: "manual",
    icon: Store,
    title: "Setup Manual",
    desc: "Mulai dari nol. Atur nama toko, deskripsi, dan tambahkan produk satu per satu sesuai keinginanmu.",
    cta: "Mulai manual",
    badge: "Fleksibel",
    accent: false,
  },
];

export function StepMethod({
  onSelect,
}: {
  onSelect: (method: SetupMethod) => void;
}) {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-magenta/10 px-3 py-1 text-xs font-semibold text-magenta">
          <Sparkles className="h-3.5 w-3.5" /> Langkah 1 dari 4
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
          Bagaimana kamu mau memulai?
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pilih cara tercepat untuk membangun tokomu di WEBOSS.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2">
        {cards.map((c, i) => (
          <motion.button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className={`group relative overflow-hidden rounded-2xl border bg-card p-7 text-left shadow-sm transition-shadow hover:shadow-xl ${
              c.accent
                ? "border-magenta/40 ring-1 ring-magenta/10"
                : "border-border"
            }`}
          >
            {c.accent && (
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-magenta/10 blur-2xl transition group-hover:bg-magenta/20" />
            )}
            <div className="relative flex items-start justify-between">
              <span
                className={`grid h-14 w-14 place-items-center rounded-xl ${
                  c.accent
                    ? "bg-magenta text-magenta-foreground shadow-sm shadow-magenta/30"
                    : "bg-secondary text-foreground"
                }`}
              >
                <c.icon className="h-7 w-7" />
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  c.accent
                    ? "bg-magenta/10 text-magenta"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {c.badge}
              </span>
            </div>
            <h3 className="relative mt-6 text-xl font-bold">{c.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
              {c.desc}
            </p>
            <span
              className={`relative mt-6 inline-flex items-center gap-2 text-sm font-semibold ${
                c.accent ? "text-magenta" : "text-foreground"
              }`}
            >
              {c.cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
