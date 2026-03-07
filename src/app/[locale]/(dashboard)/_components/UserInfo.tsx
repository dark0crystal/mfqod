import { auth } from "@/../auth";
import Image from "next/image";
import img2 from "@/../public/bg11.jpg";
import { getDashboardUserInsights } from "@/lib/dashboard";

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    BASIC: "bg-slate-500/80 text-white",
    VERIFIED: "bg-emerald-600/80 text-white",
    ADMIN: "bg-amber-600/80 text-white",
    TECHADMIN: "bg-violet-600/80 text-white",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[role] ?? "bg-gray-500/80 text-white"}`}
    >
      {role}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-slate-300/60 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 text-slate-600">
        <span className="text-lg" aria-hidden>
          {icon}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

export default async function UserInfo() {
  const session = await auth();
  if (!session?.user) return null;

  const userId = (session.user as { id?: string }).id;
  const insights = userId
    ? await getDashboardUserInsights(userId)
    : null;

  return (
    <div className="flex w-full flex-col items-center p-6 md:p-8">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-400/40 p-6 shadow-lg md:p-8">
        {/* Profile header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            {session.user?.image == null ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={img2}
                  alt="Profile"
                  className="absolute object-cover"
                  fill
                />
              </div>
            ) : (
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={session.user.image}
                  alt="Profile"
                  className="absolute object-cover"
                  fill
                  sizes="64px"
                />
              </div>
            )}
          </div>
          <p className="text-lg font-semibold text-slate-900 md:text-xl">
            {session.user?.name ?? "—"}
          </p>
          <p className="text-sm text-slate-700 md:text-base">
            {session.user?.email}
          </p>
          {insights && (
            <div className="mt-2">
              <RoleBadge role={insights.role} />
            </div>
          )}
        </div>

        {/* Managing branch / place */}
        {insights && (insights.managedPlace || insights.managedOrg) && (
          <div className="mt-4 rounded-xl border border-slate-300/60 bg-white/60 p-3 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
              Managing
            </p>
            <p className="mt-0.5 font-medium text-slate-800">
              {[insights.managedOrg, insights.managedPlace]
                .filter(Boolean)
                .join(" · ") || "—"}
            </p>
          </div>
        )}

        {/* Assigned branches */}
        {insights && insights.branches.length > 0 && (
          <div className="mt-4 rounded-xl border border-slate-300/60 bg-white/60 p-3 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
              Assigned branches
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {insights.branches.map((b) => (
                <span
                  key={b.id}
                  className="rounded-md bg-slate-200/80 px-2 py-0.5 text-sm text-slate-800"
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Analytics cards */}
        {insights && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            <StatCard
              label="Posts"
              value={insights.postsCount}
              icon="📝"
            />
            <StatCard
              label="Claims"
              value={insights.claimsCount}
              icon="✓"
            />
          </div>
        )}
      </div>
    </div>
  );
}
