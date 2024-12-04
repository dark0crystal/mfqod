'use client'; // Add this to ensure the component runs on the client side

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function Posts() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id'); // Retrieve user ID from the query string

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (userId) {
      const fetchPosts = async () => {
        try {
          const response = await fetch(`/api/get-verified-posts?id=${userId}`);
          const data = await response.json();
          setRole(data.role)
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

  // To allow verified user to hide the post from the website.
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
            // Update the UI to hide the post immediately after the response
            setPosts((prevPosts:any) =>
              prevPosts.map((post:any) =>
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User's Posts</h1>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <div className='mt-2 p-4 bg-green-300' key={post.id} style={{ display: post.temporaryDeletion ? 'none' : 'block' }}>
            { role=="VERIFIED" ?(<button onClick={() => handleDelete(post.id)}>Hide</button>):(
                <>
                <button onClick={() => handleDelete(post.id)}>Hide</button>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
                </>
            )
            }
              
              <li>{post.title}</li>
              <li>{post.content}</li>
              <li>{post.type}</li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}


