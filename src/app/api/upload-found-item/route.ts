
import {auth} from "../../../../auth"
import prisma from "@/lib/db";
import { NextRequest ,NextResponse } from "next/server";

interface newItem{
    title: string;
    content: string;
    type: string;
    // photo: File;
    place: string;
    country: string;
    orgnization: string;

} 
export async function POST(req: NextRequest){
    const body  = await req.json() as newItem
    const session = await auth();
    console.log(body)
    await prisma.post.create({
        data:{
            userId:session?.user?.id,
            title:body.title,
            content:body.content,
            type: body.type,

        }
    })
    return NextResponse.json("good" , {status:200})
    
}