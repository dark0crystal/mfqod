"use client";

import { useTranslations } from "next-intl";

export default function DataProvider() {
  const t = useTranslations("storage"); // Assuming translations are under a "common" namespace

  // Translated organization names
  const orgNames = [
    { key: "SQU", name: t("org.SQU") },
    { key: "UTAS Muscat", name: t("org.UTAS Muscat") },
    { key: "UTAS Ibra", name: t("org.UTAS Ibra") },
    { key: "Bin Omair", name: t("org.Bin Omair") },
    { key: "UTAS Nizwa", name: t("org.UTAS Nizwa") },
  ];

  // Translated organization places
  const OrgPlaces = [
    { key: "SQU", places: [{key:"SQU Library",name:t("place.SQU Library")}, {key:"SQU Lost and Found Department",name:t("place.SQU Lost and Found Department")}] },
    {
      key: "UTAS Muscat",
      places: [{key:"UTAS Muscat Library" , name:t("place.UTAS Muscat Library")}, {key:"UTAS Muscat Lost and Found Department",name:t("place.UTAS Muscat Lost and Found Department")}],
    },
    {
      key: "UTAS Ibra",
      places: [{key:"UTAS Ibra Library",name:t("place.UTAS Ibra Library")}, {key:"UTAS Ibra Lost and Found Department",name:t("place.UTAS Ibra Lost and Found Department")}],
    },
    {
      key: "Bin Omair",
      places: [{key:"Bin Omair Library",name:t("place.Bin Omair Library")}],
    },
    {
      key: "UTAS Nizwa",
      places: [{key:"UTAS Nizwa Library",name:t("place.UTAS Nizwa Library")}, {key:"UTAS Nizwa Lost and Found Department",name:t("place.UTAS Nizwa Lost and Found Department")}],
    },
  ];

  // Roles (no translation needed)
  const roles = ["BASIC", "VERIFIED", "ADMIN", "TECHADMIN"];

  return { orgNames, OrgPlaces, roles };
}
