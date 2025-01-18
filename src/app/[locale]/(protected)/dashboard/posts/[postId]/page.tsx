"use client";

import React, { useState, useEffect } from "react";
import Claims from "./Claims";

export default function PostDetails({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showClaims, setShowClaims] = useState(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/get-items/${params.postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError("Error fetching post details.");
      }
    };

    fetchData();
  }, [params.postId]);

  const handleApprovalChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const approvalStatus = e.target.checked;

    setIsApproving(true);
    try {
      const response = await fetch(
        `/api/edit-post?postId=${params.postId}&approval=${approvalStatus}`,
        { method: "PUT" }
      );
      if (!response.ok) {
        throw new Error("Failed to update approval status");
      }
      const updatedPost = await response.json();
      setPost(updatedPost.response);
    } catch (err) {
      setError("Error updating approval status.");
    } finally {
      setIsApproving(false);
    }
  };

  if (error) {
    return <p className="text-center text-red-500 text-lg mt-4">{error}</p>;
  }

  if (!post) {
    return <p className="text-center text-gray-500 text-lg mt-4">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {post.title || "Untitled Post"}
          </h1>
          <p className="text-gray-700 mb-4">{post.content || "No content available"}</p>

          {/* Approval Checkbox */}
          <div className="flex items-center mb-4">
            <label htmlFor="approval" className="text-gray-800 font-medium mr-2">
              Approve Post
            </label>
            <input
              type="checkbox"
              id="approval"
              checked={post.approval}
              onChange={handleApprovalChange}
              disabled={isApproving}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          {/* Button to show Claims */}
          {!showClaims && (
            <button
              onClick={() => setShowClaims(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Show Claims
            </button>
          )}
          {showClaims && <Claims postId={params.postId} />}
        </div>
      </div>
    </div>
  );
}
