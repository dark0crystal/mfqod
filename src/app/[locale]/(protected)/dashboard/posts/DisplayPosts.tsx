'use client'; // Add this to ensure the component runs on the client side
import {useRouter} from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';


type Post = {
  id: string;
  temporaryDeletion: boolean;
  title: string;
  content: string;
  type: string;
  imageUrl?: string; // Optional field for the post's image
};

export default function DisplayPosts() {
  const router = useRouter(); // To navigate to the details page
  const searchParams = useSearchParams();
  const orgName  = searchParams.get('orgName'); // Retrieve orgName from the query string
  const placeName  = searchParams.get('placeName'); // Retrieve orgName from the query string
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');



  useEffect(() => {
    if (orgName) {
      const fetchPosts = async () => {
        try {
          const response = await fetch(`/api/get-verified-posts?orgName=${orgName}`);
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
    // placeName fetch
    else if(placeName){
      const fetchPosts = async () => {
        try {
          const response = await fetch(`/api/get-verified-posts?placeName=${placeName}`);
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
  }, []);

  const handleDelete = async (postId: string) => {
    if (postId) {
      try {
        const response = await fetch(`/api/get-verified-posts?postId=${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ temporaryDeletion: true }),
        });

        const data = await response.json();
        if (data) {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId ? { ...post, temporaryDeletion: true } : post
            )
          );
        }
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">User Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts available</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <li
              key={post.id}
              className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                post.temporaryDeletion ? 'hidden' : 'block'
              } cursor-pointer`}
              onClick={() => router.push({ pathname: `/dashboard/posts/${post.id}` }) }
            >
              {/* Image Section */}
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.title || 'Post Image'}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}

              {/* Content Section */}
              <div className="p-6">
                <h2 className="text-lg font-bold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4">{post.content}</p>
                <span className="text-sm text-gray-500">{post.type}</span>
              </div>

              {/* Action Buttons */}
              {role === 'VERIFIED' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering card click
                    handleDelete(post.id);
                  }}
                  className="absolute top-2 right-2 text-sm text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded shadow"
                >
                  Hide
                </button>
              ) : (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.id);
                    }}
                    className="text-sm text-white bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded shadow"
                  >
                    Hide
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.id);
                    }}
                    className="text-sm text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded shadow"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
