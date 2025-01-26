
import MobileSideBar from "./MobileSideBar";
import NavBar from "./NavBar";

export default async function Layout({children}: Readonly<{ children: React.ReactNode;}>)  {
  
  return (
    <>

      <main>
      <div className="grid grid-cols-3 h-screen">
         <div className=" border bottom-2 lg:flex flex-col  items-center px-4 hidden lg:col-span-1">
            
            <NavBar />
        </div>
        
        {/* <MobileSideBar/> */}

        <div className=" flex flex-col  items-center px-4 col-span-3  lg:col-span-2">
            {children}
        </div>
        
        </div>
      </main>

    </>
  )
}