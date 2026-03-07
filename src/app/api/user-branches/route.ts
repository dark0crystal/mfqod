import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/../auth";

/** GET: list branches assigned to a user (query: userId) */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      { error: "userId query is required" },
      { status: 400 }
    );
  }
  const isTechAdmin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  }).then((u) => u?.role === "TECHADMIN");
  if (!isTechAdmin && session.user.id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const userBranches = await prisma.userBranch.findMany({
      where: { userId },
      include: {
        branch: {
          include: {
            country: { select: { id: true, nameEn: true, nameAr: true, code: true } },
          },
        },
      },
    });
    return NextResponse.json(userBranches);
  } catch (error) {
    console.error("Error fetching user branches:", error);
    return NextResponse.json(
      { error: "Failed to fetch user branches" },
      { status: 500 }
    );
  }
}

/** POST: assign a branch to a user (body: { userId, branchId }) */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "TECHADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { userId, branchId } = body as { userId?: string; branchId?: string };
    if (!userId || !branchId) {
      return NextResponse.json(
        { error: "userId and branchId are required" },
        { status: 400 }
      );
    }
    const userBranch = await prisma.userBranch.create({
      data: { userId, branchId },
      include: {
        branch: {
          include: {
            country: { select: { id: true, nameEn: true, nameAr: true, code: true } },
          },
        },
      },
    });
    return NextResponse.json(userBranch);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "User is already assigned to this branch" },
        { status: 409 }
      );
    }
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "User or branch not found" },
        { status: 404 }
      );
    }
    console.error("Error assigning branch:", error);
    return NextResponse.json(
      { error: "Failed to assign branch" },
      { status: 500 }
    );
  }
}

/** DELETE: unassign a branch from a user (query: userId, branchId) */
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "TECHADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const branchId = searchParams.get("branchId");
  if (!userId || !branchId) {
    return NextResponse.json(
      { error: "userId and branchId query params are required" },
      { status: 400 }
    );
  }
  try {
    await prisma.userBranch.delete({
      where: {
        userId_branchId: { userId, branchId },
      },
    });
    return NextResponse.json({ message: "Branch unassigned" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }
    console.error("Error unassigning branch:", error);
    return NextResponse.json(
      { error: "Failed to unassign branch" },
      { status: 500 }
    );
  }
}
