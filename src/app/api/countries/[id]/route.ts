import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/../auth";

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
  if (user?.role !== "TECHADMIN") {
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
      code,
    } = body as {
      name?: string;
      nameEn?: string;
      nameAr?: string;
      descriptionEn?: string | null;
      descriptionAr?: string | null;
      code?: string;
    };
    const en = (nameEn ?? name)?.trim();
    const ar = (nameAr ?? name)?.trim();
    if (!en) {
      return NextResponse.json(
        { error: "Country name (English) is required" },
        { status: 400 }
      );
    }
    const country = await prisma.country.update({
      where: { id },
      data: {
        nameEn: en,
        nameAr: ar || null,
        descriptionEn: descriptionEn?.trim() ?? undefined,
        descriptionAr: descriptionAr?.trim() ?? undefined,
        code: code?.trim() ?? undefined,
      },
    });
    return NextResponse.json(country);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A country with this name already exists" },
        { status: 409 }
      );
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }
    console.error("Error updating country:", error);
    return NextResponse.json(
      { error: "Failed to update country" },
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
  if (user?.role !== "TECHADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await params;
    await prisma.country.delete({ where: { id } });
    return NextResponse.json({ message: "Country deleted" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }
    console.error("Error deleting country:", error);
    return NextResponse.json(
      { error: "Failed to delete country" },
      { status: 500 }
    );
  }
}
