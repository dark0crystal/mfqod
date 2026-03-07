import { auth } from "@/../auth";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import {
  getUserRoleAndManagedPlaces,
  roleToSegment,
  ensureRoleMatch,
} from "@/lib/dashboard";

export default async function BasicRoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getLocale();
  if (!session?.user?.id) {
    redirect({ href: "/login", locale });
  }
  const result = await getUserRoleAndManagedPlaces(session!.user!.id as string);
  if (!ensureRoleMatch(result.role, "basic")) {
    redirect({ href: `/${roleToSegment(result.role)}`, locale });
  }
  return <>{children}</>;
}
