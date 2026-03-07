"use client";

import { Link, usePathname } from "@/i18n/routing";
import { DASHBOARD_ROLES } from "@/lib/dashboard";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import {
  HiHome,
  HiOutlineHome,
  HiDocumentText,
  HiOutlineDocumentText,
  HiTicket,
  HiOutlineTicket,
  HiChat,
  HiOutlineChat,
  HiUsers,
  HiOutlineUsers,
  HiChevronRight,
  HiViewGrid,
  HiOutlineViewGrid,
  HiOfficeBuilding,
  HiOutlineOfficeBuilding,
  HiLogout,
} from "react-icons/hi";
import { signOut } from "next-auth/react";

function getRoleSegmentFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && DASHBOARD_ROLES.includes(first as any)) {
    return first;
  }
  return "basic";
}

type RoleResult = {
  role: string;
  managedPlace: string | null;
  managedOrg: string | null;
  assignedBranches?: { id: string; name: string }[];
};

function NavItem({
  href,
  isActive,
  icon: Icon,
  iconActive: IconActive,
  label,
  badge,
  hasChevron,
  expanded,
  onChevronClick,
  children,
}: {
  href?: string;
  isActive: boolean;
  icon: React.ComponentType<{ className?: string }>;
  iconActive: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string | number;
  hasChevron?: boolean;
  expanded?: boolean;
  onChevronClick?: () => void;
  children?: React.ReactNode;
}) {
  const activeClasses =
    "bg-primary-light border-s-[3px] border-primary text-primary font-semibold";
  const inactiveClasses =
    "text-gray-600 hover:bg-gray-50 border-s-[3px] border-transparent";

  const content = (
    <>
      <span className="flex-shrink-0 w-6 flex justify-center">
        {isActive ? (
          <IconActive className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </span>
      <span className="flex-1 text-sm min-w-0 truncate">{label}</span>
      {badge !== undefined && (
        <span className="flex-shrink-0 bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {hasChevron && (
        <HiChevronRight
          className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        />
      )}
    </>
  );

  const baseClasses =
    "flex items-center gap-3 w-full min-w-0 py-3 px-4 transition-colors " +
    (isActive ? activeClasses : inactiveClasses);

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onChevronClick}
      className={baseClasses + " text-start"}
    >
      {content}
    </button>
  );
}

export default function DashboardSidebar({ result }: { result: RoleResult }) {
  const pathname = usePathname();
  const roleSegment = getRoleSegmentFromPathname(pathname);
  const basePath = `/${roleSegment}`;
  const t = useTranslations("dashboardSidebar");

  const [postsExpanded, setPostsExpanded] = useState(false);
  const [branchesExpanded, setBranchesExpanded] = useState(false);
  const [branches, setBranches] = useState<{ id: string; nameEn: string; country?: { nameEn: string } | null }[]>([]);

  const isDashboardActive =
    pathname === `/${roleSegment}` || pathname === `/${roleSegment}/`;
  const isPostsActive = pathname.includes("/posts");
  const isClaimsActive = pathname.includes("/claims");
  const isTicketsActive = pathname.includes("/tickets");
  const isManageUsersActive = pathname.includes("/manage-users");
  const isManageCountriesActive = pathname.includes("/manage-countries");
  const isManageBranchesActive = pathname.includes("/manage-branches");

  const showPostsNav =
    result.role === "TECHADMIN" ||
    result.role === "ADMIN" ||
    result.role === "VERIFIED";
  const showManageUsers = result.role === "TECHADMIN";
  const showManageBranches =
    result.role === "TECHADMIN" || result.role === "ADMIN";
  const showTicketsNav = result.role === "TECHADMIN" || result.role === "ADMIN";
  const showMyTicketsNav = result.role === "BASIC" || result.role === "VERIFIED";

  // Expand Posts section when on a posts sub-route (e.g. report, posts list)
  useEffect(() => {
    if (isPostsActive) setPostsExpanded(true);
  }, [isPostsActive]);

  // Expand Branches section when on a manage-branches sub-route
  useEffect(() => {
    if (isManageBranchesActive) setBranchesExpanded(true);
  }, [isManageBranchesActive]);

  // Fetch branches for TECHADMIN/ADMIN; VERIFIED uses assignedBranches from result
  useEffect(() => {
    if (result.role === "TECHADMIN" || result.role === "ADMIN") {
      fetch("/api/branches")
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setBranches(Array.isArray(data) ? data : []))
        .catch(() => setBranches([]));
    }
  }, [result.role]);

  const postLinks: { pathname: string; query: Record<string, string>; label: string }[] = [];
  if (result.role === "TECHADMIN" || result.role === "ADMIN") {
    branches.forEach((b) => {
      postLinks.push({
        pathname: `${basePath}/posts`,
        query: { branchId: b.id },
        label: b.country ? `${b.nameEn} (${b.country.nameEn})` : b.nameEn,
      });
    });
  } else if (result.role === "VERIFIED" && result.assignedBranches?.length) {
    result.assignedBranches.forEach((b) => {
      postLinks.push({
        pathname: `${basePath}/posts`,
        query: { branchId: b.id },
        label: b.name,
      });
    });
  }

  return (
    <aside className="w-full lg:w-56 xl:w-60 flex flex-col h-full bg-white border-e border-gray-200 min-h-0 min-w-0">
      {/* Header / Logo */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <HiViewGrid className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 min-w-0">
        <div className="flex flex-col min-w-0">
          <NavItem
            href={basePath}
            isActive={isDashboardActive}
            icon={HiOutlineHome}
            iconActive={HiHome}
            label={t("dashboard")}
          />

          {showPostsNav && (
            <>
              <div className="px-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setPostsExpanded((e) => !e)}
                  className={`flex items-center gap-3 w-full min-w-0 py-3 px-4 rounded-e-md transition-colors text-start border-s-[3px] ${
                    isPostsActive
                      ? "bg-primary-light border-primary text-primary font-semibold"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex-shrink-0 w-6 flex justify-center">
                    {isPostsActive ? (
                      <HiDocumentText className="w-5 h-5" />
                    ) : (
                      <HiOutlineDocumentText className="w-5 h-5" />
                    )}
                  </span>
                  <span className="flex-1 text-sm min-w-0 truncate">{t("posts")}</span>
                  <HiChevronRight
                    className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform ${
                      postsExpanded ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </div>
              {postsExpanded && (
                <div className="ps-4 pe-2 pb-1 pt-0.5 space-y-0.5 min-w-0">
                  <Link
                    href={`${basePath}/posts/report`}
                    className="flex items-center gap-3 py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 min-w-0"
                  >
                    <span className="min-w-0 truncate">{t("reportFoundItem")}</span>
                  </Link>
                  <Link
                    href={
                      result.role === "VERIFIED" && result.assignedBranches?.length === 1
                        ? { pathname: `${basePath}/posts`, query: { branchId: result.assignedBranches[0].id } }
                        : `${basePath}/posts`
                    }
                    className="flex items-center gap-3 py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 min-w-0"
                  >
                    <span className="min-w-0 truncate">{t("manageItems")}</span>
                  </Link>
                  {postLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      href={{ pathname: link.pathname, query: link.query }}
                      className="flex items-center gap-3 py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 min-w-0"
                    >
                      <span className="min-w-0 truncate">{link.label}</span>
                    </Link>
                  ))}
                  <Link
                    href={`${basePath}/claims`}
                    className="flex items-center gap-3 py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 min-w-0"
                  >
                    <span className="min-w-0 truncate">{t("manageClaims")}</span>
                  </Link>
                </div>
              )}
            </>
          )}

          <NavItem
            href={`${basePath}/claims`}
            isActive={isClaimsActive}
            icon={HiOutlineTicket}
            iconActive={HiTicket}
            label={t("claims")}
          />

          {showTicketsNav && (
            <NavItem
              href={`${basePath}/tickets`}
              isActive={isTicketsActive}
              icon={HiOutlineChat}
              iconActive={HiChat}
              label={t("tickets")}
            />
          )}

          {showMyTicketsNav && (
            <NavItem
              href={`${basePath}/tickets`}
              isActive={isTicketsActive}
              icon={HiOutlineChat}
              iconActive={HiChat}
              label={t("myTickets")}
            />
          )}

          {showManageBranches && (
            <>
              <div className="px-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setBranchesExpanded((e) => !e)}
                  className={`flex items-center gap-3 w-full min-w-0 py-3 px-4 rounded-e-md transition-colors text-start border-s-[3px] ${
                    isManageBranchesActive
                      ? "bg-primary-light border-primary text-primary font-semibold"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex-shrink-0 w-6 flex justify-center">
                    {isManageBranchesActive ? (
                      <HiOfficeBuilding className="w-5 h-5" />
                    ) : (
                      <HiOutlineOfficeBuilding className="w-5 h-5" />
                    )}
                  </span>
                  <span className="flex-1 text-sm min-w-0 truncate">{t("branches")}</span>
                  <HiChevronRight
                    className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform ${
                      branchesExpanded ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </div>
              {branchesExpanded && (
                <div className="ps-4 pe-2 pb-1 pt-0.5 space-y-0.5 min-w-0">
                  <Link
                    href={`${basePath}/manage-branches/add`}
                    className="flex items-center gap-3 py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 min-w-0"
                  >
                    <span className="min-w-0 truncate">{t("addBranch")}</span>
                  </Link>
                  <Link
                    href={`${basePath}/manage-branches`}
                    className="flex items-center gap-3 py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 min-w-0"
                  >
                    <span className="min-w-0 truncate">{t("manageBranches")}</span>
                  </Link>
                </div>
              )}
            </>
          )}

          {showManageUsers && (
            <>
              <NavItem
                href={`${basePath}/manage-countries`}
                isActive={isManageCountriesActive}
                icon={HiOutlineViewGrid}
                iconActive={HiViewGrid}
                label={t("countries")}
              />
              <NavItem
                href={`${basePath}/manage-users`}
                isActive={isManageUsersActive}
                icon={HiOutlineUsers}
                iconActive={HiUsers}
                label={t("users")}
              />
            </>
          )}
        </div>
      </nav>

      {/* Sign out - fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 p-2">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full min-w-0 py-3 px-4 rounded-e-md text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors text-start border-s-[3px] border-transparent"
        >
          <span className="flex-shrink-0 w-6 flex justify-center">
            <HiLogout className="w-5 h-5" />
          </span>
          <span className="flex-1 text-sm min-w-0 truncate">{t("signOut")}</span>
        </button>
      </div>
    </aside>
  );
}
