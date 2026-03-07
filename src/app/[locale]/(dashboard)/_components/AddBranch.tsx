"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gooeyToast } from "goey-toast";
import { useRouter, usePathname } from "@/i18n/routing";
import { DASHBOARD_ROLES } from "@/lib/dashboard";
import { supabase } from "@/lib/supabase";
import BranchLocationPicker from "./BranchLocationPicker";
import CustomSelect from "@/components/ui/CustomSelect";

type Country = {
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

export default function AddBranch() {
  const t = useTranslations("manageBranches");
  const router = useRouter();
  const pathname = usePathname();
  const roleSegment = getRoleSegmentFromPathname(pathname);

  const [countries, setCountries] = useState<Country[]>([]);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [countryId, setCountryId] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/countries")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCountries(Array.isArray(data) ? data : []))
      .catch(() => setCountries([]));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: nameEn.trim(),
          nameAr: nameAr.trim() || null,
          countryId: countryId || null,
          address: address.trim() || null,
          latitude: latitude ? Number(latitude) : 0,
          longitude: longitude ? Number(longitude) : 0,
          descriptionEn: descriptionEn.trim() || null,
          descriptionAr: descriptionAr.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("errorCreate"));
      }
      const result = await res.json();
      const branchId = result.id;

      if (imageFile && branchId) {
        const ext = imageFile.name.split(".").pop() || "jpg";
        const filePath = `branches/${branchId}/image.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("mfqodFiles")
          .upload(filePath, imageFile, { upsert: true });
        if (uploadError) {
          console.error("Branch image upload failed:", uploadError);
          gooeyToast.error(t("errorImageUpload"));
        } else {
          const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const imageUrl = baseUrl
            ? `${baseUrl}/storage/v1/object/public/mfqodFiles/${filePath}`
            : null;
          if (imageUrl) {
            await fetch(`/api/branches/${branchId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl }),
            });
          }
        }
      }

      gooeyToast.success(t("successCreate"));
      router.push(`/${roleSegment}/manage-branches`);
    } catch {
      gooeyToast.error(t("errorCreate"));
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">{t("addBranch")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl w-full">
        <div>
          <label className="form-label">{t("branchImageOptional")}</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
            aria-hidden
          />
          {imagePreview ? (
            <div className="relative w-full">
              <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50">
                <img src={imagePreview} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  {t("changeImage")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-sm text-slate-500 hover:text-red-600"
                >
                  {t("removeImage")}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-primary", "bg-primary/5");
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-primary", "bg-primary/5");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-primary", "bg-primary/5");
                const file = e.dataTransfer.files?.[0];
                if (file?.type.startsWith("image/")) {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onload = () => setImagePreview(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-100/50 transition-colors py-10 px-6 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-sm font-medium">{t("chooseOrDropImage")}</span>
            </button>
          )}
        </div>
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
        <div className="max-w-xs">
          <CustomSelect
            label={t("countryLabel")}
            value={countryId}
            onChange={setCountryId}
            placeholder={t("noCountry")}
            options={[
              { value: "", label: t("noCountry") },
              ...countries.map((c) => ({ value: c.id, label: c.nameEn })),
            ]}
          />
        </div>
        <BranchLocationPicker
          value={{
            address,
            latitude: latitude ? Number(latitude) : 0,
            longitude: longitude ? Number(longitude) : 0,
          }}
          onChange={(loc) => {
            setAddress(loc.address);
            setLatitude(String(loc.latitude));
            setLongitude(String(loc.longitude));
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">{t("descriptionEn")}</label>
            <input
              type="text"
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder={t("descriptionEnPlaceholder")}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">{t("descriptionAr")}</label>
            <input
              type="text"
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder={t("descriptionArPlaceholder")}
              className="form-input"
              dir="rtl"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? t("loading") : t("addBranch")}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/${roleSegment}/manage-branches`)}
            className="text-[var(--color-form-label)] hover:text-[var(--color-form-text)]"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
