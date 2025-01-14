import { auth } from "../../../../auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface NewItem {
  claimTitle: string;
  claimContent: string;
  postId:string
  
}

export async function POST(req: NextRequest) {
  const {postId  ,body} = await req.json();
  
  const session = await auth();
    console.log(body.claimContent)
  // Ensure that the user is authenticated before posting
  if (!session?.user?.id) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }
//    // Validate the input
//    if (!body.claimTitle || !body.claimContent || !body.postId) {
//     return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//   }
  console.log("content",body.claimContent)
  console.log("title",body.claimTitle)
  console.log("post id",postId)
  console.log("user id",session.user.id)

  try {
    // Create a new claim in the database
    const newClaim = await prisma.claim.create({
      data: {
        userId: session.user.id,
        postId: postId,
        claimTitle: body.claimTitle,
        claimContent: body.claimContent,
        
      },
      select:{
        id:true
      }
    });

    console.log(newClaim.id)

    // Return the new post ID in the response
    return NextResponse.json({ message: "claim created successfully", claimId: newClaim.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating claim:", error);
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 });
  }
}
