"use client";

import { Search, ShoppingBag, Star } from "lucide-react";
import { formatIDR } from "@/lib/utils";
import type { DraftProduct } from "@/components/onboarding/types";

interface StorePreviewProps {
  name: string;
  description: string;
  logoUrl: string;
  brandColor: string;
  products: DraftProduct[];
}

/** A compact, live preview of the seller's storefront (Aurora template). */
export function StorePreview({
  name,
  description,
  logoUrl,
  brandColor,
  products,
}: StorePreviewProps) {
  const display = products.slice(0, 4);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: brandColor }}
      >
        <div className="flex items-center gap-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              className="h-7 w-7 rounded-full object-cover ring-2 ring-white/40"
            />
          ) : (
            <div className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-xs font-bold text-white">
              {(name || "T").charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-bold text-white">
            {name || "Nama Toko"}
          </span>
        </div>
        <ShoppingBag className="h-4 w-4 text-white/90" />
      </div>

      {/* Hero */}
      <div className="relative px-4 py-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundColor: brandColor }}
        />
        <p
          className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: brandColor }}
        >
          Selamat datang
        </p>
        <h3 className="mt-0.5 text-base font-extrabold leading-tight text-gray-900">
          {name || "Nama Toko"}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
          {description || "Deskripsi singkat tokomu akan tampil di sini."}
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5">
          <Search className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[11px] text-gray-400">Cari produk...</span>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
        {display.length === 0 && (
          <div className="col-span-2 rounded-lg border border-dashed border-gray-200 py-8 text-center text-[11px] text-gray-400">
            Produkmu akan tampil di sini
          </div>
        )}
        {display.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-lg border border-gray-100 bg-white"
          >
            <div className="aspect-square overflow-hidden bg-gray-100">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="p-2">
              <p className="line-clamp-1 text-[11px] font-semibold text-gray-800">
                {p.name}
              </p>
              <p
                className="mt-0.5 text-xs font-bold"
                style={{ color: brandColor }}
              >
                {formatIDR(p.price)}
              </p>
              <div className="mt-1 flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                <span className="text-[9px] text-gray-400">4.9 · Terjual 120</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
