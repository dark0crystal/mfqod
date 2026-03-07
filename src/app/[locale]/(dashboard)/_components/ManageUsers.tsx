"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { DASHBOARD_ROLES } from "@/lib/dashboard";
import { gooeyToast } from "goey-toast";
import img2 from "@/../public/bg11.jpg";

const schema = z.object({
  email: z.string().min(1, "Email is required").max(50, "Email is too long"),
});
type FormFields = z.infer<typeof schema>;

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  managing: { place: string | null; orgnization: string | null } | null;
  branches: { id: string; name: string }[];
  postsCount: number;
  claimsCount: number;
};

function getRoleSegmentFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && DASHBOARD_ROLES.includes(first as any)) {
    return first;
  }
  return "techadmin";
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    BASIC: "bg-slate-500/80 text-white",
    VERIFIED: "bg-emerald-600/80 text-white",
    ADMIN: "bg-amber-600/80 text-white",
    TECHADMIN: "bg-violet-600/80 text-white",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[role] ?? "bg-gray-500/80 text-white"}`}
    >
      {role}
    </span>
  );
}

export default function ManageUsers() {
  const pathname = usePathname();
  const roleSegment = getRoleSegmentFromPathname(pathname);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const [users, setUsers] = useState<UserRow[]>([]);

  const fetchUsers = async (email: string) => {
    try {
      const response = await fetch(`/api/manage-users?userEmail=${email}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch {
      setUsers([]);
      gooeyToast.error("Failed to fetch users.");
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await fetchUsers(data.email);
    reset();
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Manage Users</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="email" className="form-label">Search by email</label>
          <input
            type="text"
            id="email"
            {...register("email")}
            className="form-input mb-0"
            placeholder="Search by email"
          />
        </div>
        {errors.email && (
          <div className="text-red-400 w-full">{errors.email.message}</div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary shrink-0"
        >
          {isSubmitting ? "Searching..." : "Search"}
        </button>
      </form>

      {users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-1 flex-wrap items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-200">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <Image
                        src={img2}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {user.name || "—"}
                    </p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                    <div className="mt-1">
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                </div>

                {user.managing && (
                  <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-1.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Managing
                    </p>
                    <p className="text-sm text-slate-800">
                      {[user.managing.orgnization, user.managing.place]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </div>
                )}

                {user.branches.length > 0 && (
                  <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-1.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Branches
                    </p>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {user.branches.map((b) => (
                        <span
                          key={b.id}
                          className="rounded bg-slate-200/80 px-1.5 py-0.5 text-xs text-slate-700"
                        >
                          {b.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <div className="rounded-lg border border-slate-100 bg-white px-3 py-1.5 shadow-sm">
                    <span className="text-xs text-slate-500">Posts</span>
                    <p className="text-lg font-semibold text-slate-800">
                      {user.postsCount}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-white px-3 py-1.5 shadow-sm">
                    <span className="text-xs text-slate-500">Claims</span>
                    <p className="text-lg font-semibold text-slate-800">
                      {user.claimsCount}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={{
                  pathname: `/${roleSegment}/manage-users/${user.id}`,
                }}
                className="shrink-0 btn-primary inline-block text-center"
              >
                Edit User
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
}
