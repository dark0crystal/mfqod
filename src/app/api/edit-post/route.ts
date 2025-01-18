import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export default async function GET(req:NextRequest){

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const approval = searchParams.get('approval')
    console.log("inside api" ,approval ,postId)

    try {
    if(postId && approval==="true"){
       console.log("inside true")
        const response = await  prisma.post.update({
        where:{ id:postId },
        data:{ approval :true}
        });
        return NextResponse.json({response});
     }else if(postId && approval==="false"){
        console.log("inside false")
        const response = await  prisma.post.update({
            where:{ id:postId },
            data:{ approval :false}
          });
          return NextResponse.json({response});
        
    }
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });   
    }
}