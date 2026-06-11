"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NAV_ITEMS } from "@/components/dashboard/nav";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PlanId } from "@/lib/types";

interface SidebarProps {
  storeName: string;
  storeUrl: string;
  plan: PlanId;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({
  storeName,
  storeUrl,
  plan,
  open,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <span className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-magenta shadow-sm shadow-magenta/30">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
                <path
                  d="M3 5l3 14 4-10 4 10 3-14"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white">
              WE<span className="text-magenta">BOSS</span>
            </span>
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-sidebar-foreground/70 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Store card */}
        <div className="mx-3 mb-2 rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-magenta/20 text-sm font-bold text-white">
              {storeName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {storeName}
              </p>
              <Badge variant="soft" className="mt-0.5 capitalize">
                <Sparkles className="h-2.5 w-2.5" /> {plan}
              </Badge>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-magenta text-magenta-foreground shadow-sm shadow-magenta/30"
                    : "text-sidebar-foreground/75 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <a
            href={storeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-white/5 hover:text-white"
          >
            Lihat Storefront
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </aside>
    </>
  );
}
