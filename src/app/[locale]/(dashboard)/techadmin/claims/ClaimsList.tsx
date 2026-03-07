"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { gooeyToast } from "goey-toast";
import CustomSelect from "@/components/ui/CustomSelect";
import img from "@/../public/img3.jpeg";
import { DASHBOARD_ROLES } from "@/lib/dashboard";

type ClaimStatusFilter = "all" | "approved" | "not_approved";

function getRoleSegmentFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && DASHBOARD_ROLES.includes(first as (typeof DASHBOARD_ROLES)[number])) {
    return first;
  }
  return "techadmin";
}

type ClaimItem = {
  id: string;
  postId?: string;
  post?: { id: string; title: string };
  claimTitle: string;
  claimContent?: string | null;
  approval?: boolean;
  approved?: boolean;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
  images?: string[];
};

export default function ClaimsList() {
  const pathname = usePathname();
  const roleSegment = getRoleSegmentFromPathname(pathname);

  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ClaimStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchClaims() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/get-claims");
      if (!response.ok) throw new Error("Failed to fetch claims");
      const data = await response.json();
      setClaims(Array.isArray(data) ? data : []);
    } catch {
      gooeyToast.error("Failed to load claims.");
      setClaims([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchClaims();
  }, []);

  async function handleClaimApproval(claimId: string, approval: boolean) {
    try {
      const res = await fetch("/api/post-claim-approval", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId, approval }),
      });
      if (res.ok) {
        gooeyToast.success("Claim approval updated.");
        fetchClaims();
      } else {
        gooeyToast.error("Failed to update claim approval.");
      }
    } catch {
      gooeyToast.error("Failed to update claim approval.");
    }
  }

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const approved = claim.approval ?? claim.approved;
      if (statusFilter === "approved" && !approved) return false;
      if (statusFilter === "not_approved" && approved) return false;
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const title = (claim.claimTitle ?? "").toLowerCase();
        const content = (claim.claimContent ?? "").toLowerCase();
        const userName = (claim.user?.name ?? "").toLowerCase();
        const userEmail = (claim.user?.email ?? "").toLowerCase();
        const postTitle = (claim.post?.title ?? "").toLowerCase();
        if (
          !title.includes(q) &&
          !content.includes(q) &&
          !userName.includes(q) &&
          !userEmail.includes(q) &&
          !postTitle.includes(q)
        )
          return false;
      }
      return true;
    });
  }, [claims, statusFilter, searchQuery]);

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold">Claims</h1>
      <p className="text-gray-600 mb-4">Claims management.</p>

      {/* Filter bar - always visible when we have loaded (even if 0 claims) */}
      {!isLoading && (
        <div className="mb-4 p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Filter claims</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <CustomSelect
                id="claim-status"
                label="Status:"
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as ClaimStatusFilter)}
                placeholder="All"
                options={[
                  { value: "all", label: "All" },
                  { value: "approved", label: "Approved" },
                  { value: "not_approved", label: "Not approved" },
                ]}
                className="min-w-[140px]"
              />
            </div>
            <div className="flex items-center gap-2 min-w-0 flex-1 max-w-xs">
              <label htmlFor="claim-search" className="text-sm text-gray-600 whitespace-nowrap">
                Search:
              </label>
              <input
                id="claim-search"
                type="search"
                placeholder="Title, content, user, post..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input w-full text-sm py-2"
              />
            </div>
          </div>
        </div>
      )}

      {isLoading && <p className="text-gray-500">Loading claims...</p>}

      {!isLoading && (
        <>
          <p className="text-sm text-gray-600 mb-2">
            {filteredClaims.length === claims.length
              ? `${claims.length} claim${claims.length === 1 ? "" : "s"}`
              : `${filteredClaims.length} of ${claims.length} claims`}
          </p>
          {filteredClaims.length === 0 ? (
            <p className="text-gray-500 py-6">
              {claims.length === 0 ? "No claims yet." : "No claims match the current filter."}
            </p>
          ) : (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-6">
              {filteredClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-4 border border-blue-500 rounded-lg shadow bg-white w-full"
                >
                  <div className="w-full h-[200px] relative rounded-xl overflow-hidden bg-gray-100">
                    {claim.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={claim.images[0]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image alt="" src={img} fill className="object-cover" />
                    )}
                  </div>
                  <div className="mt-3">
                    {claim.post && (
                      <p className="text-gray-700 mb-1">
                        <strong>Post:</strong>{" "}
                        <Link
                          href={`/${roleSegment}/posts/${claim.post.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {claim.post.title}
                        </Link>
                      </p>
                    )}
                    <p className="text-gray-700">
                      <strong>Title:</strong> {claim.claimTitle}
                    </p>
                    <p className="text-gray-700">
                      <strong>Content:</strong> {claim.claimContent ?? "—"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Date:</strong>{" "}
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">
                      <strong>User:</strong> {claim.user?.name ?? "—"} ({claim.user?.email})
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() =>
                          handleClaimApproval(claim.id, !(claim.approval ?? claim.approved))
                        }
                        className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
                          claim.approval ?? claim.approved
                            ? "bg-primary hover:bg-primary-hover"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {claim.approval ?? claim.approved ? "Approved" : "Not Approved"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
