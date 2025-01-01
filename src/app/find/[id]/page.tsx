'use client';

import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactConfetti from 'react-confetti';

// Define Zod validation schema
const schema = z.object({
  claimTitle: z.string().min(1, { message: "The Field is required!" }),
  claimContent: z.string().min(1, { message: "Please select a place" }),
  image: z
    .any()
    .refine((files) => files.length > 0, { message: "Please upload at least one image" })
});

type FormFields = {
  claimTitle: string;
  claimContent: string;
  image: FileList;
};

export default function PostDetails({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const { id } = params;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`/api/get-items/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("from details",data)
          setPost(data.post);
        } else {
          console.error('Failed to fetch post details');
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };
    fetchPostDetails();
  }, [id]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    

    const formData = new FormData();
    formData.append("claimTitle", data.claimTitle);
    formData.append("claimContent", data.claimContent);
    formData.append("postId", id);

    try {
      const response = await fetch("/api/upload-claim", {
        method: "POST",
        body: JSON.stringify({ postId: id, body: data }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (response.ok) {
        setConfetti(true);
        if (data.image && data.image.length > 0) {
          const uploadPromises = Array.from(data.image).map((file) => {
            const filePath = `${result.claimId}/${file.name}`;
            return supabase.storage.from("mfqodFiles").upload(filePath, file);
          });
          await Promise.all(uploadPromises);
        }
        reset();
      } else {
        console.error("Failed to upload item.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    if (confetti) {
      setTimeout(() => setConfetti(false), 7000);
    }
  }, [confetti]);

  if (!post) return <p>Loading...</p>;
  <div>
    {post}
  </div>

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {confetti && <ReactConfetti width={window.innerWidth} height={window.innerHeight} />}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h2>
      <p className="text-gray-600 mb-2"><strong>Content:</strong> {post.content}</p>
      <p className="text-gray-600 mb-2"><strong>Place:</strong> {post.place}</p>
      <p className="text-gray-600 mb-4"><strong>Country:</strong> {post.country}</p>

      {/* Toggle Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
      >
        {showForm ? "Hide Claim Form" : "Show Claim Form"}
      </button>

      {/* Claim Form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
          <div>
            <input
              id="claimTitle"
              {...register("claimTitle")}
              type="text"
              placeholder="Enter Title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.claimTitle && <p className="mt-2 text-xs text-red-500">{errors.claimTitle.message}</p>}
          </div>
          <div>
            <input
              id="claimContent"
              {...register("claimContent")}
              type="text"
              placeholder="Provide proof of ownership"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.claimContent && <p className="mt-2 text-xs text-red-500">{errors.claimContent.message}</p>}
          </div>
          <div>
            <label htmlFor="image" className="block text-lg font-semibold text-gray-700">Upload Image(s)</label>
            <input
              type="file"
              id="image"
              multiple
              {...register("image")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.image && <p className="mt-2 text-xs text-red-500">{errors.image.message}</p>}
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
