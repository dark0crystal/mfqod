"use client";

import Image from "next/image";
import React, { useState, useMemo, useEffect } from "react";
import { gooeyToast } from "goey-toast";
import CustomSelect from "@/components/ui/CustomSelect";
import img from "@/../public/img3.jpeg";

type ClaimStatusFilter = "all" | "approved" | "not_approved";

export default function Claims({ postId }: { postId: string }) {
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ClaimStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  async function handleClaimApproval(claimId: string, approval: boolean) {
    try {
      const response = await fetch("/api/post-claim-approval", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId, approval }),
      });

      if (response.ok) {
        gooeyToast.success("Claim approval updated.");
        fetchClaims();
      } else {
        gooeyToast.error("Failed to update claim status.");
      }
    } catch {
      gooeyToast.error("Failed to update claim approval.");
    }
  }

  async function fetchClaims() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/get-claims?postId=${postId}`);
      if (!response.ok) throw new Error("Failed to fetch claims");

      const data = await response.json();
      setClaims(data);
    } catch {
      gooeyToast.error("Failed to load claims.");
      setClaims([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchClaims();
  }, [postId]);

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
        if (!title.includes(q) && !content.includes(q) && !userName.includes(q) && !userEmail.includes(q))
          return false;
      }
      return true;
    });
  }, [claims, statusFilter, searchQuery]);

  return (
    <div className="mt-6 w-full">
      {claims.length > 0 && (
        <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Filter claims</h3>
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
                placeholder="Title, content, user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input w-full text-sm py-2"
              />
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="h-20 bg-gray-200 rounded mb-2" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      )}

      {!isLoading && claims.length > 0 ? (
        <div className="mt-4 w-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Claims {filteredClaims.length !== claims.length && `(${filteredClaims.length} of ${claims.length})`}
          </h3>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-12">
            {filteredClaims.length === 0 ? (
              <p className="text-gray-500 col-span-full py-6 text-center">
                No claims match the current filter.
              </p>
            ) : (
            filteredClaims.map((claim, index) => (
              <div
                key={claim.id ?? index}
                className="p-4 border border-blue-500 rounded-lg shadow bg-white w-full "
              >
                <div className="w-full h-[300px] lg:h-[200px] relative rounded-xl overflow-hidden">
                  <Image
                    alt="image"
                    src={img}
                    fill
                    objectFit="cover"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-gray-700">
                    <strong>Title:</strong> {claim.claimTitle}
                  </p>
                  <p className="text-gray-700">
                    <strong>Content:</strong> {claim.claimContent}
                  </p>
                  <p className="text-gray-700">
                    <strong>Date:</strong>{" "}
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <strong>User Name:</strong> {claim.user?.name ?? "—"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {claim.user?.email ?? "—"}
                  </p>

                  <div className="mt-4">
                    <button
                      onClick={() =>
                        handleClaimApproval(claim.id, !(claim.approval ?? claim.approved))
                      }
                      className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
                        claim.approval ?? claim.approved
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {claim.approval ?? claim.approved ? "Approved" : "Not Approved"}
                    </button>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>
      ) : (
        !isLoading && (
          <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-gray-500">
              {claims.length === 0
                ? "No claims available for this post."
                : "No claims match the current filter."}
            </p>
          </div>
        )
      )}
    </div>
  );
}
