
import { auth } from "../../../../../auth";
import UserInfo from "./UserInfo";

import {redirect} from '@/i18n/routing';
import { getLocale } from "next-intl/server"; 

export default async function Dashboard(){
      const session = await auth();
      const locale = await getLocale();   
      if (!session){
        redirect({href: '/login', locale:`${locale}`});
      }

    
    return(
        <div >
           <UserInfo/>
        </div>
    )
}