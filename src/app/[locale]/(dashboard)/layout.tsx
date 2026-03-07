import { auth } from "@/../auth";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import { getUserRoleAndManagedPlaces } from "@/lib/dashboard";
import DashboardNavBar from "./_components/DashboardNavBar";

export default async function DashboardLayout({
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

  return (
    <div className="flex h-screen min-h-0 bg-gray-50">
      <aside className="flex-shrink-0 hidden lg:block">
        <DashboardNavBar result={result} />
      </aside>
      <section className="flex-1 min-w-0 flex flex-col items-center overflow-y-auto py-4 sm:py-6">
        <div className="w-[95%] sm:w-[90%] lg:w-[85%] min-w-0 px-2 sm:px-4">
          {children}
        </div>
      </section>
    </div>
  );
}
