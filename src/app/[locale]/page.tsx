// 'use client'
// import { useScroll, useTransform, motion } from 'framer-motion';
import img1 from "../../../public/img1.jpeg"
import img2 from "../../../public/img2.jpeg"
import img3 from "../../../public/img3.jpeg"
import img4 from "../../../public/img4.jpeg"
import img5 from "../../../public/img5.jpeg"
// import Lenis from 'lenis';

import Image from 'next/image';
// import { useEffect, useRef } from 'react';
import TimeBasedWords from './components/framer/TimeBaseWords';
import CardsSection from './components/CardSection';
import TrustedBy from './components/trusted-by/TrustedBy';

export default function Home() {

  // const container = useRef();
  // const { scrollYProgress } = useScroll({
  //   target: container,
  //   offset: ['start end', 'end start']
  // })

  // useEffect( () => {
  //   const lenis = new Lenis()

  //   function raf(time:any) {
  //     lenis.raf(time)
  //     requestAnimationFrame(raf)
  //   }

  //   requestAnimationFrame(raf)
  // }, [])

  return (
    <main className="overflow-hidden flex flex-col justify-center "> 
      <div className="relative h-[58vh] w-screen  mt-20 p-4 overflow-hidden">
        <div className='flex justify-center my-2 items-center'>
        <TimeBasedWords/>
        </div>
        {/* Central Text */}
        <p className="text-center text-4xl font-extrabold text-black">
          مغيّب شي ؟ مفقود بيساعدك 
          

          </p>
        <div className="flex flex-col items-center justify-center mt-2 rounded-lg  ">
          <p className="text-center text-lg font-semibold text-black">
          مغيّب شي ؟ مفقود بيساعدك 
          مغيّب شي ؟ مفقود بيساعدك 
          </p>
          <p className="text-center text-lg font-semibold text-black">
          مغيّب شي ؟ مفقود بيساعدك 
          </p>
          
        </div>

        {/* Bottom Center Card */}
        <div className='flex flex-row gap-4 items-center justify-center mt-16'>
          <FoundButton/>
        
          <SearchButton/>
        </div>
      

        {/* Bottom Right Card */}
        
      </div>

     
    <div>
    <CardsSection/>
    </div>


    <div>
      <TrustedBy/>
    </div>
      <div className='h-[20vh]'/>
      <div className='h-[15vh] w-screen bg-blue-500'>

      </div>
      {/* <div ref={container}>
        <Slide src={img5} direction={'left'} left={"-40%"} progress={scrollYProgress}/>
        <Slide src={img2} direction={'right'} left={"-25%"} progress={scrollYProgress}/>
        <Slide src={img3} direction={'left'}  left={"-75%"} progress={scrollYProgress}/>
      </div> */}
      <div className='h-[20vh]' />
    </main>
  );
}

// const Slide = (props:any) => {
//   const direction = props.direction == 'left' ? -1 : 1;
//   const translateX = useTransform(props.progress, [0, 1], [150 * direction, -150 * direction])
//   return (
//     <motion.div style={{x: translateX, left: props.left}} className="relative flex whitespace-nowrap">
//       <Phrase src={props.src}/>
//       <Phrase src={props.src}/>
//       <Phrase src={props.src}/>
//     </motion.div>
//   )
// }

// const Phrase = ({src}:any) => {

//   return (
//     <div className={'px-5 flex gap-5 items-center'}>
//       <p className='text-[6vw] text-black/44 font-bold'>مغيب شي ؟ مفقود بيساعدك</p>
//       <span className="relative h-[7.5vw] aspect-[4/2] rounded-full overflow-hidden">
//         <Image style={{objectFit: "cover"}} src={src} alt="image" fill/>
//       </span>
//     </div>
//   )
// }


function FoundButton() {
  return (
    <div className="bg-gradient-to-r from-[#ff5722] to-[#f44336] p-4 rounded-xl text-white font-semibold text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
      <h1>بلغ عن شيء مفقود</h1>
    </div>
  );
}

function SearchButton() {
  return (
    <div className="bg-gradient-to-r from-[#2196f3] to-[#4caf50] p-4 rounded-xl text-white font-semibold text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
      إبحث عن شيء مفقود
    </div>
  );
}
