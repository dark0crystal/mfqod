"use client";

import { Link, usePathname } from "@/i18n/routing";
import { DASHBOARD_ROLES } from "@/lib/dashboard";

function getRoleSegmentFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && DASHBOARD_ROLES.includes(first as any)) {
    return first;
  }
  return "techadmin";
}

export default function DashboardNavBarManageLink() {
  const pathname = usePathname();
  const roleSegment = getRoleSegmentFromPathname(pathname);
  return (
    <Link
      href={`/${roleSegment}/manage-users`}
      className="bg-white border border-primary/30 p-3 rounded-2xl text-black hover:bg-primary-light text-sm my-2 cursor-pointer whitespace-nowrap block text-center"
    >
      Manage Users
    </Link>
  );
}
