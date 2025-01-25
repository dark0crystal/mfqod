import prisma from "@/lib/db";
import { NextResponse ,NextRequest } from "next/server";
export async function PATCH(req: Request) {
    try {
      const { claimId, approval } = await req.json();
  
      if (!claimId || approval === undefined) {
        return NextResponse.json(
          { error: "Invalid request payload" },
          { status: 400 }
        );
      }
  
      const updatedPost = await prisma.claim.update({
        where: { id: claimId },
        data: { approved:approval },
      });
  
      return NextResponse.json(updatedPost);
    } catch (error) {
      console.error("Error updating claim approval:", error);
      return NextResponse.json(
        { error: "Failed to update claim approval" },
        { status: 500 }
      );
    }
  }