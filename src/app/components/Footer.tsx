"use client"
import Brand from "./navbar/Brand";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";



// Footer component
export default function Footer() {
  const t =useTranslations("footer");


  // Data arrays for the links
const quickLinks = [
  { href: "/", label: "" },
  { href: "/report-found-item", label: `${t("report")}` },
  { href: "/search", label: `${t("search")}` },
];

const privacyLinks = [
  { href: "/legal/privacy", label: `${t("privacy")}` },
  { href: "/legal/terms", label: `${t("terms")}`},
];

const otherLinks = [
  { href: "/dashboard", label: `${t("dashboard")}` },
  { href: "/", label: `${t("Register")}` },
];

  return (
    <footer className="text-gray-500 py-10 px-12 mt-20 border-t-2">
      <div className="flex flex-col lg:flex-row  ">
        {/* Brand and Language Change */}
        <div className="p-4">
          <div>
            <Brand />
            <p className="text-sm text-gray-500">
              مفقود هو موقع لمساعدة الأشخاص للحصول على مفقوداتهم
            </p>
          </div>
          <div className="my-3">
            <h1>غير اللغة</h1>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row">
          {/* Quick Links */}
          <div className="mx-4">
            <h1 className="text-black mb-4">{t("quickLinks")}</h1>
            {quickLinks.map((link, index) => (
              <div key={index}>
                <Link href={link.href}>{link.label}</Link>
              </div>
            ))}
          </div>

          {/* Privacy and Terms */}
          <div className="mx-4">
            <h1 className="text-black mb-4">{t("privacyTitle")}</h1>
            {privacyLinks.map((link, index) => (
              <div key={index}>
                {link.label && <Link href={link.href}>{link.label}</Link>}
              </div>
            ))}
          </div>

          {/* Other Links */}
          <div className="mx-4">
            <h1 className="text-black mb-4">{t("seeAlso")}</h1>
            {otherLinks.map((link, index) => (
              <div key={index}>
                <Link href={link.href}>{link.label}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
