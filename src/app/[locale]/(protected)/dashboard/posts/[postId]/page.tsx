'use client';
import React, { useState, useEffect } from 'react';
import Claims from '../../Claims';
// PostDetails Component
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
        {/* Display Images */}
        {post.images && post.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {post.images.map((image: string, index: number) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Post Image ${index + 1}`}
                  className="w-full h-56 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No Images Available</p>
          </div>
        )}

        <div className="p-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {post.title || 'Untitled Post'}
          </h1>

          {/* Content */}
          <p className="text-gray-700 mb-4">{post.content || 'No content available'}</p>

          {/* Address */}
          {post.address && post.address.length > 0 ? (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Address</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {post.address.map((addr: any, index: number) => (
                  <li key={index}>
                    {addr.place}, {addr.country}, {addr.organization}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No Address Available</p>
          )}

          {/* Author */}
          <p className="text-sm text-gray-500">Posted by: {post.author?.email || 'Unknown'}</p>

          {/* Claims Component */}
          <Claims postId={params.postId} />
        </div>
      </div>
    </div>
  );
}
