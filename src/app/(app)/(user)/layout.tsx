import React from "react";
import { AppLayoutShell } from "@/app/(app)/_components/layout-shell";
import { sidebarConfig } from "@/config/sidebar";
import { headers } from "next/headers";

type AppLayoutProps = {
    children: React.ReactNode;
};

export default function UserLayout({ children }: AppLayoutProps) {
    // these are the ids of the sidebar nav items to not included in the sidebar specifically @get ids from the sidebar config
    const sideNavRemoveIds: string[] = [sidebarConfig.navIds.admin];

  const headersList = headers();
  const url = headersList.get("referer") || "";
  const pathname = new URL(url, "http://localhost").pathname;

  const isFullScreenEditor =
    pathname.startsWith("/editor/") &&
    pathname.split("/").filter(Boolean).length === 2;

  if (isFullScreenEditor) return <>{children}</>;
    
    return (
        <AppLayoutShell sideNavRemoveIds={sideNavRemoveIds}>
            {children}
        </AppLayoutShell>
    );
}
