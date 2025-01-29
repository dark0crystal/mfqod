import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return new Response("userId is required", { status: 400 });
    }

    try {
        const userRole = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!userRole) {
            return NextResponse.json({ error: "User role not found" }, { status: 404 });
        }

        return NextResponse.json({ userRole });

    } catch (error) {
        console.error("Error fetching user role:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
