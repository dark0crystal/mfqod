'use client';  // Ensures this is a client-side component

import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";  // Import Zod for validation
import { zodResolver } from "@hookform/resolvers/zod";  // Import Zod resolver
import ReactConfetti from 'react-confetti';  // Importing ReactConfetti

// Define Zod validation schema
const schema = z.object({
  claimTitle: z.string().min(1, { message: "The Field is required!" }),
  claimContent: z.string().min(1, { message: "Please select a place" }),
  image: z
    .any()
    .refine((files) => files.length > 0, { message: "Please upload at least one image" })  // Ensure that images are uploaded
});

type FormFields = {
  claimTitle: string;
  claimContent: string;
  image: FileList;
};

export default function PostDetails({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any | null>(null);  // State to store post details
  const [confetti, setConfetti] = useState(false);  // State for confetti animation
  const { id } = params;

  // UseForm hook with Zod for form validation
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  // Fetch post details using useEffect
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

  // Handle form submission
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log("This is data:", data);

    const formData = new FormData();
    formData.append("claimTitle", data.claimTitle);
    formData.append("claimContent", data.claimContent);
    formData.append("postId", id);

    console.log("This is form data", formData);

    try {
      const response = await fetch("/api/upload-claim", {
        method: "POST",
        body: JSON.stringify({ postId: id, body: data }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Claim uploaded successfully.");
        setConfetti(true);  // Trigger confetti on success
        console.log("Before image:", data.image);

        if (data.image && data.image.length > 0) {
          const uploadPromises = Array.from(data.image).map((file) => {
            const filePath = `${result.claimId}/${file.name}`;
            return supabase.storage
              .from("mfqodFiles")
              .upload(filePath, file)
              .then(({ error, data: uploadedData }) => {
                if (error) {
                  console.error(`Failed to upload image: ${error.message}`, { filePath });
                  throw new Error(`Failed to upload image: ${error.message}`);
                } else {
                  console.log("Uploaded image:", uploadedData);
                  return uploadedData?.path;
                }
              })
              .catch((error) => {
                console.error(`Error uploading file ${file.name}:`, error.message);
                return null;
              });
          });

          const uploadedFilesKeys = await Promise.all(uploadPromises);

          const imageUrls = uploadedFilesKeys.map((fileKey) => {
            if (fileKey) {
              return `https://ggrrwpwyqbblxoxidpmn.supabase.co/storage/v1/object/public/mfqodFiles/${fileKey}`;
            }
            return null;
          }).filter(Boolean);

          console.log("The image URLs in client before sending:", imageUrls);

          await fetch("/api/save-claim-image", {
            method: "POST",
            body: JSON.stringify({
              claimId: result.claimId,
              imageUrls: imageUrls,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          console.log("All images uploaded and URLs saved to the database:", imageUrls);
        }

        reset(); // Reset the form
      } else {
        console.error("Failed to upload item.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Reset confetti after 3 seconds
  useEffect(() => {
    if (confetti) {
      setTimeout(() => {
        setConfetti(false);  // Hide confetti after 3 seconds
      }, 7000);
    }
  }, [confetti]);

  if (!post) return <p>Loading...</p>; // Display loading while fetching

  return (
    <div className="w-full max-w-4xl p-8 mt-6 bg-gray-200">
      {confetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}
      <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
      <p><strong>Content:</strong> {post.content}</p>
      <p><strong>Place:</strong> {post.place}</p>
      <p><strong>Country:</strong> {post.country}</p>

      {/* Claim Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
        {/* Claim Title Input */}
        <div>
          <input
            id="claimTitle"
            {...register("claimTitle")}
            type="text"
            placeholder="أكتب عنوان"
            className="p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.claimTitle && <p className="mt-2 text-xs text-red-500">{errors.claimTitle.message}</p>}
        </div>

        {/* Claim Content Input */}
        <div>
          <input
            id="claimContent"
            {...register("claimContent")}
            type="text"
            placeholder="أعطيني معلومات تثبت أنه مالك"
            className="p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.claimContent && <p className="mt-2 text-xs text-red-500">{errors.claimContent.message}</p>}
        </div>

        {/* Image Upload Input */}
        <div>
          <label htmlFor="image" className="block text-lg font-semibold text-gray-700">Upload Image(s)</label>
          <input
            type="file"
            id="image"
            multiple // Allow multiple image selection
            {...register("image", { required: "This field is required" })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.image && <p className="mt-2 text-xs text-red-500">{errors.image.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isSubmitting ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
      {/* End of Claim Form */}
    </div>
  );
}
