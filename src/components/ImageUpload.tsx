import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  className?: string;
}

const ImageUpload = ({ onUpload, className }: ImageUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".tiff"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(`
        detection-card cursor-pointer
        flex flex-col items-center justify-center
        min-h-[120px] gap-4 transition-all duration-300
        hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20
        ${isDragActive ? "border-primary ring-1 ring-primary" : ""}
      `, className)}
    >
      <input {...getInputProps()} />
      <Upload className="w-6 h-6 text-primary" />
      <p className="text-center text-sm">
        {isDragActive
          ? "Drop the image here"
          : "Drop satellite image here, or click to select"}
      </p>
    </div>
  );
};

export default ImageUpload;