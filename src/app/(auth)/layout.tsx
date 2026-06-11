import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ShieldCheck, Sparkles, Store, TrendingUp } from "lucide-react";

const highlights = [
  { icon: Sparkles, text: "Import toko dari marketplace dengan AI" },
  { icon: Store, text: "Storefront premium siap pakai" },
  { icon: TrendingUp, text: "Dashboard penjualan real-time" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand / marketing panel */}
      <div className="relative hidden overflow-hidden bg-navy text-navy-foreground lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-magenta/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-magenta/20 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-[0.07]" />

        <div className="relative z-10 flex h-full flex-col p-12">
          <Logo light />

          <div className="my-auto max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              <ShieldCheck className="h-3.5 w-3.5 text-magenta" />
              Platform Seller Terpercaya
            </span>
            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-tight">
              Toko online profesional, <span className="text-magenta">tanpa ribet.</span>
            </h1>
            <p className="mt-4 text-pretty text-white/70">
              Bangun storefront-mu sendiri dalam hitungan menit. Import dari
              Shopee, Tokopedia, atau mulai dari nol — WEBOSS yang urus sisanya.
            </p>

            <ul className="mt-8 space-y-3">
              {highlights.map((h) => (
                <li key={h.text} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10">
                    <h.icon className="h-4 w-4 text-magenta" />
                  </span>
                  {h.text}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 text-xs text-white/50">
            © {new Date().getFullYear()} WEBOSS. Semua hak dilindungi.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="px-6 pb-6 text-center text-xs text-muted-foreground lg:hidden">
          <Link href="/" className="hover:text-foreground">
            ← Kembali ke beranda
          </Link>
        </p>
      </div>
    </div>
  );
}
