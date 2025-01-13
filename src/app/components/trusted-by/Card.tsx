import Image from "next/image"
type Card ={
    image:any
    title:string
}

export default function Card({image ,title}:Card){
    return(
        <div 
        className="relative flex flex-col justify-center items-center w-[60px] h-[50px] rounded-xl">
            <Image  src={image} alt="our clients" fill style={{objectFit:"fill"}} />
        </div>
    )
}