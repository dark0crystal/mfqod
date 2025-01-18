"use client";

import React, { useState, useEffect } from "react";
import Claims from "./Claims";
import Image from "next/image";
import img4 from "../../../../../../../public/img4.jpeg";

export default function PostDetails({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showClaims, setShowClaims] = useState(false); // State to toggle Claims component
  const [approval, setApproval] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/get-items/${params.postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }
        const data = await response.json();
        setPost(data);
        setApproval(data.approval);
      } catch (err) {
        setError("Error fetching post details.");
      }
    };

    fetchData();
  }, [params.postId]);

  const handleApprovalChange = async () => {
    if (approval === undefined) return;

    try {
      const newApproval = !approval; // Toggle approval state
      const response = await fetch(
        `/api/edit-post?postId=${params.postId}&approval=${newApproval}`, { 
          method: "PUT"
         }
      );

      if (!response.ok) {
        throw new Error("Failed to update approval status");
      }

      const updatedPost = await response.json();
      setPost((prevPost: any) => ({
        ...prevPost,
        approval: updatedPost.response.approval,
      }));
      setApproval(updatedPost.response.approval); // Update the local state
    } catch (err) {
      console.error("Error updating approval status:", err);
    }
  };

  if (error) {
    return <p className="text-center text-red-500 text-lg mt-4">{error}</p>;
  }

  if (!post) {
    return <p className="text-center text-gray-500 text-lg mt-4">Loading...</p>;
  }

  return (
    <div className="w-full h-[500px] mx-auto p-6">
      <div className="bg-white h-full shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 flex h-full flex-col">
          <div className="w-full h-80 bg-yellow-100 flex flex-row">
            <div className="w-[50%] relative overflow-hidden rounded-2xl">
              <Image alt="sora" src={img4} fill objectFit="cover" />
            </div>
            <div className="w-[50%]">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{post.title || "Untitled Post"}</h1>
              <p className="text-gray-700 mb-4">{post.content || "No content available"}</p>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="approval" className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-gray-700">Approval:</span>
              <div className="relative">
                <input
                  type="checkbox"
                  id="approval"
                  checked={approval || false}
                  onChange={handleApprovalChange}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-5 bg-gray-300 rounded-full shadow-inner ${
                    approval ? "bg-blue-500" : ""
                  }`}
                ></div>
                <div
                  className={`absolute w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    approval ? "translate-x-5" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>
          </div>
          <div>
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
    </div>
  );
}
