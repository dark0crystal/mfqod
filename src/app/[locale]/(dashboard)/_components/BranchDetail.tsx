"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { gooeyToast } from "goey-toast";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { DASHBOARD_ROLES } from "@/lib/dashboard";
import BranchLocationPicker from "./BranchLocationPicker";
import CustomSelect from "@/components/ui/CustomSelect";
import { FiArrowLeft, FiMapPin, FiGlobe, FiFileText, FiUsers } from "react-icons/fi";

type Country = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  code: string | null;
};

type UserBranchUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type UserBranch = {
  id: string;
  user: UserBranchUser;
};

type Branch = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  descriptionEn: string | null;
  descriptionAr: string | null;
  countryId: string | null;
  country: Country | null;
  imageUrl: string | null;
  userBranches: UserBranch[];
};

type CountryOption = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  code: string | null;
};

function getRoleSegmentFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && DASHBOARD_ROLES.includes(first as (typeof DASHBOARD_ROLES)[number])) {
    return first;
  }
  return "techadmin";
}

export default function BranchDetail({ branchId }: { branchId: string }) {
  const t = useTranslations("manageBranches");
  const pathname = usePathname();
  const router = useRouter();
  const roleSegment = getRoleSegmentFromPathname(pathname);

  const [branch, setBranch] = useState<Branch | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nameEn: "",
    nameAr: "",
    countryId: "",
    address: "",
    latitude: "",
    longitude: "",
    descriptionEn: "",
    descriptionAr: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchBranch = async () => {
    try {
      const res = await fetch(`/api/branches/${branchId}`);
      if (res.status === 404) {
        setNotFound(true);
        setBranch(null);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch branch");
      const data = await res.json();
      setBranch(data);
      setEditForm({
        nameEn: data.nameEn ?? "",
        nameAr: data.nameAr ?? "",
        countryId: data.countryId ?? "",
        address: data.address ?? "",
        latitude: String(data.latitude ?? 0),
        longitude: String(data.longitude ?? 0),
        descriptionEn: data.descriptionEn ?? data.description ?? "",
        descriptionAr: data.descriptionAr ?? "",
      });
    } catch {
      gooeyToast.error(t("errorLoad"));
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranch();
  }, [branchId]);

  useEffect(() => {
    fetch("/api/countries")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCountries(Array.isArray(data) ? data : []))
      .catch(() => setCountries([]));
  }, []);

  const handleSave = async () => {
    if (!editForm.nameEn.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/branches/${branchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: editForm.nameEn.trim(),
          nameAr: editForm.nameAr.trim() || null,
          countryId: editForm.countryId || null,
          address: editForm.address.trim() || null,
          latitude: editForm.latitude ? Number(editForm.latitude) : undefined,
          longitude: editForm.longitude ? Number(editForm.longitude) : undefined,
          descriptionEn: editForm.descriptionEn.trim() || null,
          descriptionAr: editForm.descriptionAr.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("errorUpdate"));
      }
      gooeyToast.success(t("successUpdate"));
      setEditing(false);
      fetchBranch();
    } catch {
      gooeyToast.error(t("errorUpdate"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t("deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/branches/${branchId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("errorDelete"));
      }
      gooeyToast.success(t("successDelete"));
      router.push(`/${roleSegment}/manage-branches`);
    } catch {
      gooeyToast.error(t("errorDelete"));
    }
  };

  if (loading) return <p className="text-gray-600 p-6">{t("loading")}</p>;
  if (notFound || !branch)
    return (
      <div className="p-6">
        <p className="text-gray-600">{t("errorFetch")}</p>
        <Link href={`/${roleSegment}/manage-branches`} className="text-primary mt-2 inline-block">
          {t("backToBranches")}
        </Link>
      </div>
    );

  const managers = branch.userBranches ?? [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto">
      {/* Back navigation */}
      <div className="mb-6">
        <Link
          href={`/${roleSegment}/manage-branches`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary)]/90 transition-colors"
        >
          <FiArrowLeft className="shrink-0 size-4" aria-hidden />
          {t("backToBranches")}
        </Link>
      </div>

      {/* Header: title + actions */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {editing ? t("edit") : branch.nameEn}
          </h1>
          {branch.nameAr && !editing && (
            <p className="mt-1 text-lg text-slate-500" dir="rtl">
              {branch.nameAr}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {!editing ? (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--color-primary)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                {t("edit")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                {t("delete")}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="btn-primary text-sm py-2"
                disabled={saving}
              >
                {saving ? t("loading") : t("save")}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-[var(--color-form-label)] hover:text-[var(--color-form-text)]"
              >
                {t("cancel")}
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <div className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t("nameEnShort")}</label>
              <input
                type="text"
                value={editForm.nameEn}
                onChange={(e) => setEditForm((f) => ({ ...f, nameEn: e.target.value }))}
                className="form-input"
                placeholder={t("nameEnPlaceholder")}
              />
            </div>
            <div>
              <label className="form-label">{t("nameArShort")}</label>
              <input
                type="text"
                value={editForm.nameAr}
                onChange={(e) => setEditForm((f) => ({ ...f, nameAr: e.target.value }))}
                className="form-input"
                placeholder={t("nameArPlaceholder")}
                dir="rtl"
              />
            </div>
          </div>
          <div className="max-w-xs">
            <CustomSelect
              label={t("countryLabel")}
              value={editForm.countryId}
              onChange={(v) => setEditForm((f) => ({ ...f, countryId: v }))}
              placeholder={t("noCountry")}
              options={[
                { value: "", label: t("noCountry") },
                ...countries.map((c) => ({ value: c.id, label: c.nameEn })),
              ]}
            />
          </div>
          <BranchLocationPicker
            value={{
              address: editForm.address,
              latitude: editForm.latitude ? Number(editForm.latitude) : 0,
              longitude: editForm.longitude ? Number(editForm.longitude) : 0,
            }}
            onChange={(loc) =>
              setEditForm((f) => ({
                ...f,
                address: loc.address,
                latitude: String(loc.latitude),
                longitude: String(loc.longitude),
              }))
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t("descriptionEnShort")}</label>
              <input
                type="text"
                value={editForm.descriptionEn}
                onChange={(e) => setEditForm((f) => ({ ...f, descriptionEn: e.target.value }))}
                className="form-input"
                placeholder={t("descriptionEnPlaceholder")}
              />
            </div>
            <div>
              <label className="form-label">{t("descriptionArShort")}</label>
              <input
                type="text"
                value={editForm.descriptionAr}
                onChange={(e) => setEditForm((f) => ({ ...f, descriptionAr: e.target.value }))}
                className="form-input"
                placeholder={t("descriptionArPlaceholder")}
                dir="rtl"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {branch.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
              <img
                src={branch.imageUrl}
                alt=""
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Branch details card */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 text-slate-600">
                <FiFileText className="size-4" aria-hidden />
              </span>
              {t("branchDetails")}
            </h2>
            <dl className="grid gap-4 sm:grid-cols-1">
              {branch.country && (
                <div className="flex gap-3">
                  <dt className="flex items-start gap-2 text-slate-500 shrink-0 min-w-[7rem]">
                    <FiGlobe className="size-4 mt-0.5 shrink-0" aria-hidden />
                    <span className="text-sm font-medium">{t("countryLabel")}</span>
                  </dt>
                  <dd className="text-slate-800">
                    {branch.country.nameEn}
                    {branch.country.nameAr && (
                      <span className="ms-2 text-slate-500" dir="rtl">({branch.country.nameAr})</span>
                    )}
                  </dd>
                </div>
              )}
              {branch.address && (
                <div className="flex gap-3">
                  <dt className="flex items-start gap-2 text-slate-500 shrink-0 min-w-[7rem]">
                    <FiMapPin className="size-4 mt-0.5 shrink-0" aria-hidden />
                    <span className="text-sm font-medium">{t("addressLabel")}</span>
                  </dt>
                  <dd className="text-slate-800 break-words">{branch.address}</dd>
                </div>
              )}
              {branch.descriptionEn && (
                <div className="flex gap-3">
                  <dt className="flex items-start gap-2 text-slate-500 shrink-0 min-w-[7rem]">
                    <FiFileText className="size-4 mt-0.5 shrink-0" aria-hidden />
                    <span className="text-sm font-medium">{t("descriptionEnShort")}</span>
                  </dt>
                  <dd className="text-slate-800">{branch.descriptionEn}</dd>
                </div>
              )}
              {branch.descriptionAr && (
                <div className="flex gap-3">
                  <dt className="flex items-start gap-2 text-slate-500 shrink-0 min-w-[7rem]">
                    <FiFileText className="size-4 mt-0.5 shrink-0" aria-hidden />
                    <span className="text-sm font-medium">{t("descriptionArShort")}</span>
                  </dt>
                  <dd className="text-slate-800" dir="rtl">{branch.descriptionAr}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Location on map card */}
          <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <span className="flex items-center justify-center size-8 rounded-lg bg-blue-50 text-[var(--color-primary)]">
                  <FiMapPin className="size-4" aria-hidden />
                </span>
                {t("locationOnMap")}
              </h2>
            </div>
            <div className="p-5 sm:p-6 pt-0">
              <BranchLocationPicker
                value={{
                  address: branch.address ?? "",
                  latitude: branch.latitude ?? 0,
                  longitude: branch.longitude ?? 0,
                }}
                onChange={() => {}}
                readOnly
              />
            </div>
          </section>

          {/* Managers card */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 text-slate-600">
                <FiUsers className="size-4" aria-hidden />
              </span>
              {t("managers")}
            </h2>
            {managers.length === 0 ? (
              <p className="text-slate-500 text-sm py-2">{t("noManagers")}</p>
            ) : (
              <ul className="space-y-3">
                {managers.map((ub) => (
                  <li
                    key={ub.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    {ub.user.image ? (
                      <img
                        src={ub.user.image}
                        alt=""
                        className="size-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <span className="flex items-center justify-center size-12 rounded-full bg-slate-200 text-slate-600 font-medium text-lg shrink-0">
                        {(ub.user.name ?? ub.user.email ?? "?")[0].toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800">
                        {ub.user.name ?? ub.user.email ?? ub.user.id}
                      </p>
                      {ub.user.email && (
                        <p className="text-sm text-slate-500 truncate">{ub.user.email}</p>
                      )}
                    </div>
                    {roleSegment === "techadmin" && (
                      <Link
                        href={`/${roleSegment}/manage-users/${ub.user.id}`}
                        className="shrink-0 text-sm font-medium text-[var(--color-primary)] hover:underline"
                      >
                        {t("viewUser")}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
