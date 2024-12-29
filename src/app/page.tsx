'use client'
import { useScroll, useTransform, motion } from 'framer-motion';
import img1 from "../../public/img1.jpeg"
import img2 from "../../public/img2.jpeg"
import img3 from "../../public/img3.jpeg"
import img4 from "../../public/img4.jpeg"
import img5 from "../../public/img5.jpeg"
import Lenis from 'lenis';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function Home() {

  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  })

  useEffect( () => {
    const lenis = new Lenis()

    function raf(time:any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <main className="overflow-hidden">
      <div className='h-[100vh]'/>
      <div ref={container}>
        <Slide src={img5} direction={'left'} left={"-40%"} progress={scrollYProgress}/>
        <Slide src={img2} direction={'right'} left={"-25%"} progress={scrollYProgress}/>
        <Slide src={img3} direction={'left'}  left={"-75%"} progress={scrollYProgress}/>
      </div>
      <div className='h-[100vh]' />
    </main>
  );
}

const Slide = (props:any) => {
  const direction = props.direction == 'left' ? -1 : 1;
  const translateX = useTransform(props.progress, [0, 1], [150 * direction, -150 * direction])
  return (
    <motion.div style={{x: translateX, left: props.left}} className="relative flex whitespace-nowrap">
      <Phrase src={props.src}/>
      <Phrase src={props.src}/>
      <Phrase src={props.src}/>
    </motion.div>
  )
}

const Phrase = ({src}:any) => {

  return (
    <div className={'px-5 flex gap-5 items-center'}>
      <p className='text-[7.5vw]'>مغيب شي ؟ مفقود بيساعدك</p>
      <span className="relative h-[7.5vw] aspect-[4/2] rounded-full overflow-hidden">
        <Image style={{objectFit: "cover"}} src={src} alt="image" fill/>
      </span>
    </div>
  )
}