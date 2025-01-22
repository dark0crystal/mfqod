"use client"
import { Link } from "@/i18n/routing";
import {auth} from "../../../../auth"
import Image from "next/image";
import { useSession } from "next-auth/react";
import { SignOut } from "../auth/client/signout-button";
import { SignIn } from "../auth/client/signin-button";
import defaultProfileImage from "../../../../public/img2.jpeg"
import { useState } from "react";
export default  function Profile(){
    const [show , setShow] = useState(false)
    const session =useSession();
    function handleProfile(){
        setShow(!show)
    }

    return(
        <div>
            {session.status == "unauthenticated" ? (
                <div>
                    <SignIn/>
                </div>
             
            ):(
                <div>
                    <button onClick={handleProfile} className="relative w-[40px] h-[40px] overflow-hidden rounded-xl"> 
                        pro
                        <Image fill objectFit="cover" alt="profile image" src={session.data?.user?.image || defaultProfileImage }/>
                    </button>
                    {show &&(
                       <div className="flex flex-col items-center"> 
                            <div className="">
                                    Dashboard
                            </div>
                            <div className="">
                                user email
                            </div>  
                            <div className="">
                                <SignOut/>
                            </div>

                       </div> 
                    )}
                  
                </div>
                 
                
            )}
          

        </div>
    )

}