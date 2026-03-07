"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { gooeyToast } from "goey-toast";
import CustomSelect from "@/components/ui/CustomSelect";
import { DASHBOARD_ROLES } from "@/lib/dashboard";

function getRoleSegmentFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && DASHBOARD_ROLES.includes(first as (typeof DASHBOARD_ROLES)[number])) {
    return first;
  }
  return "basic";
}

type TicketItem = {
  id: string;
  subject: string;
  body: string;
  type: string;
  status: string;
  reopenedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; email: string };
  _count: { ticketMessages: number };
};

type TicketListProps = {
  showAuthor?: boolean;
  title?: string;
  emptyMessage?: string;
};

function useStatusOptions(t: (k: string) => string) {
  return [
    { value: "", label: t("allStatuses") },
    { value: "OPEN", label: t("statusOpen") },
    { value: "IN_PROGRESS", label: t("statusInProgress") },
    { value: "CLOSED", label: t("statusClosed") },
  ];
}
function useTypeOptions(t: (k: string) => string) {
  return [
    { value: "", label: t("allTypes") },
    { value: "SUBSCRIPTION", label: t("typeSubscription") },
    { value: "PROBLEM_REPORT", label: t("typeProblemReport") },
    { value: "SUPPORT", label: t("typeSupport") },
    { value: "OTHER", label: t("typeOther") },
  ];
}

export default function TicketList({
  showAuthor = false,
  title,
  emptyMessage,
}: TicketListProps) {
  const pathname = usePathname();
  const roleSegment = getRoleSegmentFromPathname(pathname);
  const t = useTranslations("tickets");
  const statusOptions = useStatusOptions(t);
  const typeOptions = useTypeOptions(t);

  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  function buildUrl() {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("type", typeFilter);
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    params.set("limit", "50");
    const q = params.toString();
    return `/api/tickets${q ? `?${q}` : ""}`;
  }

  async function fetchTickets() {
    setIsLoading(true);
    try {
      const res = await fetch(buildUrl());
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data = await res.json();
      setTickets(Array.isArray(data.tickets) ? data.tickets : []);
      setTotal(typeof data.total === "number" ? data.total : 0);
    } catch {
      gooeyToast.error("Failed to load tickets.");
      setTickets([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, typeFilter, searchQuery]);

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const displayTitle = title ?? (showAuthor ? t("title") : t("myTicketsTitle"));
  const defaultEmpty = showAuthor ? t("noTickets") : t("noTicketsMy");
  const finalEmptyMessage = emptyMessage ?? defaultEmpty;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h1 className="text-xl font-bold">{displayTitle}</h1>
          <p className="text-gray-600">
            {showAuthor ? t("manageDescription") : t("myTicketsDescription")}
          </p>
        </div>
        {!showAuthor && (
          <Link
            href={`/${roleSegment}/tickets/new`}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
          >
            {t("newTicket")}
          </Link>
        )}
      </div>

      {!isLoading && (
        <div className="mb-4 p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">{t("filter")}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <CustomSelect
                id="ticket-status"
                label={`${t("statusLabel")}:`}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder={t("allStatuses")}
                options={statusOptions}
                className="min-w-[140px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <CustomSelect
                id="ticket-type"
                label={`${t("typeLabel")}:`}
                value={typeFilter}
                onChange={setTypeFilter}
                placeholder={t("allTypes")}
                options={typeOptions}
                className="min-w-[140px]"
              />
            </div>
            <div className="flex items-center gap-2 min-w-0 flex-1 max-w-xs">
              <label htmlFor="ticket-search" className="text-sm text-gray-600 whitespace-nowrap">
                Search:
              </label>
              <input
                id="ticket-search"
                type="search"
                placeholder={t("searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-input w-full text-sm py-2"
              />
            </div>
          </div>
        </div>
      )}

      {isLoading && <p className="text-gray-500">{t("loadingTickets")}</p>}

      {!isLoading && (
        <>
          <p className="text-sm text-gray-600 mb-2">
            {total} ticket{total === 1 ? "" : "s"}
          </p>
          {tickets.length === 0 ? (
            <p className="text-gray-500 py-6">{finalEmptyMessage}</p>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                      {t("subject")}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                      {t("typeLabel")}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                      Status
                    </th>
                    {showAuthor && (
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                        {t("author")}
                      </th>
                    )}
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                      {t("updated")}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                      {t("messages")}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-4 py-2 text-sm text-gray-900 max-w-[200px] truncate">
                        {ticket.subject}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {t(
                          ticket.type === "SUBSCRIPTION"
                            ? "typeSubscription"
                            : ticket.type === "PROBLEM_REPORT"
                              ? "typeProblemReport"
                              : ticket.type === "SUPPORT"
                                ? "typeSupport"
                                : "typeOther"
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            ticket.status === "OPEN"
                              ? "bg-blue-100 text-blue-800"
                              : ticket.status === "IN_PROGRESS"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {t(
                            ticket.status === "OPEN"
                              ? "statusOpen"
                              : ticket.status === "IN_PROGRESS"
                                ? "statusInProgress"
                                : "statusClosed"
                          )}
                        </span>
                      </td>
                      {showAuthor && (
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {ticket.user?.name ?? ticket.user?.email ?? "—"}
                        </td>
                      )}
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(ticket.updatedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {ticket._count?.ticketMessages ?? 0}
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/${roleSegment}/tickets/${ticket.id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {t("view")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
