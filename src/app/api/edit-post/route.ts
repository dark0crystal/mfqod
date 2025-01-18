import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { boolean } from "zod";

export default async function PUT(req:NextRequest){

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const approval = searchParams.get('approval')

    try {
    if(postId && approval=="true"){
       
        const response = await  prisma.post.update({
        where:{ id:postId },
        data:{ approval :true}
        });
        return NextResponse.json({response});
     }else if(postId && approval=="false"){
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