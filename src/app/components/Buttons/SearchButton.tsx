"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";


export function SearchButton() {
    const t =  useTranslations("HomePage");

  
  return (
    <Link href="/search" className="w-full md:w-[200px] btn-primary inline-flex items-center justify-center hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
      {t("search")}
    </Link>
  );
}
