"use client";

import { useState, useEffect } from "react";

type Branch = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  address: string | null;
  countryId: string | null;
  country: { id: string; nameEn: string; nameAr: string | null; code: string | null } | null;
};

export default function DataProvider() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    fetch("/api/branches")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]));
  }, []);

  const roles = ["BASIC", "VERIFIED", "ADMIN", "TECHADMIN"];

  // Group branches by country for dropdowns
  const branchesByCountry = branches.reduce<Record<string, Branch[]>>((acc, b) => {
    const key = b.country?.id ?? "none";
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  const countryMap = new Map<string, { id: string; nameEn: string; code: string | null }>();
  branches.forEach((b) => {
    if (b.country) countryMap.set(b.country.id, b.country);
  });
  const countryList = Array.from(countryMap.values());

  return { branches, branchesByCountry, countryList, roles };
}
