import prisma from "@/lib/db";

export async function getUserRoleAndManagedPlaces(userId: string) {
  const userWithManage = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      role: true,
      manage: {
        take: 1,
        select: {
          place: true,
          orgnization: true,
        },
      },
    },
  });

  if (!userWithManage) {
    throw new Error("User not found");
  }

  const [firstManage] = userWithManage.manage;

  let assignedBranches: { id: string; name: string }[] = [];
  try {
    const userBranches = await prisma.userBranch.findMany({
      where: { userId },
      select: {
        branch: { select: { id: true, nameEn: true } },
      },
    });
    assignedBranches = userBranches.map((ub) => ({
      id: ub.branch.id,
      name: ub.branch.nameEn,
    }));
  } catch (err) {
    // UserBranch table may not exist yet if migrations haven't been run
    console.warn("UserBranch query skipped (table may not exist):", err);
  }

  return {
    role: userWithManage.role,
    managedPlace: firstManage?.place ?? null,
    managedOrg: firstManage?.orgnization ?? null,
    assignedBranches,
  };
}

export const DASHBOARD_ROLES = ["basic", "verified", "admin", "techadmin"] as const;
export type DashboardRoleSegment = (typeof DASHBOARD_ROLES)[number];

export function roleToSegment(role: string): DashboardRoleSegment {
  const lower = role.toLowerCase();
  if (DASHBOARD_ROLES.includes(lower as DashboardRoleSegment)) {
    return lower as DashboardRoleSegment;
  }
  return "basic";
}

const ROLE_BY_SEGMENT: Record<DashboardRoleSegment, string> = {
  basic: "BASIC",
  verified: "VERIFIED",
  admin: "ADMIN",
  techadmin: "TECHADMIN",
};

export function ensureRoleMatch(
  userRole: string,
  segment: DashboardRoleSegment
): boolean {
  return userRole === ROLE_BY_SEGMENT[segment];
}

export type DashboardUserInsights = {
  role: string;
  managedPlace: string | null;
  managedOrg: string | null;
  branches: { id: string; name: string }[];
  postsCount: number;
  claimsCount: number;
};

export async function getDashboardUserInsights(
  userId: string
): Promise<DashboardUserInsights | null> {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        role: true,
        manage: {
          take: 1,
          select: { place: true, orgnization: true },
        },
        _count: {
          select: { post: true, claim: true },
        },
      },
    });

    if (!user) return null;

    const [firstManage] = user.manage;

    let branches: { id: string; name: string }[] = [];
    try {
      const userBranches = await prisma.userBranch.findMany({
        where: { userId },
        select: {
          branch: { select: { id: true, nameEn: true } },
        },
      });
      branches = userBranches.map((ub) => ({
        id: ub.branch.id,
        name: ub.branch.nameEn,
      }));
    } catch {
      // UserBranch table may not exist yet
    }

    return {
      role: user.role,
      managedPlace: firstManage?.place ?? null,
      managedOrg: firstManage?.orgnization ?? null,
      branches,
      postsCount: user._count.post,
      claimsCount: user._count.claim,
    };
  } catch (error) {
    console.error("Error fetching dashboard user insights:", error);
    return null;
  }
}
