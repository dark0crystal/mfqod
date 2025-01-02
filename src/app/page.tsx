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
import TimeBasedWords from './components/framer/TimeBaseWords';

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
<div className="relative h-[80vh] w-screen  grid grid-cols-3 grid-rows-3 gap-4 p-4 overflow-hidden">
  {/* Top Left Card */}
  <div className="flex items-center justify-center">
    <div className="w-[160px] h-[190px] rounded-2xl bg-white/30 backdrop-blur-lg shadow-lg border border-white/20 flex flex-col items-center justify-center p-4">
      <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white shadow-md">
        <Image
          src={img5}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-4 text-lg font-semibold text-black/55">baseclub.eth</p>
      <p className="text-sm text-black/55">23 422 points</p>
    </div>
  </div>

  {/* Top Center Placeholder */}
  <div className='flex items-center justify-center'>
  <TimeBasedWords/>
  </div>
  

  {/* Top Right Card */}
  <div className="flex items-center justify-center">
    <div className="w-[160px] h-[190px] rounded-2xl bg-white/30 backdrop-blur-lg shadow-lg border border-white/20 flex flex-col items-center justify-center p-4">
      <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white shadow-md">
        <Image
          src={img4}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-4 text-lg font-semibold text-black/55">baseclub.eth</p>
      <p className="text-sm text-black/55">23 422 points</p>
    </div>
  </div>

  {/* Left Middle Card */}
  {/* <div className="flex items-center justify-center">
    <div className="w-[160px] h-[190px] rounded-2xl bg-white/30 backdrop-blur-lg shadow-lg border border-white/20 flex flex-col items-center justify-center p-4">
      <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white shadow-md">
        <Image
          src={img3}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-4 text-lg font-semibold text-black/55">baseclub.eth</p>
      <p className="text-sm text-black/55">23 422 points</p>
    </div>
  </div> */}
 
  {/* Central Text */}
  <div className="flex items-center justify-center   rounded-lg col-span-3 row-span-1 mx-[20vw]">
    <p className="text-center text-lg font-semibold text-black">
      Lorem ipsumluk مtمعنا بتحصلs ullam nesciunt asperiores!
    </p>
  </div>

  {/* Right Middle Placeholder */}
 

  {/* Bottom Center Card */}
  <div></div>
  {/* <div className="flex items-center justify-center">
    <div className="w-[160px] h-[190px] rounded-2xl bg-white/30 backdrop-blur-lg shadow-lg border border-white/20 flex flex-col items-center justify-center p-4">
      <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white shadow-md">
        <Image
          src={img5}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-4 text-lg font-semibold text-white">baseclub.eth</p>
      <p className="text-sm text-white/70">23 422 points</p>
    </div>
  </div> */}

  {/* Bottom Right Card */}
  <div className="flex items-center justify-center">
    <div className="w-[160px] h-[190px] rounded-2xl bg-white/30 backdrop-blur-lg shadow-lg border border-white/20 flex flex-col items-center justify-center p-4">
      <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white shadow-md">
        <Image
          src={img4}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-4 text-lg font-semibold text-white">baseclub.eth</p>
      <p className="text-sm text-white/70">23 422 points</p>
    </div>
  </div>
</div>




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
      <p className='text-[6vw] font-bold'>مغيب شي ؟ مفقود بيساعدك</p>
      <span className="relative h-[7.5vw] aspect-[4/2] rounded-full overflow-hidden">
        <Image style={{objectFit: "cover"}} src={src} alt="image" fill/>
      </span>
    </div>
  )
}