import NavBar from "./NavBar";
import { auth } from "../../../../../auth";
import Image from "next/image";
import img1 from "../../../../../public/img1.jpeg"
export default async function Dashboard(){
      const session = await auth();
      if (!session) return null;
    
    return(
        <div >
            <div className="">
            <div>
                <NavBar userId={session.user?.id}/>
            </div>
           
            <div>
                <div>
                <p>{session.user?.email}</p>
                <p>{session.user?.id}</p>
                {
                    session.user?.image == null ?(
                        <div>
                        <Image src={img1} alt="use profile img" height={30} width={30}/>
                        </div>
                    ):(
               
                        <div>                  
                             <Image src={session.user?.image} alt="use profile img" height={30} width={30}/>
                        </div> 
                    )}               
                </div>
            </div>
          </div>
        </div>
    )
}