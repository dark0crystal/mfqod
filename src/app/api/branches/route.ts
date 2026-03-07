import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/../auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const countryId = searchParams.get("countryId");
  try {
    const branches = await prisma.branch.findMany({
      where: countryId ? { countryId } : undefined,
      orderBy: { nameEn: "asc" },
      include: {
        country: { select: { id: true, nameEn: true, nameAr: true, code: true } },
        userBranches: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });
    return NextResponse.json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches" },
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
  if (user?.role !== "TECHADMIN" && user?.role !== "ADMIN") {
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
    const en = (nameEn ?? name)?.trim();
    const ar = (nameAr ?? name)?.trim();
    if (!en) {
      return NextResponse.json(
        { error: "Branch name (English) is required" },
        { status: 400 }
      );
    }
    const branch = await prisma.branch.create({
      data: {
        nameEn: en,
        nameAr: ar || null,
        descriptionEn: descriptionEn?.trim() ?? null,
        descriptionAr: descriptionAr?.trim() ?? null,
        countryId: countryId && String(countryId).trim() ? countryId.trim() : null,
        address: address?.trim() ?? null,
        latitude: typeof latitude === "number" ? latitude : 0,
        longitude: typeof longitude === "number" ? longitude : 0,
        description: description?.trim() ?? null,
        imageUrl: imageUrl && String(imageUrl).trim() ? imageUrl.trim() : null,
      },
      include: {
        country: { select: { id: true, nameEn: true, nameAr: true, code: true } },
      },
    });
    return NextResponse.json(branch);
  } catch (error) {
    console.error("Error creating branch:", error);
    return NextResponse.json(
      { error: "Failed to create branch" },
      { status: 500 }
    );
  }
}
