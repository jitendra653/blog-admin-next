"use client";

import React,{ useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";

interface UploadFormProps {
  setImageUrl: (url: string) => void;
  setError: (error: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ setImageUrl, setError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setImageUrl(data.fileName);
      } else {
        toast.error(data?.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("An error occurred during the upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit" disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default UploadForm;