"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { gooeyToast } from "goey-toast";

type Country = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  code: string | null;
  _count?: { branches: number };
};

export default function ManageCountries() {
  const t = useTranslations("manageCountries");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameEn, setEditNameEn] = useState("");
  const [editNameAr, setEditNameAr] = useState("");
  const [editDescriptionEn, setEditDescriptionEn] = useState("");
  const [editDescriptionAr, setEditDescriptionAr] = useState("");
  const [editCode, setEditCode] = useState("");

  const fetchCountries = async () => {
    try {
      const res = await fetch("/api/countries");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCountries(Array.isArray(data) ? data : []);
    } catch {
      gooeyToast.error(t("errorLoad"));
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) return;
    try {
      const res = await fetch("/api/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: nameEn.trim(),
          nameAr: nameAr.trim() || null,
          descriptionEn: descriptionEn.trim() || null,
          descriptionAr: descriptionAr.trim() || null,
          code: code.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("errorCreate"));
      }
      setNameEn("");
      setNameAr("");
      setDescriptionEn("");
      setDescriptionAr("");
      setCode("");
      gooeyToast.success(t("successCreate"));
      fetchCountries();
    } catch {
      gooeyToast.error(t("errorCreate"));
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editNameEn.trim()) return;
    try {
      const res = await fetch(`/api/countries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: editNameEn.trim(),
          nameAr: editNameAr.trim() || null,
          descriptionEn: editDescriptionEn.trim() || null,
          descriptionAr: editDescriptionAr.trim() || null,
          code: editCode.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("errorUpdate"));
      }
      setEditingId(null);
      gooeyToast.success(t("successUpdate"));
      fetchCountries();
    } catch {
      gooeyToast.error(t("errorUpdate"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("deleteConfirm")))
      return;
    try {
      const res = await fetch(`/api/countries/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("errorDelete"));
      }
      gooeyToast.success(t("successDelete"));
      fetchCountries();
    } catch {
      gooeyToast.error(t("errorDelete"));
    }
  };

  if (loading) return <p className="text-gray-600">{t("loading")}</p>;

  return (
    <div className="p-4 sm:p-6 w-full min-w-0">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      <form onSubmit={handleCreate} className="space-y-4 mb-6 p-4 border border-gray-200 rounded-2xl bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">{t("nameEn")}</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder={t("nameEnPlaceholder")}
              className="form-input"
              required
              title={t("requiredField")}
            />
          </div>
          <div>
            <label className="form-label">{t("nameAr")}</label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder={t("nameArPlaceholder")}
              className="form-input"
              dir="rtl"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">{t("descriptionEn")}</label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder={t("descriptionEnPlaceholder")}
              className="form-textarea"
              rows={2}
            />
          </div>
          <div>
            <label className="form-label">{t("descriptionAr")}</label>
            <textarea
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder={t("descriptionArPlaceholder")}
              className="form-textarea"
              dir="rtl"
              rows={2}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="w-24">
            <label className="form-label">{t("code")}</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("codePlaceholder")}
              className="form-input"
            />
          </div>
          <button type="submit" className="btn-primary">
            {t("addCountry")}
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {countries.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between border p-3 rounded"
          >
            {editingId === c.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="form-label">{t("nameEnShort")}</label>
                    <input
                      type="text"
                      value={editNameEn}
                      onChange={(e) => setEditNameEn(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">{t("nameArShort")}</label>
                    <input
                      type="text"
                      value={editNameAr}
                      onChange={(e) => setEditNameAr(e.target.value)}
                      className="form-input"
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="form-label">{t("descriptionEnShort")}</label>
                    <textarea
                      value={editDescriptionEn}
                      onChange={(e) => setEditDescriptionEn(e.target.value)}
                      className="form-textarea min-h-[60px]"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="form-label">{t("descriptionArShort")}</label>
                    <textarea
                      value={editDescriptionAr}
                      onChange={(e) => setEditDescriptionAr(e.target.value)}
                      className="form-textarea min-h-[60px]"
                      dir="rtl"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex gap-2 items-end flex-wrap">
                  <div className="w-20">
                    <label className="form-label">{t("code")}</label>
                    <input
                      type="text"
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      placeholder={t("codePlaceholder")}
                      className="form-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdate(c.id)}
                    className="btn-primary text-sm py-2"
                  >
                    {t("save")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-[var(--color-form-label)] hover:text-[var(--color-form-text)] px-2 py-2"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="font-medium">
                  {c.nameEn}
                  {c.nameAr && (
                    <span className="text-slate-500 text-sm ml-2">/ {c.nameAr}</span>
                  )}
                  {c.code && (
                    <span className="text-gray-500 text-sm ml-2">({c.code})</span>
                  )}
                  {c._count != null && (
                    <span className="text-gray-400 text-sm ml-2">
                      — {t("branchesCount", { count: c._count.branches })}
                    </span>
                  )}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditNameEn(c.nameEn);
                      setEditNameAr(c.nameAr ?? "");
                      setEditDescriptionEn(c.descriptionEn ?? "");
                      setEditDescriptionAr(c.descriptionAr ?? "");
                      setEditCode(c.code || "");
                    }}
                    className="text-primary hover:text-primary-hover text-sm font-medium"
                  >
                    {t("edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 text-sm"
                  >
                    {t("delete")}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {countries.length === 0 && !loading && (
        <p className="text-gray-500">{t("noCountriesYet")}</p>
      )}
    </div>
  );
}
