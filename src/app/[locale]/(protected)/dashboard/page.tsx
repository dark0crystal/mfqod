
import { auth } from "../../../../../auth";
import UserInfo from "./UserInfo";



export default async function Dashboard(){
      const session = await auth();
      if (!session) return null;
    
    return(
        <div >
           <UserInfo/>
        </div>
    )
}