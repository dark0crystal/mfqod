"use client";

import React, { useState, useEffect } from "react";
import Claims from "./Claims";
import Image from "next/image";
import img4 from "../../../../../../../public/img4.jpeg";
import EditPost from "./EditPost";

export default function PostDetails({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showClaims, setShowClaims] = useState(false);
  const [loading, setLoading] = useState(false); // To show loading state
  const [showPost , setShowPost] = useState(true);

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

  function handlePostEdit(){
   
    setShowPost(!showPost)
    
  }
  console.log(showPost)

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
    <div>

    
    <div className="w-[700px] h-[500px] mx-auto p-6">
      <div className="bg-white h-full shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 flex h-full flex-col">
          <button onClick={handlePostEdit}>Edit Post</button>
          {showPost == true ? (
      
          
          <div className="w-full h-80 bg-yellow-100 flex flex-row">
            <div className="w-[50%] relative overflow-hidden rounded-2xl">
              <Image alt="sora" src={img4} fill objectFit="cover" />
            </div>
            <div className="w-[50%]">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{post.title || "Untitled Post"}</h1>
              <p className="text-gray-700 mb-4">{post.content || "No content available"}</p>
            </div>
          </div>
         

          ):(
          
          <div className="w-full h-80 bg-yellow-100 flex flex-row">
            <div className="w-[50%] relative overflow-hidden rounded-2xl">
               <EditPost/>
            </div>
            </div>
     
       ) }
          
        </div>
      </div>
      <div className="">
            <label htmlFor="approval" className="inline-flex  cursor-pointer">
              <span className="mr-2 text-gray-700">Approval:</span>
              <div className="relative">
                <input
                  type="checkbox"
                  id="approval"
                  checked={post.approval}
                  onChange={handleApprovalChange}
                  disabled={loading}
                  className="sr-only "
                />
                <div
                  className={`w-[5.3rem] h-8  rounded-full shadow-inner absolute ${
                    post.approval ? "bg-green-400" : "bg-red-300"
                  }`}
                ></div>
                <div
                  className={`absolute w-6 h-6 bg-white rounded-full mt-1  shadow transform transition-transform  ${
                    post.approval ? "translate-x-14" : "translate-x-1"
                  }`}
                ></div>
              </div>
            </label>
          </div>
    </div>


<div className="flex flex-row items-center w-full mt-4">
          
          <div className=" w-[50%]">
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
