"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { gooeyToast } from "goey-toast";
import { Link, usePathname } from "@/i18n/routing";
import { DASHBOARD_ROLES } from "@/lib/dashboard";
import CustomSelect from "@/components/ui/CustomSelect";

function getRoleSegmentFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && DASHBOARD_ROLES.includes(first as (typeof DASHBOARD_ROLES)[number])) {
    return first;
  }
  return "techadmin";
}

type Country = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  code: string | null;
};
type BranchManager = {
  id: string;
  user: { id: string; name: string | null; image: string | null };
};
type Branch = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  countryId: string | null;
  country: Country | null;
  imageUrl: string | null;
  userBranches?: BranchManager[];
};

export default function ManageBranches() {
  const t = useTranslations("manageBranches");
  const pathname = usePathname();
  const roleSegment = getRoleSegmentFromPathname(pathname);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState("");

  const fetchBranches = async (countryId?: string) => {
    try {
      const url = countryId
        ? `/api/branches?countryId=${encodeURIComponent(countryId)}`
        : "/api/branches";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch branches");
      const data = await res.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch {
      gooeyToast.error(t("errorLoad"));
      setBranches([]);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await fetch("/api/countries");
      if (!res.ok) throw new Error("Failed to fetch countries");
      const data = await res.json();
      setCountries(Array.isArray(data) ? data : []);
    } catch {
      setCountries([]);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      await fetchBranches(countryFilter || undefined);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [countryFilter]);

  if (loading) return <p className="text-gray-600">{t("loading")}</p>;

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      <div className="max-w-xs mb-6">
        <CustomSelect
          label={t("filterByCountry")}
          value={countryFilter}
          onChange={setCountryFilter}
          placeholder={t("allCountries")}
          options={[
            { value: "", label: t("allCountries") },
            ...countries.map((c) => ({ value: c.id, label: c.nameEn })),
          ]}
        />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((b) => {
          const managers = b.userBranches ?? [];
          const displayManagers = managers.slice(0, 4);
          const extraCount = managers.length > 4 ? managers.length - 4 : 0;
          return (
            <li key={b.id}>
              <Link
                href={`/${roleSegment}/manage-branches/${b.id}`}
                className="block rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Vertical layout */}
                {b.imageUrl && (
                  <div className="aspect-video w-full bg-slate-100 shrink-0">
                    <img
                      src={b.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 leading-tight">
                      {b.nameEn}
                    </h3>
                    {b.nameAr && (
                      <p className="mt-0.5 text-sm text-slate-500" dir="rtl">
                        {b.nameAr}
                      </p>
                    )}
                  </div>
                  {(b.country || b.address) && (
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="shrink-0 mt-0.5 text-slate-400" aria-hidden>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        {b.country?.nameEn}
                        {b.address && ` · ${b.address}`}
                      </span>
                    </div>
                  )}
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex -space-x-2 min-w-0">
                      {displayManagers.length > 0 ? (
                        <>
                          {displayManagers.map((ub) => (
                            <div
                              key={ub.id}
                              className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden shrink-0"
                              title={ub.user.name ?? undefined}
                            >
                              {ub.user.image ? (
                                <img
                                  src={ub.user.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-medium">
                                  {(ub.user.name ?? "?")[0]}
                                </span>
                              )}
                            </div>
                          ))}
                          {extraCount > 0 && (
                            <span className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-medium shrink-0">
                              +{extraCount}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">{t("noManagers")}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-primary)] shrink-0">
                      {t("viewDetails")}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {branches.length === 0 && !loading && (
        <p className="text-gray-500">{t("noBranchesYet")}</p>
      )}
    </div>
  );
}
