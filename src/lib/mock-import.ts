import type { ExtractedStore } from "@/lib/types";

/**
 * Detect the marketplace from a URL so the mocked extraction feels real.
 */
export function detectPlatform(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("shopee")) return "Shopee";
  if (u.includes("tokopedia")) return "Tokopedia";
  if (u.includes("tiktok")) return "TikTok Shop";
  if (u.includes("lazada")) return "Lazada";
  if (u.includes("instagram")) return "Instagram Shop";
  if (u.includes("bukalapak")) return "Bukalapak";
  return "Marketplace";
}

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
];

/**
 * MOCKED AI backend. Pretends to scrape a marketplace URL and returns
 * pre-filled store + product data. Swap this out for a real extraction
 * service later — the UI already handles the returned shape.
 */
export async function mockExtractStore(url: string): Promise<ExtractedStore> {
  // Simulate network + AI processing latency.
  await new Promise((r) => setTimeout(r, 2600));

  const platform = detectPlatform(url);

  return {
    name: "Nusantara Active",
    description:
      "Brand sportswear lokal asli Indonesia. Sepatu, apparel, dan aksesoris olahraga berkualitas premium dengan harga terjangkau. Dipercaya 12.000+ pelanggan.",
    logo_url:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=200&q=80",
    brand_color: "#d6266f",
    source_platform: platform,
    products: [
      {
        name: "Sepatu Lari Velocity Pro",
        description:
          "Sepatu lari ringan dengan bantalan responsif untuk performa maksimal di setiap langkah.",
        price: 459000,
        compare_at_price: 599000,
        image_url: PRODUCT_IMAGES[0],
        stock: 48,
      },
      {
        name: "Jaket Training AeroFlex",
        description:
          "Jaket olahraga breathable, anti-air ringan, cocok untuk latihan indoor maupun outdoor.",
        price: 289000,
        compare_at_price: 350000,
        image_url: PRODUCT_IMAGES[1],
        stock: 32,
      },
      {
        name: "Tas Gym Daypack 25L",
        description:
          "Tas serbaguna dengan kompartemen sepatu terpisah dan slot botol minum.",
        price: 215000,
        image_url: PRODUCT_IMAGES[2],
        stock: 60,
      },
      {
        name: "Botol Minum Hydro 750ml",
        description:
          "Botol stainless steel menjaga suhu hingga 12 jam. BPA free.",
        price: 99000,
        compare_at_price: 135000,
        image_url: PRODUCT_IMAGES[3],
        stock: 120,
      },
      {
        name: "Kaos Performance DryFit",
        description:
          "Kaos olahraga cepat kering dengan teknologi penyerap keringat.",
        price: 149000,
        image_url: PRODUCT_IMAGES[4],
        stock: 85,
      },
      {
        name: "Resistance Band Set",
        description:
          "Set 5 band latihan dengan tingkat resistansi berbeda, lengkap dengan pouch.",
        price: 125000,
        compare_at_price: 175000,
        image_url: PRODUCT_IMAGES[5],
        stock: 40,
      },
    ],
  };
}
