import NavBar from "./NavBar";
import { auth } from "../../../../../auth";
import img2 from "../../../../../public/img2.jpeg"
import UserInfo from "./UserInfo";
import NavbarSlider from "./NavbarSlider";
export default async function Layout({children}: Readonly<{ children: React.ReactNode;}>)  {
    const session = await auth();
    if (!session) return null;
  return (
    <>

      <main>
      <div className="grid grid-cols-3 h-screen">
         <div className="bg-violet-200 flex flex-col  items-center px-4 col-span-1">
            <UserInfo/>
            <NavBar userId={session.user?.id}/>
        </div>
        <div className="bg-red-200 flex flex-col  items-center px-4  col-span-2">
            {children}
        </div>
        
        </div>
      </main>

    </>
  )
}