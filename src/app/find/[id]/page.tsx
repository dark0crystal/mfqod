// app/find/[id]/page.tsx
"use client"
// import { notFound } from 'next/navigation'; // For handling not found
import { useEffect, useState } from 'react';


export default function PostDetails({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any | null>(null);  // State to store post details
  const {id} = params
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`/api/get-items/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data.post);  // Set the fetched post data
        } else {
          console.error('Failed to fetch post details');
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [id]);  // Fetch data when ID changes

  if (!post) return <p>Loading...</p>; // Display loading while fetching

  return (
    <div className="w-full max-w-4xl p-8 mt-6 bg-gray-200">
      <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
      <p><strong>Content:</strong> {post.content}</p>
      <p><strong>Place:</strong> {post.place}</p>
      <p><strong>Country:</strong> {post.country}</p>
 
    </div>
  );
}

