"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { gooeyToast } from "goey-toast";
import { DASHBOARD_ROLES } from "@/lib/dashboard";

function getRoleSegmentFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && DASHBOARD_ROLES.includes(first as (typeof DASHBOARD_ROLES)[number])) {
    return first;
  }
  return "basic";
}

type TicketMessage = {
  id: string;
  body: string;
  isStaffReply: boolean;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
};

type Ticket = {
  id: string;
  subject: string;
  body: string;
  type: string;
  status: string;
  reopenedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; email: string };
  ticketMessages: TicketMessage[];
};

type TicketDetailProps = {
  ticketId: string;
  canClose?: boolean;
  canReopen?: boolean;
};

export default function TicketDetail({
  ticketId,
  canClose = false,
  canReopen = false,
}: TicketDetailProps) {
  const pathname = usePathname();
  const roleSegment = getRoleSegmentFromPathname(pathname);
  const t = useTranslations("tickets");

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  async function fetchTicket() {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      if (!res.ok) {
        if (res.status === 404) setTicket(null);
        return;
      }
      const data = await res.json();
      setTicket(data);
    } catch {
      gooeyToast.error("Failed to load ticket.");
      setTicket(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyBody.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
        setReplyBody("");
        gooeyToast.success("Reply sent.");
      } else {
        const err = await res.json().catch(() => ({}));
        gooeyToast.error(err?.error ?? "Failed to send reply.");
      }
    } catch {
      gooeyToast.error("Failed to send reply.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleClose() {
    if (!canClose || !ticket || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CLOSED" }),
      });
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
        gooeyToast.success("Ticket closed.");
      } else {
        gooeyToast.error("Failed to close ticket.");
      }
    } catch {
      gooeyToast.error("Failed to close ticket.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReopen() {
    if (!canReopen || !ticket || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "OPEN" }),
      });
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
        gooeyToast.success("Ticket reopened.");
      } else {
        gooeyToast.error("Failed to reopen ticket.");
      }
    } catch {
      gooeyToast.error("Failed to reopen ticket.");
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading) {
    return <p className="text-gray-500">{t("loadingTicket")}</p>;
  }
  if (!ticket) {
    return (
      <div>
        <p className="text-gray-500">{t("ticketNotFound")}</p>
        <Link href={`/${roleSegment}/tickets`} className="text-primary hover:underline mt-2 inline-block">
          {t("backToTickets")}
        </Link>
      </div>
    );
  }

  const canReply = ticket.status !== "CLOSED";
  const showReopen = canReopen && ticket.status === "CLOSED";

  return (
    <div className="w-full">
      <Link
        href={`/${roleSegment}/tickets`}
        className="text-primary hover:underline text-sm mb-4 inline-block"
      >
        {t("backToTickets")}
      </Link>
      <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
        <h1 className="text-xl font-bold">{ticket.subject}</h1>
        <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
          <span>
            {t("typeLabel")}:{" "}
            {t(
              ticket.type === "SUBSCRIPTION"
                ? "typeSubscription"
                : ticket.type === "PROBLEM_REPORT"
                  ? "typeProblemReport"
                  : ticket.type === "SUPPORT"
                    ? "typeSupport"
                    : "typeOther"
            )}
          </span>
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
          <span>By: {ticket.user?.name ?? ticket.user?.email ?? "—"}</span>
          <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
          {ticket.reopenedAt && (
            <span>Reopened: {new Date(ticket.reopenedAt).toLocaleString()}</span>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          {canClose && ticket.status !== "CLOSED" && (
            <button
              type="button"
              onClick={handleClose}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-800 disabled:opacity-50"
            >
              {t("closeTicket")}
            </button>
          )}
          {showReopen && (
            <button
              type="button"
              onClick={handleReopen}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {t("reopen")}
            </button>
          )}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">{t("conversation")}</h2>
        {ticket.ticketMessages.length === 0 ? (
          <p className="text-gray-500 text-sm">{t("noMessages")}</p>
        ) : (
          <ul className="space-y-3">
            {ticket.ticketMessages.map((msg) => (
              <li
                key={msg.id}
                className={`p-3 rounded-lg ${
                  msg.isStaffReply ? "bg-primary/10 border-l-4 border-primary" : "bg-white border border-gray-200"
                }`}
              >
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>
                    {msg.user?.name ?? msg.user?.email ?? "—"}
                    {msg.isStaffReply && (
                      <span className="ml-1 font-medium text-primary">{t("staff")}</span>
                    )}
                  </span>
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{msg.body}</p>
              </li>
            ))}
          </ul>
        )}

        {canReply && (
          <form onSubmit={handleReply} className="mt-4 pt-4 border-t border-gray-200">
            <label htmlFor="reply-body" className="block text-sm font-medium text-gray-700 mb-1">
              {t("reply")}
            </label>
            <textarea
              id="reply-body"
              rows={4}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder={t("replyPlaceholder")}
              className="w-full form-input text-sm"
              required
            />
            <button
              type="submit"
              disabled={submitting || !replyBody.trim()}
              className="mt-2 px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? t("sending") : t("sendReply")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
