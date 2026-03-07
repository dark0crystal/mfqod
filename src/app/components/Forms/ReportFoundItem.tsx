"use client";

import { supabase } from "@/lib/supabase";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";
import DataProvider from "@/app/storage";
import CompressorFileInput from "../CompressorFileInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

type ItemFormFields = {
  title: string;
  content: string;
  type: string;
  branchId: string;
};

type ReportFoundItemProps = {
  successRedirect?: string;
};

export default function ReportFoundItem({ successRedirect }: ReportFoundItemProps = {}) {
  const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ItemFormFields>();
  const [compressedFiles, setCompressedFiles] = useState<File[]>([]);
  const [confetti, setConfetti] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const c = useTranslations("report-found");
  const { branches } = DataProvider();
  const router = useRouter();

 

  const onSubmit: SubmitHandler<ItemFormFields> = async (data) => {
    try {
      setIsProcessing(true);
      const response = await fetch("/api/upload-found-item", {
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          type: data.type,
          branchId: data.branchId,
        }),
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
                return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/mfqodFiles/${fileKey}`;
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
        
        // Redirect after successful submission and a short delay for confetti
        setTimeout(() => {
          router.push(successRedirect ?? "/");
        }, 3000);
      } else {
        console.error("Failed to upload item.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (confetti) {
      const timer = setTimeout(() => {
        setConfetti(false);
      }, 7000);
      return () => clearTimeout(timer);
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
      <h2 className="text-2xl font-bold text-center text-primary mb-6">
        {c("title")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      

        {/* Title Input */}
        <div>
          <label htmlFor="title" className="form-label">{c("whatDidYouFind")}</label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "This field is required" })}
            placeholder="e.g., Key, Wallet, etc."
            className="form-input"
          />
          {errors.title && <p className="mt-2 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        {/* Content Input */}
        <div>
          <label htmlFor="content" className="form-label">{c("Details")}</label>
          <input
            type="text"
            id="content"
            {...register("content", { required: "Please provide additional details" })}
            placeholder="Provide additional details about the item"
            className="form-input"
          />
          {errors.content && <p className="mt-2 text-xs text-red-500">{errors.content.message}</p>}
        </div>

        {/* Type Input */}
        <div>
          <label htmlFor="type" className="form-label">{c("type")}</label>
          <input
            type="text"
            id="type"
            {...register("type", { required: "This field is required" })}
            placeholder="Type of item (e.g., Wallet, Phone)"
            className="form-input"
          />
          {errors.type && <p className="mt-2 text-xs text-red-500">{errors.type.message}</p>}
        </div>

        <CompressorFileInput onFilesSelected={setCompressedFiles} />

        {/* Select Branch */}
        <div>
          <Controller
            name="branchId"
            control={control}
            rules={{ required: "Please select a branch" }}
            render={({ field }) => (
              <CustomSelect
                id="branchId"
                label={c("organization")}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder={c("selectOrganization")}
                options={[
                  { value: "", label: c("selectOrganization") },
                  ...branches.map((b) => ({
                    value: b.id,
                    label: b.country ? `${b.nameEn} (${b.country.nameEn})` : b.nameEn,
                  })),
                ]}
              />
            )}
          />
          {errors.branchId && <p className="mt-2 text-xs text-red-500">{errors.branchId.message}</p>}
        </div>

        <div className="text-center">
          <button 
            type="submit" 
            disabled={isSubmitting || isProcessing} 
            className="w-full btn-primary"
          >
            {isSubmitting || isProcessing ? "Processing..." : "Submit"}
          </button>
        </div>
        <div className="text-center">
          <h1>{c("note")}</h1>
        </div>
      </form>
    </div>
  );
}
