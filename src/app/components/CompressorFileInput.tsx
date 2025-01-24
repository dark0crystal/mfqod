"use client";

import React, { useState } from "react";
import Compressor from "compressorjs";

interface CompressorFileInputProps {
  onFilesSelected: (compressedFiles: File[]) => void;
}

const CompressorFileInput: React.FC<CompressorFileInputProps> = ({
  onFilesSelected,
}) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const compressedFiles: File[] = [];
    const imagePreviews: string[] = [];

    Array.from(files).forEach((file) => {
      // Compress each file using Compressor.js
      new Compressor(file, {
        quality: 0.6,
        maxWidth: 1024,
        success: (compressedFile: File) => {
          compressedFiles.push(compressedFile);
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              imagePreviews.push(reader.result.toString());
            }
          };
          reader.readAsDataURL(compressedFile);

          if (compressedFiles.length === files.length) {
            setPreviewImages(imagePreviews);
            onFilesSelected(compressedFiles);
          }
        },
        error: (err: any) => console.error("Compression error:", err),
      });
    });
  };

  return (
    <div>
      <label
        htmlFor="compressed-file-input"
        className="block text-lg font-semibold text-gray-700"
      >
        Upload Image(s)
      </label>
      <input
        type="file"
        id="compressed-file-input"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {previewImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Preview ${index}`}
            className="w-24 h-24 object-cover rounded-lg shadow-md"
          />
        ))}
      </div>
    </div>
  );
};

export default CompressorFileInput;
