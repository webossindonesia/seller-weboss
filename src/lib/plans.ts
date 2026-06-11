import type { PlanId } from "@/lib/types";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  tagline: string;
  highlight: boolean;
  features: string[];
  domainNote: string;
}

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 75000,
    tagline: "Cocok untuk mulai jualan online.",
    highlight: false,
    domainNote: "Subdomain .weboss.com",
    features: [
      "Subdomain gratis tokomu.weboss.com",
      "Produk tanpa batas",
      "Template storefront premium",
      "Order via WhatsApp & checkout",
      "Dashboard analitik dasar",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 125000,
    tagline: "Untuk brand yang siap naik kelas.",
    highlight: true,
    domainNote: "Custom domain milikmu sendiri",
    features: [
      "Semua fitur Basic",
      "Custom domain (tokomu.com)",
      "Analitik lanjutan & laporan",
      "Hapus branding WEBOSS",
      "Prioritas support 24/7",
    ],
  },
];

export function getPlan(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
