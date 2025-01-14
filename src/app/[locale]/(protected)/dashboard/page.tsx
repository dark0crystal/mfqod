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
            <div className="bg-violet-200">
                <NavBar userId={session.user?.id}/>
            </div>
           
            <div className="bg-orange-200 col-span-2 flex flex-col items-center p-4">
                <div className="flex flex-col justify-center items-center w-[40vw] h-fit p-8 mt-32 rounded-3xl bg-slate-400">
                <div>
               
              
                {
                    session.user?.image == null ?(
                        <div>
                        <Image src={img2} alt="use profile img" height={40} width={40}/>
                        </div>
                    ):(
               
                        <div>                  
                             <Image src={session.user?.image} alt="use profile img" height={40} width={40}/>
                        </div> 
                    )}               
                </div>
                <div>
                    <p className="text-sm md:text-xl ">{session.user?.email}</p>
                </div>

                </div>
                
            </div>
          </div>
        </div>
    )
}