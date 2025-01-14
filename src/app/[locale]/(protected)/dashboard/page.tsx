import NavBar from "./NavBar";
import { auth } from "../../../../../auth";
import Image from "next/image";
import img2 from "../../../../../public/img2.jpeg"
export default async function Dashboard(){
      const session = await auth();
      if (!session) return null;
    
    return(
        <div >
            <div className="grid grid-cols-3 h-screen">
            <div className="bg-violet-200 flex flex-col  items-center px-4">
            <div className="flex flex-col justify-center items-center w-full h-fit p-8 mt-12 rounded-3xl bg-slate-400/40">
                <div>
               
              
                {
                    session.user?.image == null ?(
                        <div className="relative rounded-full w-[60px] h-[60px] overflow-hidden">
                            <Image src={img2} alt="use profile img" className="absolute" fill objectFit="cover"/>
                        </div>
                    ):(
               
                        <div className="relative rounded-full w-[60px] h-[60px] overflow-hidden">                  
                             <Image src={session.user?.image} alt="use profile img" className="absolute" fill objectFit="cover"/>
                        </div> 
                    )}               
                </div>
                <div>
                    <p className="text-sm md:text-xl ">{session.user?.name}</p>
                </div>
                <div>
                    <p className="text-sm text-black/70 md:text-lg ">{session.user?.email}</p>
                </div>
                
                </div>
                <NavBar userId={session.user?.id}/>
            </div>
           
            <div className="bg-orange-200 col-span-2 flex flex-col items-center p-4">
                
                
            </div>
          </div>
        </div>
    )
}