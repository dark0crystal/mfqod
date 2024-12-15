import Link from "next/link";
import Brand from "./Brand";
// import LanguageChange from "./LangChange";
// import MobileMenu from "./MobileNavbar";
// import { getLocale, getTranslations } from "next-intl/server";
// import { Link } from "@/i18n/routing";
import NavMenu from "./NavMenu";
import  {SignIn}  from "../auth/sign-in"
import { SignOut } from "../auth/sign-out";




export default async function NavBar() {
  // const locale = (await getLocale()).substring(0, 2); // This will give you "ar" or "en"

  // const t = await getTranslations("Links");
  const navLinks = [
    { direction: "/search", name: "Search" },
    { direction: "/", name: "Main" },
    { direction: "/report-found-item", name:"report-found-item" },
    { direction: "/dashboard", name:"dashboard" },
    
  ];

  return (
    <nav  className="flex items-center justify-center mt-6">
      
      <div className='flex items-center justify-between p-2 lg:p-2 rounded-full w-[90vw] md:w-[80vw]  '>
        <div className="flex items-center">
          <Brand />
        </div>
        <div className="hidden lg:flex items-center  bg-red-50 p-3 rounded-lg">
          {navLinks.map((navLink, index) => (
            <Link href={navLink.direction} key={index}>
              <h1 className="text-lg  mx-4 font-normal">{navLink.name}</h1>
            </Link>
            
          ))}
          
          <NavMenu />
         <SignIn/>
          <SignOut/>
         
        </div>
        {/* <LanguageChange /> */}
        {/* <MobileMenu navLinks={navLinks} /> */}
      </div>
    </nav>
  );
}