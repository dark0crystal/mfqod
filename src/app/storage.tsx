"use client";

import { useTranslations } from "next-intl";

export default function DataProvider() {
  const t = useTranslations("storage"); // Assuming translations are under a "common" namespace

  // Translated organization names
  const orgNames = [
    { key: "SQU", name: t("org.SQU") },
    { key: "UTAS Muscat", name: t("org.UTAS_Muscat") },
    { key: "UTAS Ibra", name: t("org.UTAS_Ibra") },
    { key: "Bin Omair", name: t("org.Bin_Omair") },
    { key: "UTAS Nizwa", name: t("org.UTAS_Nizwa") },
  ];

  // Translated organization places
  const OrgPlaces = [
    { key: "SQU", places: [{key:"SQU Library",name:t("place.SQU_Library")}, {key:"SQU Lost and Found Department",name:t("place.SQU_LostFound")}] },
    {
      key: "UTAS Muscat",
      places: [{key:"UTAS Muscat Library" , name:t("place.UTAS_Muscat_Library")}, {key:"UTAS Muscat Lost and Found Department",name:t("place.UTAS_Muscat_LostFound")}],
    },
    {
      key: "UTAS Ibra",
      places: [{key:"UTAS Ibra Library",name:t("place.UTAS_Ibra_Library")}, {key:"UTAS Ibra Lost and Found Department",name:t("place.UTAS_Ibra_LostFound")}],
    },
    {
      key: "Bin Omair",
      places: [{key:"Bin Omair Library",name:t("place.Bin_Omair_Library")}],
    },
    {
      key: "UTAS Nizwa",
      places: [{key:"UTAS Nizwa Library",name:t("place.UTAS_Nizwa_Library")}, {key:"UTAS Nizwa Lost and Found Department",name:t("place.UTAS_Nizwa_LostFound")}],
    },
  ];

  // Roles (no translation needed)
  const roles = ["BASIC", "VERIFIED", "ADMIN", "TECHADMIN"];

  return { orgNames, OrgPlaces, roles };
}
