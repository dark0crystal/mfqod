'use client'; // Add this to ensure the component runs on the client side

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { MdArrowOutward } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";


type Post = {
  id:string,
  temporaryDeletion:boolean,
  title:string,
  content:string,
  type:string

}
export default function DisplayPosts(){

    const router = useRouter();  // To navigate to the details page


    const searchParams = useSearchParams();
    const userId = searchParams.get('id'); // Retrieve user ID from the query string
  
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState("");
  
    // according the given userId the API endpoint will return the appropiate posts for that user 
    // the endpoit will check for the user address , and show the posts that have the same address
    // For Admin will show all the posts
    // For manager , first will check the manager given address , then will get the posts related 
    useEffect(() => {
      if (userId) {
        const fetchPosts = async () => {
          try {
            const response = await fetch(`/api/get-verified-posts?id=${userId}`);
            const data = await response.json();
            setRole(data.role);
            setPosts(data.posts);
          } catch (error) {
            console.error('Error fetching posts:', error);
          } finally {
            setLoading(false);
          }
        };
  
        fetchPosts();
      }
    }, [userId]);

    function handleDelete(postId: string) {
      if (postId) {
        const updatePost = async () => {
          try {
            const response = await fetch(`/api/get-verified-posts?postId=${postId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                temporaryDeletion: true, // Mark post as deleted (soft delete)
              }),
            });
  
            const data = await response.json();
            if (data) {
              setPosts((prevPosts: any) =>
                prevPosts.map((post: any) =>
                  post.id === postId ? { ...post, temporaryDeletion: true } : post
                )
              );
            }
          } catch (error) {
            console.error('Error updating post:', error);
          }
        };
  
        updatePost();
      }
    }
  
    if (loading) {
      return <div className="text-center text-xl mt-8">Loading...</div>;
    }

    return(
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">User's Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts available</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post:Post) => (
            <div
              key={post.id}
              className={`relative bg-white rounded-lg shadow-lg p-6 ${
                post.temporaryDeletion ? 'hidden' : 'block'
              }`}
            >
              {role === "VERIFIED" ? (
                <button
                  onClick={() => handleDelete(post.id)}
                  className="absolute top-2 right-2 text-sm text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
                >
                  Hide
                </button>
              ) : (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-sm text-white bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded"
                  >
                    Hide
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-sm text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
              <h2 className="text-lg font-bold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.content}</p>
              <span className="text-sm text-gray-500">{post.type}</span>
            </div>
          ))}
        </ul>
      )}
    </div>
    )
}