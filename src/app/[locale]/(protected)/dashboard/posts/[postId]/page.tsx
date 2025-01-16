"use client"
import React, { useState, useEffect } from 'react';
import Claims from './Claims';

export default function PostDetails({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/get-items/${params.postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post details');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError('Error fetching post details.');
      }
    };

    fetchData();
  }, [params.postId]);

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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{post.title || 'Untitled Post'}</h1>
          <p className="text-gray-700 mb-4">{post.content || 'No content available'}</p>
          <Claims postId={params.postId} />
        </div>
      </div>
    </div>
  );
}
