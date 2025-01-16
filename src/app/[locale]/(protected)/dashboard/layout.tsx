import NavBar from "./NavBar";

import UserInfo from "./UserInfo";
export default async function Layout({children}: Readonly<{ children: React.ReactNode;}>)  {
  
   
  return (
    <>

      <main>
      <div className="grid grid-cols-3 h-screen">
         <div className="bg-violet-200 flex flex-col  items-center px-4 col-span-1">
            <UserInfo/>
            <NavBar />
        </div>
        <div className="bg-red-200 flex flex-col  items-center px-4  col-span-2">
            {children}
        </div>
        
        </div>
      </main>

    </>
  )
}