"use client";

import { useState, useEffect, useCallback } from "react";
import { gooeyToast } from "goey-toast";
import CustomSelect from "@/components/ui/CustomSelect";

type Branch = {
  id: string;
  nameEn: string;
  country: { id: string; nameEn: string; code: string | null } | null;
};
type UserBranchRow = {
  id: string;
  branchId: string;
  branch: Branch & { country: { id: string; nameEn: string; code: string | null } | null };
};

export default function UserBranchAssignment({ userId }: { userId: string }) {
  const [assigned, setAssigned] = useState<UserBranchRow[]>([]);
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAssigned = useCallback(async () => {
    try {
      const res = await fetch(`/api/user-branches?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAssigned(Array.isArray(data) ? data : []);
    } catch {
      gooeyToast.error("Failed to load branch assignments.");
      setAssigned([]);
    }
  }, [userId]);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch("/api/branches");
      if (!res.ok) throw new Error("Failed to fetch branches");
      const data = await res.json();
      setAllBranches(Array.isArray(data) ? data : []);
    } catch {
      setAllBranches([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchAssigned(), fetchBranches()]).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [userId, fetchAssigned, fetchBranches]);

  const handleAssign = async () => {
    if (!selectedBranchId) return;
    try {
      const res = await fetch("/api/user-branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, branchId: selectedBranchId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to assign");
      }
      setSelectedBranchId("");
      gooeyToast.success("Branch assigned.");
      fetchAssigned();
    } catch {
      gooeyToast.error("Failed to assign branch.");
    }
  };

  const handleUnassign = async (branchId: string) => {
    if (!window.confirm("Remove this branch from the user?")) return;
    try {
      const res = await fetch(
        `/api/user-branches?userId=${userId}&branchId=${branchId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to unassign");
      }
      gooeyToast.success("Branch removed.");
      fetchAssigned();
    } catch {
      gooeyToast.error("Failed to remove branch.");
    }
  };

  const assignedIds = new Set(assigned.map((a) => a.branch.id));
  const availableBranches = allBranches.filter((b) => !assignedIds.has(b.id));

  if (loading) return <p className="text-gray-600">Loading branch assignments...</p>;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-2">Manage branches (manager of)</h2>
      <div className="flex flex-wrap gap-2 items-center mb-3">
        <CustomSelect
          value={selectedBranchId}
          onChange={setSelectedBranchId}
          placeholder="Select branch"
          options={[
            { value: "", label: "Select branch" },
            ...availableBranches.map((b) => ({
              value: b.id,
              label: b.country ? `${b.nameEn} (${b.country.nameEn})` : b.nameEn,
            })),
          ]}
          className="min-w-[200px]"
        />
        <button
          type="button"
          onClick={handleAssign}
          disabled={!selectedBranchId}
          className="btn-primary"
        >
          Add branch
        </button>
      </div>
      <ul className="space-y-2">
        {assigned.map((ub) => (
          <li
            key={ub.id}
            className="flex items-center justify-between border p-3 rounded"
          >
            <span>
              {ub.branch.nameEn}
              {ub.branch.country && (
                <span className="text-gray-500 text-sm ml-2">
                  ({ub.branch.country.nameEn})
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => handleUnassign(ub.branch.id)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      {assigned.length === 0 && (
        <p className="text-gray-500 text-sm">No branches assigned.</p>
      )}
    </div>
  );
}
