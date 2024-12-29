"use client"
import { useRef } from "react";
import {motion ,useScroll} from "framer-motion"
  const container = useRef();

  const { scrollYProgress } = useScroll({

    target: container,

    offset: ['start end', 'end start']

  })
export const MotionDiv = motion.div ;