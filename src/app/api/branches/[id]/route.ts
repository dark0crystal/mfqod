import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/../auth";

const ALLOWED_ROLES = ["TECHADMIN", "ADMIN"];

function canManageBranches(role: string | null): boolean {
  return role !== null && ALLOWED_ROLES.includes(role);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!canManageBranches(user?.role ?? null)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        country: { select: { id: true, nameEn: true, nameAr: true, code: true } },
        userBranches: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    });
    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }
    return NextResponse.json(branch);
  } catch (error) {
    console.error("Error fetching branch:", error);
    return NextResponse.json(
      { error: "Failed to fetch branch" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!canManageBranches(user?.role ?? null)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      name,
      nameEn,
      nameAr,
      descriptionEn,
      descriptionAr,
      countryId,
      address,
      latitude,
      longitude,
      description,
      imageUrl,
    } = body as {
      name?: string;
      nameEn?: string;
      nameAr?: string;
      descriptionEn?: string | null;
      descriptionAr?: string | null;
      countryId?: string | null;
      address?: string | null;
      latitude?: number;
      longitude?: number;
      description?: string | null;
      imageUrl?: string | null;
    };
    const updates: Record<string, unknown> = {};
    if (nameEn !== undefined || name !== undefined) {
      const en = (nameEn ?? name)?.trim();
      if (en) updates.nameEn = en;
    }
    if (nameAr !== undefined) updates.nameAr = nameAr?.trim() || null;
    if (descriptionEn !== undefined) updates.descriptionEn = descriptionEn?.trim() ?? null;
    if (descriptionAr !== undefined) updates.descriptionAr = descriptionAr?.trim() ?? null;
    if (countryId !== undefined) {
      updates.countryId = countryId && String(countryId).trim() ? countryId.trim() : null;
    }
    if (address !== undefined) updates.address = address?.trim() ?? null;
    if (typeof latitude === "number") updates.latitude = latitude;
    if (typeof longitude === "number") updates.longitude = longitude;
    if (description !== undefined) updates.description = description?.trim() ?? null;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl && String(imageUrl).trim() ? imageUrl.trim() : null;

    const branch = await prisma.branch.update({
      where: { id },
      data: updates as Parameters<typeof prisma.branch.update>[0]["data"],
      include: {
        country: { select: { id: true, nameEn: true, nameAr: true, code: true } },
      },
    });
    return NextResponse.json(branch);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }
    console.error("Error updating branch:", error);
    return NextResponse.json(
      { error: "Failed to update branch" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!canManageBranches(user?.role ?? null)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await params;
    await prisma.branch.delete({ where: { id } });
    return NextResponse.json({ message: "Branch deleted" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }
    console.error("Error deleting branch:", error);
    return NextResponse.json(
      { error: "Failed to delete branch" },
      { status: 500 }
    );
  }
}
