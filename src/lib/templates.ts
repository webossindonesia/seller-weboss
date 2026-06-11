export interface StoreTemplate {
  id: string;
  name: string;
  description: string;
  badge?: string;
  available: boolean;
}

export const TEMPLATES: StoreTemplate[] = [
  {
    id: "aurora",
    name: "Aurora",
    description:
      "Layout modern dengan hero besar, grid produk bersih, dan aksen warna brand.",
    badge: "Default",
    available: true,
  },
  {
    id: "lumen",
    name: "Lumen",
    description: "Tampilan minimalis fokus pada foto produk. Segera hadir.",
    badge: "Soon",
    available: false,
  },
  {
    id: "vertex",
    name: "Vertex",
    description: "Gaya bold untuk brand fashion & lifestyle. Segera hadir.",
    badge: "Soon",
    available: false,
  },
];
