import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail") ?? ""; 

  try {
    // Find users whose email contains the provided substring (case-insensitive)
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: userEmail,
          mode: "insensitive", // Case-insensitive matching
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        manage: {
          select: {
            place: true,
            orgnization: true,
          },
        },
        userBranches: {
          select: {
            branch: { select: { id: true, nameEn: true, nameAr: true } },
          },
        },
        _count: {
          select: { post: true, claim: true },
        },
      },
    });

    const serialized = users.map((u) => {
      const [firstManage] = u.manage;
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        image: u.image,
        role: u.role,
        managing: firstManage
          ? { place: firstManage.place, orgnization: firstManage.orgnization }
          : null,
        branches: u.userBranches.map((ub) => ({
          id: ub.branch.id,
          name: ub.branch.nameEn,
          nameEn: ub.branch.nameEn,
          nameAr: ub.branch.nameAr,
        })),
        postsCount: u._count.post,
        claimsCount: u._count.claim,
      };
    });

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
