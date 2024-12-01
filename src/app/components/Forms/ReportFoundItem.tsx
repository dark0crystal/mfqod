'use client'; // Ensure this component is executed on the client side

import { supabase } from "@/lib/supabase";
import { SubmitHandler, useForm } from "react-hook-form";

type ItemFormFields = {
  title: string;
  content: string;
  type: string;
  place: string;
  country: string;
  orgnization: string;
  image: FileList; // New field for the images
};

export default function ReportFoundItem() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ItemFormFields>();

  // Handle form submission
  const onSubmit: SubmitHandler<ItemFormFields> = async (data) => {
    console.log(data);

    // Create FormData object for text fields (excluding images)
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("type", data.type);
    formData.append("place", data.place);
    formData.append("country", data.country);
    formData.append("orgnization", data.orgnization);

    try {
      // Send data to API for item creation
      const response = await fetch("/api/upload-found-item", {
        method: "POST",
        body: JSON.stringify(data), // Send as JSON for text data
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Item uploaded successfully.");

        // Check if images are uploaded
        if (data.image && data.image.length > 0) {
          // Use Promise.all to upload all images asynchronously
          const uploadPromises = Array.from(data.image).map((file) => {
            const filePath = `${result.postId}/${file.name}`;
            return supabase.storage
              .from("mfqodFiles")
              .upload(filePath, file)
              .then(({ error, data: uploadedData }) => {
                if (error) {
                  console.error(`Failed to upload image: ${error.message}`, { filePath });
                  throw new Error(`Failed to upload image: ${error.message}`);
                } else {
                  console.log("Uploaded image:", uploadedData);
                  return uploadedData?.path; // Return the key for the uploaded file
                  
                }
              })
              .catch((error) => {
                console.error(`Error uploading file ${file.name}:`, error.message);
                return null; // Handle failed image uploads gracefully
              });
          });

          // Wait for all image uploads to finish
          const uploadedFilesKeys = await Promise.all(uploadPromises);

          // Construct URLs for all uploaded images
          const imageUrls = uploadedFilesKeys.map((fileKey) => {
            if (fileKey) {
              return `https://ggrrwpwyqbblxoxidpmn.supabase.co/storage/v1/object/public/mfqodFiles/${fileKey}`;
            }
            return null;
          }).filter(Boolean); // Filter out any null URLs
          console.log("the images url in client before sending :",imageUrls)
          // Now save the URLs in the database for the post
          await fetch("/api/save-post-images", {
            method: "POST",
            body: JSON.stringify({
              postId: result.postId,  // The post ID returned from the first API
              imageUrls: imageUrls,   // List of image URLs
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Report Found Item</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-lg font-semibold text-gray-700">What did you find?</label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "This field is required" })}
            placeholder="e.g., Key, Wallet, etc."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.title && <p className="mt-2 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        {/* Content Input */}
        <div>
          <label htmlFor="content" className="block text-lg font-semibold text-gray-700">Details</label>
          <input
            type="text"
            id="content"
            {...register("content", { required: "Please provide additional details" })}
            placeholder="Provide additional details about the item"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.content && <p className="mt-2 text-xs text-red-500">{errors.content.message}</p>}
        </div>

        {/* Type Input */}
        <div>
          <label htmlFor="type" className="block text-lg font-semibold text-gray-700">Type of Item</label>
          <input
            type="text"
            id="type"
            {...register("type", { required: "This field is required" })}
            placeholder="Type of item (e.g., Wallet, Phone)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.type && <p className="mt-2 text-xs text-red-500">{errors.type.message}</p>}
        </div>

        {/* Image upload Input */}
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

        {/* Select Organization */}
        <div>
          <label htmlFor="orgnization" className="block text-lg font-semibold text-gray-700">Organization</label>
          <select
            id="orgnization"
            {...register("orgnization", { required: "Please select an organization" })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>Select Organization</option>
            <option value="SQU">SQU</option>
            <option value="UTAS Muscat">UTAS Muscat</option>
            <option value="UTAS Nizwa">UTAS Nizwa</option>
            <option value="UTAS Ibra">UTAS Ibra</option>
            <option value="NIZWA Uni">NIZWA Uni</option>
          </select>
          {errors.orgnization && <p className="mt-2 text-xs text-red-500">{errors.orgnization.message}</p>}
        </div>

        {/* Select Country */}
        <div>
          <label htmlFor="country" className="block text-lg font-semibold text-gray-700">Country</label>
          <select
            id="country"
            {...register("country", { required: "Please select a country" })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Oman">Oman</option>
          </select>
          {errors.country && <p className="mt-2 text-xs text-red-500">{errors.country.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
