"use client";

import React, { useState, useEffect } from "react";
import { gooeyToast } from "goey-toast";
import Claims from "./Claims";
import CustomSelect from "@/components/ui/CustomSelect";
import Image from "next/image";

type PostStatus = "PENDING" | "APPROVED" | "DISPOSED" | "CANCELLED";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  DISPOSED: "bg-slate-100 text-slate-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function PostDetails({ postId }: { postId: string }) {
  const [post, setPost] = useState<any>(null);
  const [postLoading, setPostLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PostStatus>("PENDING");
  const [loading, setLoading] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showDisposedModal, setShowDisposedModal] = useState(false);
  const [claimsForApproval, setClaimsForApproval] = useState<any[]>([]);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [disposalTitle, setDisposalTitle] = useState("");
  const [disposalDescription, setDisposalDescription] = useState("");
  const [disposalHow, setDisposalHow] = useState("");

  useEffect(() => {
    let cancelled = false;
    setPostLoading(true);
    fetch(`/api/get-items/${postId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch post");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setPost(data);
          setSelectedStatus(data.status || "PENDING");
        }
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setPostLoading(false);
      });
    return () => { cancelled = true; };
  }, [postId]);

  const handleStatusUpdate = async () => {
    if (!post) return;

    if (selectedStatus === "APPROVED") {
      try {
        const res = await fetch(`/api/get-claims?postId=${postId}`);
        const data = await res.ok ? res.json() : [];
        const list = Array.isArray(data) ? data : [];
        setClaimsForApproval(list);
        if (list.length === 0) {
          gooeyToast.error("Add at least one claim before approving.");
          return;
        }
        setSelectedClaimId(null);
        setShowApprovedModal(true);
      } catch {
        gooeyToast.error("Failed to load claims.");
      }
      return;
    }

    if (selectedStatus === "DISPOSED") {
      setDisposalTitle(post.disposalTitle ?? "");
      setDisposalDescription(post.disposalDescription ?? "");
      setDisposalHow(post.disposalHow ?? "");
      setShowDisposedModal(true);
      return;
    }

    if (selectedStatus === "CANCELLED") {
      await submitStatusChange("CANCELLED");
      return;
    }

    await submitStatusChange(selectedStatus);
  };

  const submitStatusChange = async (
    status: PostStatus,
    extra?: {
      approvedClaimId?: string;
      disposalTitle?: string;
      disposalDescription?: string;
      disposalHow?: string;
    }
  ) => {
    if (!post) return;
    setLoading(true);
    try {
      const body: any = { postId, status };
      if (status === "APPROVED" && extra?.approvedClaimId)
        body.approvedClaimId = extra.approvedClaimId;
      if (status === "DISPOSED") {
        if (extra?.disposalTitle !== undefined) body.disposalTitle = extra.disposalTitle;
        if (extra?.disposalDescription !== undefined)
          body.disposalDescription = extra.disposalDescription;
        if (extra?.disposalHow !== undefined) body.disposalHow = extra.disposalHow;
      }
      const response = await fetch("/api/edit-post", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to update status");
      }
      const updated = await response.json();
      setPost((prev: any) => (prev ? { ...prev, ...updated } : updated));
      setShowApprovedModal(false);
      setShowDisposedModal(false);
      gooeyToast.success("Status updated.");
    } catch (err: any) {
      gooeyToast.error(err?.message || "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const onConfirmApproved = () => {
    if (!selectedClaimId) return;
    submitStatusChange("APPROVED", { approvedClaimId: selectedClaimId });
  };

  const onConfirmDisposed = () => {
    submitStatusChange("DISPOSED", {
      disposalTitle: disposalTitle || undefined,
      disposalDescription: disposalDescription || undefined,
      disposalHow: disposalHow || undefined,
    });
  };

  const createdDate =
    post?.createdAt &&
    new Date(post.createdAt).toLocaleDateString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loadFailed && !post) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-center text-slate-500 text-lg">Couldn’t load this post.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 w-full max-w-6xl mx-auto min-w-0">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content - left */}
        <main className="flex-1 min-w-0 space-y-6">
          {postLoading ? (
            <>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-5 animate-pulse">
                  <div className="h-8 bg-slate-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                  <div className="aspect-video bg-slate-200 rounded-lg mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/4 mb-4" />
                <div className="h-20 bg-slate-200 rounded" />
              </div>
            </>
          ) : post ? (
            <>
              {/* Post header card */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-5">
                  <h1 className="text-2xl font-bold text-slate-800 mb-1">
                    {post.title || "Untitled Post"}
                  </h1>
                  <p className="text-sm text-slate-500 mb-4">
                    {createdDate}
                    {post.type && ` · ${post.type}`}
                  </p>
                  {post.images?.length > 0 ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100 mb-4">
                      <Image
                        alt="Post"
                        src={post.images[0]}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                      No image
                    </div>
                  )}
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {post.content || "No content available"}
                  </p>
                  {post.temporaryDeletion && (
                    <p className="mt-3 text-amber-700 text-sm font-medium">
                      Marked for deletion
                    </p>
                  )}
                </div>
              </div>

              {/* Approved claim / Disposal */}
              {post.status === "APPROVED" && post.approvedClaim && (
                <div className="bg-white rounded-xl border border-green-200 bg-green-50/50 p-5">
                  <p className="text-sm font-semibold text-green-800 mb-2">Approved claim</p>
                  <p className="text-slate-800">{post.approvedClaim.claimTitle}</p>
                  <p className="text-slate-600 text-sm mt-1">
                    By: {post.approvedClaim.user?.name ?? post.approvedClaim.user?.email ?? "—"}
                  </p>
                </div>
              )}
              {post.status === "DISPOSED" && (post.disposalTitle || post.disposalHow) && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <p className="text-sm font-semibold text-slate-800 mb-2">Disposal</p>
                  {post.disposalTitle && (
                    <p className="text-slate-700">Title: {post.disposalTitle}</p>
                  )}
                  {post.disposalDescription && (
                    <p className="text-slate-700 mt-1">{post.disposalDescription}</p>
                  )}
                  {post.disposalHow && (
                    <p className="text-slate-700 mt-1">How: {post.disposalHow}</p>
                  )}
                </div>
              )}
              {post.status === "CANCELLED" && (
                <div className="bg-white rounded-xl border border-red-200 bg-red-50/50 p-5">
                  <p className="text-red-700 font-medium">Cancelled</p>
                </div>
              )}
            </>
          ) : null}

          {/* Claims - always visible and mounted so it loads in parallel with post */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Claims</h2>
              {post && (
                <p className="text-sm text-slate-500 mt-0.5">
                  All claims for this post are listed below.
                </p>
              )}
            </div>
            <div className="p-5">
              <Claims postId={postId} />
            </div>
          </div>
        </main>

        {/* Sidebar - right */}
        <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-4">
          {postLoading ? (
            <>
              <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-10 bg-slate-200 rounded mb-3" />
                <div className="h-9 bg-slate-200 rounded w-full" />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/2 mb-4" />
                <div className="h-12 w-12 rounded-full bg-slate-200 mb-3" />
                <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
              </div>
            </>
          ) : post ? (
            <>
              {/* Status card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </h3>
                  <span
                    className={`inline-block mt-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      statusColors[post.status] ?? "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {post.status || "PENDING"}
                  </span>
                </div>
                <div className="p-4">
                  <CustomSelect
                    label="Change status"
                    value={selectedStatus}
                    onChange={(v) => setSelectedStatus(v as PostStatus)}
                    placeholder="Select status"
                    options={[
                      { value: "PENDING", label: "Pending" },
                      { value: "APPROVED", label: "Approved" },
                      { value: "DISPOSED", label: "Disposed" },
                      { value: "CANCELLED", label: "Cancelled" },
                    ]}
                  />
                  <button
                    onClick={handleStatusUpdate}
                    disabled={loading}
                    className="mt-3 w-full btn-primary text-sm py-2"
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>

              {/* Created by card */}
              {post.author && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Created by
                  </h3>
                  <div className="flex items-start gap-3">
                    {post.author.image ? (
                      <img
                        src={post.author.image}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold shrink-0">
                        {(post.author.name || post.author.email || "?")[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {post.author.name || "—"}
                      </p>
                      <p className="text-sm text-slate-500 truncate">{post.author.email}</p>
                      {createdDate && (
                        <p className="text-xs text-slate-400 mt-1">Created {createdDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </aside>
      </div>

      {/* Approved modal */}
      {showApprovedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Select claim to approve</h2>
              <p className="text-sm text-gray-600">
                Choose the claim to connect to this post. The post will be marked as Approved.
              </p>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {claimsForApproval.length === 0 ? (
                <p className="text-amber-600">Add at least one claim before approving.</p>
              ) : (
                <div className="space-y-3">
                  {claimsForApproval.map((claim: any) => (
                    <div
                      key={claim.id}
                      onClick={() => setSelectedClaimId(claim.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedClaimId === claim.id
                          ? "border-primary bg-primary-light"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium text-gray-900">{claim.claimTitle}</p>
                      <p className="text-sm text-gray-600 mt-1">{claim.claimContent}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        By: {claim.user?.name ?? claim.user?.email ?? "—"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowApprovedModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmApproved}
                disabled={!selectedClaimId || loading}
                className="btn-primary"
              >
                {loading ? "Updating..." : "Confirm Approved"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disposed modal */}
      {showDisposedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Dispose post</h2>
              <p className="text-sm text-gray-600">
                Describe how this found item was disposed.
              </p>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              <div>
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={disposalTitle}
                  onChange={(e) => setDisposalTitle(e.target.value)}
                  className="form-input"
                  placeholder="Disposal title"
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  value={disposalDescription}
                  onChange={(e) => setDisposalDescription(e.target.value)}
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe the disposal"
                />
              </div>
              <div>
                <label className="form-label">How was this item disposed?</label>
                <input
                  type="text"
                  value={disposalHow}
                  onChange={(e) => setDisposalHow(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Returned to owner, donated"
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowDisposedModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmDisposed}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Updating..." : "Confirm Disposed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
