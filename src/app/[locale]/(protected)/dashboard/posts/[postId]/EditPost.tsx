'use client';

import { supabase } from "@/lib/supabase";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import ReactConfetti from 'react-confetti'; // Importing the ReactConfetti component
import { OrgPlaces } from "@/app/storage";

type ItemFormFields = {
  title: string;
  content: string;
  type: string;
  place: string;
  country: string;
  orgnization: string;
  image: FileList;
};

export default function EditPost() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<ItemFormFields>();
  const [organization, setOrganization] = useState<string>(''); // State for organization
  const [placeOptions, setPlaceOptions] = useState<string[]>([]); // State for dynamically updating place options
  const [confetti, setConfetti] = useState(false); // State to trigger confetti animation



  // Handle form submission
  const onSubmit: SubmitHandler<ItemFormFields> = async (data) => {
    console.log(data);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("type", data.type);
    formData.append("place", data.place);
    formData.append("country", data.country);
    formData.append("orgnization", data.orgnization);

    try {
      const response = await fetch("/;ldksf adl;fksa", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Item uploaded successfully.");
        setConfetti(true); // Trigger confetti animation

        if (data.image && data.image.length > 0) {
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

          await fetch("/api/save-post-images", {
            method: "POST",
            body: JSON.stringify({
              postId: result.postId,
              imageUrls: imageUrls,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          console.log("All images uploaded and URLs saved to the database:", imageUrls);
        }

        reset(); // Reset the form after submission
      } else {
        console.error("Failed to upload item.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle organization change and update places
  const handleOrganizationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrg = e.target.value;
    setOrganization(selectedOrg);

    // Get the places related to the selected organization
    const selectedOrgData = OrgPlaces.find(org => Object.keys(org)[0] === selectedOrg);
    if (selectedOrgData) {
      const places = Object.values(selectedOrgData)[0]; // Get places array
      setPlaceOptions(places);
      setValue("place", ""); // Reset the selected place
    } else {
      setPlaceOptions([]); // Reset places if no organization is selected
    }
  };

  // Set default place options on mount or when the organization changes
  useEffect(() => {
    if (organization) {
      const selectedOrgData = OrgPlaces.find(org => Object.keys(org)[0] === organization);
      if (selectedOrgData) {
        const places = Object.values(selectedOrgData)[0]; // Get places array
        setPlaceOptions(places);
      }
    }
  }, [organization]);

  // Reset the confetti animation after a few seconds
  useEffect(() => {
    if (confetti) {
      setTimeout(() => {
        setConfetti(false);
      }, 7000); // Hide the confetti after 3 seconds
    }
  }, [confetti]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {confetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}
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
            value={organization} // Bind to the organization state
            {...register("orgnization", { required: "Please select an organization" })}
            onChange={handleOrganizationChange} // Trigger handleOrganizationChange on selection
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {/* Display "Select Organization" first */}
            <option value="" disabled>Select Organization</option>
            {OrgPlaces.map((org, index) => {
              const orgName = Object.keys(org)[0];
              return (
                <option key={index} value={orgName}>{orgName}</option>
              );
            })}
          </select>
          {errors.orgnization && <p className="mt-2 text-xs text-red-500">{errors.orgnization.message}</p>}
        </div>

        {/* Select Place */}
        {placeOptions.length > 0 && (
          <div>
            <label htmlFor="place" className="block text-lg font-semibold text-gray-700">Place</label>
            <select
              id="place"
              {...register("place", { required: "Please select a place" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Select Place</option>
              {placeOptions.map((place, index) => (
                <option key={index} value={place}>{place}</option>
              ))}
            </select>
            {errors.place && <p className="mt-2 text-xs text-red-500">{errors.place.message}</p>}
          </div>
        )}

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
