"use client"
import { useState } from "react"
import NavBar from "./NavBar"
export default function MobileSideBar(){

    const [show ,setShow] = useState(false)

   function handleShow(){
    setShow(!show)
   }

    return(
        <div>
        <button onClick={handleShow}>
        nav
      </button>
      {show &&
        <div className="h-screen w-screen bg-white">
            <NavBar />
        </div>
      }

        </div>
    )
}