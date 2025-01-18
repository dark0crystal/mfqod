import { NextRequest ,NextResponse} from "next/server";
import prisma from "@/lib/db";
export default async function GET(req:NextRequest){
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if(!userId) return null;

    try {
        const userRole = await prisma.user.findUnique({
            where:{
                id:userId

            },
            select:{
                role:true
            }
            
        });
        if(userRole){
            return NextResponse.json({userRole:userRole})

        }

        return NextResponse.json({ error: 'User Role not found' }, { status: 500 });

    } catch (error) {
        console.log(error)
    }
}