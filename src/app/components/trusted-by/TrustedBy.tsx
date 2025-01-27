"use client"
import { MotionDiv } from "../MotionDiv"
import img12 from "../../../../public/img12.png"
import img13 from "../../../../public/img13.png"
import img14 from "../../../../public/img14.png"
import Card from "./Card"
import { useRef ,useEffect } from "react"
import { animate, useMotionValue,motion } from "framer-motion"
import useMeasure from "react-use-measure"
import { useTranslations } from "next-intl"
// import { useTranslations } from "next-intl"

const CardContent =[
    {title:"almoug" ,image:img12},
    {title:"almoug" ,image:img13},
    {title:"almoug" ,image:img14},
    {title:"almoug" ,image:img12},
    {title:"almoug" ,image:img14},
    
];

export default function TrustedBy() {
    const t =useTranslations("trustedBy")
    let [ref, { width }] = useMeasure();
    const xTranslation = useMotionValue(0);
  
    useEffect(() => {
      let controls;
      let finalPosition = -width / 3;
  
      controls = animate(xTranslation, [0, finalPosition], {
        ease: "linear",
        duration: 30,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
      });
  
      return controls.stop;
    }, [xTranslation, width]);
  
    return (
        <div>
            <div className="flex flex-col items-center">
            <h2 className="relative z-20 text-xl md:text-xl font-bold text-gray-600 text-center mt-6 md:mt-12">
            {t("title")}
                {/* <span className="absolute -z-10 bottom-0 left-1/2 transform -translate-x-1/2 w-full h-4 md:h-5 bg-blue-400/40"></span> */}
            </h2>
            </div>
              <div
                dir="ltr"
                className="overflow-hidden relative -z-10 h-[12vh] flex flex-col justify-center m-16"
              >
                {/* Gradient effect from both sides */}
                <div className="absolute z-20 inset-0 bg-gradient-to-r from-[#fff] via-transparent to-[#fff]"></div>
      
              <motion.div
                className="flex gap-16 w-max"
                ref={ref}
                style={{ x: xTranslation }}
              >
                {/* Duplicate the cards */}
                {[...CardContent, ...CardContent, ...CardContent].map(
                  (content, index) => (
                    <Card key={index} title={content.title} image={content.image} />
                  )
                )}
              </motion.div>
          </div>
      </div>
    );
  }
  