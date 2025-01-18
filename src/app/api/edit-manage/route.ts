import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Adjust to your Prisma instance

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;

    const record = await prisma.manage.findFirst({
      where: { userId },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}



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
