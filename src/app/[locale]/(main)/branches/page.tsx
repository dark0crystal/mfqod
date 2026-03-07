"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { gooeyToast } from "goey-toast";
import BranchesMap from "./BranchesMap";
import BranchCard from "./BranchCard";
import Footer from "@/app/components/Footer";

export type Branch = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
};

export default function BranchesPage() {
  const t = useTranslations("branches");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await fetch("/api/branches");
        if (!res.ok) throw new Error("Failed to fetch branches");
        const data = await res.json();
        setBranches(Array.isArray(data) ? data : []);
      } catch {
        gooeyToast.error(t("error"));
        setBranches([]);
      } finally {
        setLoading(false);
      }
    }
    loadBranches();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-slate-600">{t("loading")}</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{t("title")}</h1>
        <p className="text-slate-600 mb-6">{t("subtitle")}</p>

        <section className="mb-8">
          <BranchesMap branches={branches} />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">{t("allBranches")}</h2>
          {branches.length === 0 ? (
            <p className="text-slate-500">{t("noBranches")}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((branch) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  openInMapsLabel={t("openInGoogleMaps")}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
