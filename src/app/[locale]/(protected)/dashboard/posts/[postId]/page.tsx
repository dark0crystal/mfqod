"use client";

import React, { useState, useEffect } from "react";
import Claims from "./Claims";
import Image from "next/image";
import img4 from "../../../../../../../public/img4.jpeg";

export default function PostDetails({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showClaims, setShowClaims] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPost, setShowPost] = useState(true);

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
        console.error(err);
        setError("Error fetching post details.");
      }
    };

    fetchData();
  }, [params.postId]);

  const handlePostEdit = () => {
    setShowPost((prev) => !prev);
  };

  const handleApprovalChange = async () => {
    if (!post) return;

    try {
      setLoading(true);
      const newApprovalStatus = !post.approval;

      const response = await fetch(`/api/edit-post`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: params.postId,
          approval: newApprovalStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update approval status");
      }

      const updatedPost = await response.json();
      setPost((prevPost: any) => ({
        ...prevPost,
        approval: updatedPost.approval,
      }));
    } catch (err) {
      console.error("Error updating approval status:", err);
      setError("Failed to update approval status.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <p className="text-center text-red-500 text-lg mt-4">{error}</p>;
  }

  if (!post) {
    return <p className="text-center text-gray-500 text-lg mt-4">Loading...</p>;
  }

  return (
    // Admin post details and claims
    <div className="w-screen md:w-[550px] lg:w-[650px] mx-10 p-6">
      {/* post details only */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">

        <div className="p-4">

          <button
            onClick={handlePostEdit}
            className="mb-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Edit Post
          </button>
          {showPost ? (
            <div className="w-full h-fit  grid grid-cols-1 grid-rows-2 lg:grid-cols-2 md:grid-rows-1">
              {/* image section */}
              <div className="w-full h-[350px] relative overflow-hidden rounded-2xl order-1 md:order-2 md:col-span-1">
                {post.images.map((img:string , index:number)=>(
                  <Image key={index} alt="Post image" src={img} fill objectFit="cover" />
                ))}
                
              </div>
              {/* post content section */}
              <div className="w-full   p-4 order-2 md:order-1 md:col-span-1">
                 {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  {post.title || "Untitled Post"}
                </h1>

                {/* Content */}
                <p className="text-gray-700 mb-4">
                  {post.content || "No content available"}
                </p>

                {/* Type */}
                <p className="text-gray-700 mb-4">
                  النوع: {post.type || "No type available"}
                </p>

                {/* Temporary Deletion */}
                <p className="text-gray-700 mb-4">
                  {post.temporaryDeletion ? "Marked for deletion" : "Not marked for deletion"}
                </p>

                {/* Approval Status */}
                <p className="text-gray-700 mb-4">
                  {post.approval ? "Approved ✅" : "Not approved ❌"}
                </p>
                              
              </div>
            </div>
          ) : (
            <div className="w-full h-fit bg-yellow-100 flex flex-row">
              <div className="w-1/2 relative overflow-hidden rounded-2xl">
                {/* Placeholder for EditPost */}
                Comming soon
              </div>
            </div>
          )}
        </div>

        {/* post  approval  */}
        <div className="p-4">
          <label htmlFor="approval" className="flex items-center cursor-pointer space-x-3">
            <span className="text-gray-700 font-medium">Approval:</span>
            <div className="relative">
              {/* Hidden Checkbox */}
              <input
                type="checkbox"
                id="approval"
                checked={post.approval}
                onChange={handleApprovalChange}
                disabled={loading}
                className="sr-only"
              />
              {/* Background Track */}
              <div
                className={`w-14 h-7 rounded-full transition-all duration-300 ${
                  post.approval ? "bg-green-500" : "bg-red-400"
                }`}
              ></div>
              {/* Toggle Knob */}
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                  post.approval ? "translate-x-7" : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>
        </div>

      </div>

      {/* claim section */}
      <div className="flex flex-row items-center w-full  mt-4">
        {/* {!showClaims ? (
          <button
            onClick={() => setShowClaims(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Show Claims
          </button> */}
        {/* ) : ( */}
          <Claims postId={params.postId} />
        {/* )} */}
      </div>
    </div>
  );
}
