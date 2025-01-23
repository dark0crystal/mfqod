// 'use client';
// // import { Link } from "@/i18n/routing";
// import { useState } from "react";
// // import { FaBars, FaTimes } from "react-icons/fa";
// // import LanguageChange from "./LangChange";
// // import { useLocale } from "next-intl";
// import NavMenu from "./NavMenu";

// type MobileMenuProps = {
//   navLinks: { direction: string; name: string }[];
// };

// export default function MobileMenu({ navLinks }: MobileMenuProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const locale = useLocale().substring(0, 2); // Get the current locale
//   const direction = locale === 'ar' ? 'rtl' : 'ltr'; // Determine direction based on the locale

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="lg:hidden relative">
//       <button onClick={toggleMenu} className="text-gray-700 bg-[#fbda5f] rounded-full p-2">
//         {isOpen ? <FaTimes className="h-8 w-8" /> : <FaBars className="h-8 w-8" />}
//       </button>
//       <div
//         className={`absolute top-16 ${direction === 'rtl' ? 'left-1/2' : 'right-1/2'} transform w-[80vw] md:w-[60vw] bg-[#fbda5f] text-black p-6 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out ${
//           isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
//         }`}
//       >
//         <div className="flex flex-col items-center space-y-4">
//           {navLinks.map((navLink, index) => (
//             <Link key={index}  href={navLink.direction} onClick={toggleMenu}>
//               <h1 className="text-xl font-black">{navLink.name}</h1>
//             </Link>
//           ))}
//           <NavMenu/>
//         </div>
//         <LanguageChange />
//       </div>
//     </div>
//   );
// }
"use client"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useState } from "react"
import Brand from "./Brand"
export default function MobileNavbar(){
    const t = useTranslations("navbar")
    const [show , setShow] = useState(false);
    return(
        <nav  className="flex items-center justify-center h-[12vh] max-h-[12vh] lg:hidden ">
            <div className="flex justify-between">
                <Brand/>

                <button onClick={handleNavbar}>
                    <div>{show ==false ? (<span>close</span>):(<span>open</span>)}</div>
                </button>
                        {/* <div className="flex items-center justify-center p-3 rounded-lg col-span-5 ">
                         
                            <Link href="/search" >
                              <div className="p-2  mx-4">
                                  <h1 className="text-[0.9rem] lg:text-[1rem] text-md text-gray-700 font-normal hover:text-blue-600">{t("search")}</h1>
                                  
                              </div>
                            </Link>
                
                            <Link href="/report-found-item" >
                              <div className="p-2  mx-4">
                                  <h1 className="text-[1rem] text-gray-700 font-normal hover:text-blue-600">{t("report")}</h1>
                              </div>
                            </Link>
                      
                        </div> */}
            </div>
        </nav>
    )
}