import { Link } from "@/i18n/routing";
import {auth} from "../../../../auth"
import  {SignIn}  from "../auth/sign-in"
import { SignOut } from "../auth/sign-out";
export default async function Profile(){
    const session = auth();


    return(
        <div>
             <SignIn/>
             <SignOut/>
        </div>
    )

}