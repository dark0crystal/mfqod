import { Link } from "@/i18n/routing";
import Brand from "./Brand";
// import LanguageChange from "./LangChange";
// import MobileMenu from "./MobileNavbar";
// import { getLocale, getTranslations } from "next-intl/server";
// import { Link } from "@/i18n/routing";
// import NavMenu from "./NavMenu";
import  {SignIn}  from "../auth/sign-in"
import { SignOut } from "../auth/sign-out";
import Profile from "./Profile";
import { FaSearch } from "react-icons/fa";




export default async function NavBar() {
  // const locale = (await getLocale()).substring(0, 2); // This will give you "ar" or "en"

  // const t = await getTranslations("Links");


  return (
    <nav  className="flex items-center justify-center h-[12vh] max-h-[12vh]">
      
      <div className='grid grid-cols-12  p-2 lg:p-2 rounded-full w-full'>
      


        {/* right section ar links */}
        <div className="flex items-center justify-center p-3 rounded-lg col-span-5 ">
         
            <Link href="/search" >
              <div className="bg-slate-300/60 rounded-3xl p-2  mx-4">
                  <h1 className="text-lg  font-normal">Search</h1>
                  
              </div>
            </Link>

            <Link href="/report-found-item" >
              <div className="bg-slate-300/60 rounded-3xl p-2  mx-4">
                  <h1 className="text-lg  font-normal">Report</h1>
                
              </div>
            </Link>
      
        </div>


          {/* Center Section Brand */}
        <div className="flex items-center justify-center col-span-2">
            <Brand />
        </div>


        {/* left section ar */}
        <div className="flex items-center justify-center p-3 rounded-lg col-span-5 ">
          <div>
          <Profile/>
          </div>
         
        </div>
        
        {/* <LanguageChange /> */}
        {/* <MobileMenu navLinks={navLinks} /> */}
      </div>
    </nav>
  );
}