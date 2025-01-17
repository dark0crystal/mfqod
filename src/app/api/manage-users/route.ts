import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail") ?? ""; 

  try {
    // Find users whose email contains the provided substring (case-insensitive)
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: userEmail,
          mode: "insensitive", // Case-insensitive matching
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role:true
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
