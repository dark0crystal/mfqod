import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, body } = await req.json();

    // Update the record
    await prisma.manage.update({
      where: { userId },
      data: {
        orgnization: body.org,
        place: body.place,
      },
    });

    return NextResponse.json({ message: "User management updated successfully" });
  } catch (error) {
    console.error("Error updating user management:", error);
    return NextResponse.json({ error: "Failed to update user management" }, { status: 500 });
  }
}
