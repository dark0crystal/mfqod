"use client"
// components/TrustedBy.js
import Image from "next/image";
import { motion } from "framer-motion";
import img10 from "../../../public/img10.png"
import img11 from "../../../public/img11.png"
import img12 from "../../../public/img12.png"
import img13 from "../../../public/img13.png"
import img14 from "../../../public/img14.png"


export default function TrustedBy() {
  return (
    <div className=" py-8">
      <h2 className="text-center text-white text-2xl font-semibold mb-6">
        Trusted by
      </h2>
      <div className="overflow-hidden">
        <motion.div
          className="flex space-x-12 w-max"
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        >
         
            <Image
            width={50}
            height={30}
              src={img10}
              alt="Logo"
              className="h-12 opacity-80 hover:opacity-100 transition duration-300"
            />
            <Image
            width={50}
            height={30}
              src={img11}
              alt="Logo"
              className="h-12 opacity-80 hover:opacity-100 transition duration-300"
            />
        
        <Image
            width={50}
            height={30}
              src={img12}
              alt="Logo"
              className="h-12 opacity-80 hover:opacity-100 transition duration-300"
            />
        <Image
            width={50}
            height={30}
              src={img13}
              alt="Logo"
              className="h-12 opacity-80 hover:opacity-100 transition duration-300"
            />
            <Image
            width={50}
            height={30}
              src={img14}
              alt="Logo"
              className="h-12 opacity-80 hover:opacity-100 transition duration-300"
            />
            <Image
            width={50}
            height={30}
              src={img11}
              alt="Logo"
              className="h-12 opacity-80 hover:opacity-100 transition duration-300"
            />
        
        
        </motion.div>
      </div>
    </div>
  );
}
