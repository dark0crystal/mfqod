import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/../auth";

export async function GET() {
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
    const countries = await prisma.country.findMany({
      orderBy: { nameEn: "asc" },
      include: { _count: { select: { branches: true } } },
    });
    return NextResponse.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}

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
    const country = await prisma.country.create({
      data: {
        nameEn: en,
        nameAr: ar || null,
        descriptionEn: descriptionEn?.trim() || null,
        descriptionAr: descriptionAr?.trim() || null,
        code: code?.trim() || null,
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
    console.error("Error creating country:", error);
    return NextResponse.json(
      { error: "Failed to create country" },
      { status: 500 }
    );
  }
}
