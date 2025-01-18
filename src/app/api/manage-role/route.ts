import { auth } from "../../../../auth"; // Replace with your actual auth function
import prisma from "@/lib/db"; // Replace with your Prisma setup
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { userId, role } = await req.json();

  // Authenticate the user
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  // Validate the input
  if (!userId || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    // Update the user's role in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json(
      { message: "User role updated successfully", userId: updatedUser.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
