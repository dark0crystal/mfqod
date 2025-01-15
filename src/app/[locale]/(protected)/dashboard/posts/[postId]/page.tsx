'use client';
import React from 'react';
import { useState, useEffect } from 'react';

export default function PostDetails({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
    console.log(post)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/get-items/${params.postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post details');
        }
        const data = await response.json();
        setPost(data.post);
      } catch (error) {
        setError("fsdfa");
      }
    };

    fetchData();
  }, [params.postId]);

  if (error) {
    return <p>Error loading post details: {error}</p>;
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{post.title || 'Untitled Post'}</h1>
      <p>{post.content || 'No content available'}</p>
      <p>Posted by: {post.author || 'Unknown'}</p>
    </div>
  );
}
