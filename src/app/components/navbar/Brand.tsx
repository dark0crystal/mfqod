
// import { getTranslations } from "next-intl/server";
// import { Link } from "@/i18n/routing";
import { Lalezar } from "next/font/google";
import Link from "next/link";
// import { getLocale } from "next-intl/server";

const lalezarFont = Lalezar({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
  });

export default async function Brand(){
    // const locale = (await getLocale()).substring(0,2)
    // const t = await getTranslations("HomePage")
    return(
        <div className="mx-6 text-6xl ">
            <Link   className={lalezarFont.className} href='/'>مفقود</Link>
        </div>
    )
}