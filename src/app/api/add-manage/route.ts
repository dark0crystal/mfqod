import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Adjust the path to your Prisma instance

export async function POST(req: Request) {
  try {
    const { userId, body } = await req.json();

    // Insert into the `manage` table
    await prisma.manage.create({
      data: {
        userId,
        orgnization: body.org,
        place: body.place,
      },
    });

    return NextResponse.json({ message: "User management added successfully" });
  } catch (error) {
    console.error("Error adding user management:", error);
    return NextResponse.json({ error: "Failed to add user management" }, { status: 500 });
  }
}
