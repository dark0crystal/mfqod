"use client";

import React, { useState, useRef, useCallback } from "react";
import Compressor from "compressorjs";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface CompressorFileInputProps {
  onFilesSelected: (compressedFiles: File[]) => void;
}

const IMAGE_ACCEPT = "image/*";

function processFileList(
  fileList: FileList | null,
  currentCompressed: File[],
  currentPreviews: string[],
  onDone: (newCompressed: File[], newPreviews: string[]) => void,
  onError: (err: unknown) => void
) {
  if (!fileList || fileList.length === 0) return;

  const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
  if (files.length === 0) return;

  const newCompressedFiles: File[] = [];
  const newPreviews: string[] = [];
  let processed = 0;

  files.forEach((file) => {
    new Compressor(file, {
      quality: 0.6,
      maxWidth: 1024,
      success: (compressedFile: File) => {
        newCompressedFiles.push(compressedFile);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) newPreviews.push(reader.result.toString());
          processed++;
          if (processed === files.length) {
            onDone(
              [...currentCompressed, ...newCompressedFiles],
              [...currentPreviews, ...newPreviews]
            );
          }
        };
        reader.readAsDataURL(compressedFile);
      },
      error: (err) => {
        onError(err);
        processed++;
        if (processed === files.length) {
          onDone(
            [...currentCompressed, ...newCompressedFiles],
            [...currentPreviews, ...newPreviews]
          );
        }
      },
    });
  });
}

const CompressorFileInput: React.FC<CompressorFileInputProps> = ({
  onFilesSelected,
}) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations("report-found");

  const applyNewFiles = useCallback(
    (newCompressed: File[], newPreviews: string[]) => {
      setCompressedFiles(newCompressed);
      setPreviewImages(newPreviews);
      onFilesSelected(newCompressed);
    },
    [onFilesSelected]
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      processFileList(
        fileList,
        compressedFiles,
        previewImages,
        applyNewFiles,
        (err) => console.error("Compression error:", err)
      );
    },
    [compressedFiles, previewImages, applyNewFiles]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) handleFiles(files);
  };

  const handleZoneClick = () => {
    inputRef.current?.click();
  };

  const handleDeleteImage = (index: number) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    const updatedFiles = compressedFiles.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
    setCompressedFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const fileCount = compressedFiles.length;
  const statusText =
    fileCount > 0
      ? t("filesChosen", { count: fileCount })
      : t("noFilesChosen");

  return (
    <div>
      <label htmlFor="compressed-file-input" className="form-label">
        {t("uploadImages")}
      </label>

      <input
        ref={inputRef}
        type="file"
        id="compressed-file-input"
        multiple
        accept={IMAGE_ACCEPT}
        onChange={handleInputChange}
        className="sr-only"
        aria-label={t("chooseFiles")}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={handleZoneClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleZoneClick();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label={t("dragDropHint")}
        className={`
          relative min-h-[140px] rounded-2xl border-2 border-dashed transition
          flex flex-col items-center justify-center gap-2 cursor-pointer py-6 px-4
          bg-[var(--color-form-bg)] text-[var(--color-form-label)]
          hover:border-primary/50 hover:bg-primary-light/30
          ${isDragging ? "border-primary bg-primary-light/50" : "border-gray-300"}
        `}
      >
        <span className="text-center px-4 text-sm font-medium">
          {t("dragDropHint")}
        </span>
        <span className="text-xs">
          {statusText}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {previewImages.map((src, index) => (
          <div
            key={index}
            className="relative w-24 h-24 overflow-hidden rounded-xl shadow-md"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(index);
              }}
              className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white text-sm hover:bg-red-600"
              aria-label="Remove image"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompressorFileInput;
