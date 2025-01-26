"use client";

import { supabase } from "@/lib/supabase";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";
import DataProvider from "@/app/storage";
import CompressorFileInput from "../CompressorFileInput";
import { useTranslations } from "next-intl";

type ItemFormFields = {
  title: string;
  content: string;
  type: string;
  place: string;
  country: string;
  orgnization: string;
};

export default function ReportFoundItem() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<ItemFormFields>();
  const [organization, setOrganization] = useState<string>("");
  const [placeOptions, setPlaceOptions] = useState<{ key: string; name: string }[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<File[]>([]);
  const [confetti, setConfetti] = useState(false);
  const t= useTranslations("storage")
  const {OrgPlaces} =DataProvider()

  const onSubmit: SubmitHandler<ItemFormFields> = async (data) => {
    console.log(data);

    try {
      const response = await fetch("/api/upload-found-item", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Item uploaded successfully.");
        setConfetti(true);

        if (compressedFiles.length > 0) {
          const uploadPromises = compressedFiles.map((file) => {
            const filePath = `${result.postId}/${file.name}`;
            return supabase.storage
              .from("mfqodFiles")
              .upload(filePath, file)
              .then(({ error, data: uploadedData }) => {
                if (error) {
                  console.error(`Failed to upload image: ${error.message}`);
                  throw new Error(`Failed to upload image: ${error.message}`);
                } else {
                  console.log("Uploaded image:", uploadedData);
                  return uploadedData?.path;
                }
              });
          });

          const uploadedFilesKeys = await Promise.all(uploadPromises);

          const imageUrls = uploadedFilesKeys
            .map((fileKey) => {
              if (fileKey) {
                return `https://ggrrwpwyqbblxoxidpmn.supabase.co/storage/v1/object/public/mfqodFiles/${fileKey}`;
              }
              return null;
            })
            .filter(Boolean);

          await fetch("/api/save-post-images", {
            method: "POST",
            body: JSON.stringify({
              postId: result.postId,
              imageUrls,
            }),
            headers: { "Content-Type": "application/json" },
          });

          console.log("All images uploaded and URLs saved to the database:", imageUrls);
        }

        reset();
      } else {
        console.error("Failed to upload item.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrg = e.target.value;
    console.log("before",selectedOrg)
    setOrganization(selectedOrg);
    console.log("after" ,organization)

    const selectedOrgData = OrgPlaces.find(
      (org) => org.key === selectedOrg
      
    );
    console.log("after",selectedOrgData)
    if (selectedOrgData) {
      console.log(selectedOrgData)
      const places = selectedOrgData.places;
      console.log(places)
      setPlaceOptions(places);
      setValue("place", "");
    } else {
      setPlaceOptions([]);
    }
  };

  useEffect(() => {
    if (organization) {
      const selectedOrgData = OrgPlaces.find(
        (org) => org.key === organization
      );
      if (selectedOrgData) {
        const places = selectedOrgData.places;
        setPlaceOptions(places);
      }
    }
  }, [organization]);

  useEffect(() => {
    if (confetti) {
      setTimeout(() => {
        setConfetti(false);
      }, 7000);
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
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        Report Found Item
      </h2>

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

        <CompressorFileInput onFilesSelected={setCompressedFiles} />

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
                <option key={index} value={org.key}>{t(`org.${org.key}`)}</option>
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
                <option key={index} value={place.key}>{place.name}</option>
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
        
        <div className="text-center">
          <button type="submit" disabled={isSubmitting} className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400">
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
