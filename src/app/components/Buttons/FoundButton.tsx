"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function FoundButton() {
const t  = useTranslations("HomePage")

  return (
    <Link href="/report-found-item" className="w-full md:w-[200px] btn-primary-outline inline-flex items-center justify-center hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
      <h1>{t("report")}</h1>
    </Link>
  );
}
