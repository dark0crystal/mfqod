
import { auth } from "../../../../../auth";



export default async function Dashboard(){
      const session = await auth();
      if (!session) return null;
    
    return(
        <div >
           index page
        </div>
    )
}