import { NextResponse , NextRequest } from "next/server";


export default async function POST(req:NextRequest , res:NextResponse){

    const {userId , body} = await req.json();


    return NextResponse.json({massage: "User is goog" }, { status: 200 });
}