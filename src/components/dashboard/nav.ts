import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Produk", href: "/dashboard/products", icon: Package },
  { label: "Pesanan", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];
