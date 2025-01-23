"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Brand from "./Brand";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

export default function MobileNavbar() {
  const t = useTranslations("navbar");
  const [show, setShow] = useState(false);

  const toggleNavbar = () => setShow((prev) => !prev);

  return (
    <nav className="flex items-center justify-between h-[12vh] max-h-[12vh] px-4 lg:hidden relative">
      {/* Brand Logo */}
      <Brand />

      {/* Toggle Button */}
      <button
        onClick={toggleNavbar}
        className="text-gray-700 focus:outline-none"
        aria-label="Toggle navigation menu"
      >
        {show ? <IoClose size={30} /> : <RxHamburgerMenu size={30} />}
      </button>

      {/* Dropdown Menu */}
      {show && (
        <div
          className={`absolute top-[12vh] left-0 w-full h-screen bg-blue-300 z-50 flex flex-col items-center justify-center space-y-6 p-6`}
        >
          <Link href="/search" onClick={toggleNavbar}>
            <h1 className="text-lg font-medium text-gray-700 hover:text-blue-600">
              {t("search")}
            </h1>
          </Link>

          <Link href="/report-found-item" onClick={toggleNavbar}>
            <h1 className="text-lg font-medium text-gray-700 hover:text-blue-600">
              {t("report")}
            </h1>
          </Link>
        </div>
      )}
    </nav>
  );
}
