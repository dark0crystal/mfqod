import { auth } from "@/../auth";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import { getUserRoleAndManagedPlaces, roleToSegment } from "@/lib/dashboard";

export default async function DashboardRedirect() {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user?.id) {
    redirect({ href: "/login", locale });
  }

  const result = await getUserRoleAndManagedPlaces(session!.user!.id as string);
  const segment = roleToSegment(result.role);
  redirect({ href: `/${segment}`, locale });
}
