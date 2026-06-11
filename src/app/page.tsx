import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  Globe,
  Palette,
  ShieldCheck,
  Sparkles,
  Store,
  Wand2,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";
import { formatIDR } from "@/lib/utils";

const features = [
  {
    icon: Wand2,
    title: "Import AI dari Marketplace",
    desc: "Tempel link Shopee/Tokopedia, AI tarik logo, produk, dan harga otomatis.",
  },
  {
    icon: Palette,
    title: "Storefront Premium",
    desc: "Template modern yang bisa disesuaikan dengan warna brand-mu.",
  },
  {
    icon: Globe,
    title: "Domain Sendiri",
    desc: "Subdomain .weboss.com gratis atau custom domain di paket Pro.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Lengkap",
    desc: "Kelola produk, pesanan, dan pantau performa dalam satu tempat.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild variant="magenta">
              <Link href="/signup">Buat Toko Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-magenta/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-magenta/20 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            <Sparkles className="h-3.5 w-3.5 text-magenta" />
            Bangun toko online dengan AI
          </span>
          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-tight md:text-6xl">
            Toko online profesional, <br />
            <span className="text-magenta">siap dalam hitungan menit.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-white/70 md:text-lg">
            Import tokomu dari marketplace atau mulai dari nol. WEBOSS bantu kamu
            punya storefront sendiri, lengkap dengan dashboard penjualan.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="magenta" size="lg">
              <Link href="/signup">
                Mulai Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">Sudah punya akun</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-magenta" /> Tanpa kartu kredit
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-magenta" /> Setup 5 menit
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-magenta">
            Fitur
          </span>
          <h2 className="mt-1 text-3xl font-extrabold">
            Semua yang kamu butuh untuk jualan online
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-magenta/10 text-magenta">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-magenta">
              Harga
            </span>
            <h2 className="mt-1 text-3xl font-extrabold">
              Harga sederhana, tanpa biaya tersembunyi
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative overflow-hidden rounded-2xl border p-7 ${
                  plan.highlight
                    ? "border-magenta/40 bg-navy text-navy-foreground shadow-xl"
                    : "border-border bg-card"
                }`}
              >
                {plan.highlight && (
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-magenta/30 blur-2xl" />
                )}
                <div className="relative flex items-center justify-between">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  {plan.highlight && (
                    <span className="rounded-full bg-magenta px-2.5 py-1 text-xs font-bold text-magenta-foreground">
                      Populer
                    </span>
                  )}
                </div>
                <div className="relative mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold">
                    {formatIDR(plan.price)}
                  </span>
                  <span
                    className={`mb-1.5 text-sm ${plan.highlight ? "text-white/60" : "text-muted-foreground"}`}
                  >
                    /bulan
                  </span>
                </div>
                <ul className="relative mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? "text-magenta" : "text-success"}`}
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
                <Button
                  asChild
                  variant={plan.highlight ? "magenta" : "outline"}
                  className="relative mt-7 w-full"
                >
                  <Link href="/signup">Pilih {plan.name}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <Store className="mx-auto h-10 w-10 text-magenta" />
        <h2 className="mt-6 text-3xl font-extrabold md:text-4xl">
          Siap punya toko online sendiri?
        </h2>
        <p className="mt-3 text-muted-foreground">
          Gabung dengan ribuan seller yang sudah jualan di WEBOSS.
        </p>
        <Button asChild variant="magenta" size="lg" className="mt-8">
          <Link href="/signup">
            Buat Toko Sekarang <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WEBOSS. Semua hak dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
