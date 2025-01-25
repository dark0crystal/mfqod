"use client";

import { useTranslations } from "next-intl";

export default function DataProvider() {
  const t = useTranslations("storage"); // Assuming translations are under a "common" namespace

  // Translated organization names
  const orgNames = [
    { key: "SQU", name: t("org.SQU") },
    { key: "UTAS_Muscat", name: t("org.UTAS_Muscat") },
    { key: "UTAS_Ibra", name: t("org.UTAS_Ibra") },
    { key: "Bin_Omair", name: t("org.Bin_Omair") },
    { key: "UTAS_Nizwa", name: t("org.UTAS_Nizwa") },
  ];

  // Translated organization places
  const OrgPlaces = [
    { key: "SQU", places: [t("place.SQU_Library"), t("place.SQU_LostFound")] },
    {
      key: "UTAS_Muscat",
      places: [t("place.UTAS_Muscat_Library"), t("place.UTAS_Muscat_LostFound")],
    },
    {
      key: "UTAS_Ibra",
      places: [t("place.UTAS_Ibra_Library"), t("place.UTAS_Ibra_LostFound")],
    },
    {
      key: "Bin_Omair",
      places: [t("place.Bin_Omair_Library"), t("place.Bin_Omair_LostFound")],
    },
    {
      key: "UTAS_Nizwa",
      places: [t("place.UTAS_Nizwa_Library"), t("place.UTAS_Nizwa_LostFound")],
    },
  ];

  // Roles (no translation needed)
  const roles = ["BASIC", "VERIFIED", "ADMIN", "TECHADMIN"];

  return { orgNames, OrgPlaces, roles };
}
