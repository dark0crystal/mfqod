import prisma from "@/lib/db";
import { NextResponse ,NextRequest } from "next/server";
export async function PATCH(req: Request) {
    try {
      const { postId, approval } = await req.json();
  
      if (!postId || approval === undefined) {
        return NextResponse.json(
          { error: "Invalid request payload" },
          { status: 400 }
        );
      }
  
      const updatedPost = await prisma.claim.update({
        where: { id: postId },
        data: { approval },
      });
  
      return NextResponse.json(updatedPost);
    } catch (error) {
      console.error("Error updating post approval:", error);
      return NextResponse.json(
        { error: "Failed to update post approval" },
        { status: 500 }
      );
    }
  }