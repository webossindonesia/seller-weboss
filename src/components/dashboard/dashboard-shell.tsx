"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import type { PlanId } from "@/lib/types";

interface DashboardShellProps {
  fullName: string;
  email: string;
  storeName: string;
  storeUrl: string;
  plan: PlanId;
  children: React.ReactNode;
}

export function DashboardShell({
  fullName,
  email,
  storeName,
  storeUrl,
  plan,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <Sidebar
        storeName={storeName}
        storeUrl={storeUrl}
        plan={plan}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          fullName={fullName}
          email={email}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
