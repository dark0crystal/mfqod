"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
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

function useTypeOptions(t: (k: string) => string) {
  return [
    { value: "SUBSCRIPTION", label: t("typeSubscription") },
    { value: "PROBLEM_REPORT", label: t("typeProblemReport") },
    { value: "SUPPORT", label: t("typeSupport") },
    { value: "OTHER", label: t("typeOther") },
  ];
}

type CreateTicketFormProps = {
  defaultType?: string;
};

export default function CreateTicketForm({ defaultType = "" }: CreateTicketFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const roleSegment = getRoleSegmentFromPathname(pathname);
  const t = useTranslations("tickets");
  const typeOptions = useTypeOptions(t);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState(defaultType || "SUPPORT");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), body: body.trim(), type }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        gooeyToast.error(err?.error ?? "Failed to create ticket.");
        setSubmitting(false);
        return;
      }
      const ticket = await res.json();
      gooeyToast.success("Ticket created.");
      router.push(`/${roleSegment}/tickets/${ticket.id}`);
    } catch {
      gooeyToast.error("Failed to create ticket.");
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-xl">
      <h1 className="text-xl font-bold mb-4">{t("createTicket")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border border-gray-200 rounded-lg p-4 bg-white">
        <div>
          <label htmlFor="ticket-subject" className="block text-sm font-medium text-gray-700 mb-1">
            {t("subjectLabel")}
          </label>
          <input
            id="ticket-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t("subjectPlaceholder")}
            className="w-full form-input"
            required
            maxLength={500}
          />
        </div>
        <div>
          <label htmlFor="ticket-type" className="block text-sm font-medium text-gray-700 mb-1">
            {t("typeLabel")}
          </label>
          <CustomSelect
            id="ticket-type"
            value={type}
            onChange={setType}
            options={typeOptions}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="ticket-body" className="block text-sm font-medium text-gray-700 mb-1">
            {t("messageLabel")}
          </label>
          <textarea
            id="ticket-body"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("messagePlaceholder")}
            className="w-full form-input"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !subject.trim() || !body.trim()}
          className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? t("creating") : t("createTicketButton")}
        </button>
      </form>
    </div>
  );
}
