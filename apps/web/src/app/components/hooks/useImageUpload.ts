import { useState } from "react";
import { useRouter } from "next/navigation";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export const useImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleFileSelect = (files: File[]) => {
    // Filter allowed types
    const validFiles = files.filter(file => ALLOWED_TYPES.includes(file.type));
    if (validFiles.length !== files.length) {
      setErrorMessage("Only PNG, JPG, JPEG, and WEBP files are allowed.");
      setUploadStatus('error');
      return;
    }
    setSelectedFiles(validFiles);
    setUploadStatus('idle');
    setErrorMessage("");

    // Create previews
    Promise.all(validFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    })).then(setPreviews);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setUploadStatus('error');
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);
    setUploadStatus('idle');
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadResponse = await fetch(`/api/upload_image`, {
            method: "POST",
            body: formData,
        });
        if (!uploadResponse.ok) {
            throw new Error("Failed to upload image");
        }
        const uploadResult = await uploadResponse.json();
        const addResponse = await fetch(`/api/add_image/${uploadResult.filename}`);
        if (!addResponse.ok) {
          throw new Error('Failed to add image to search index');
        }
      }
      setUploadStatus('success');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setUploadStatus('idle');
    setErrorMessage("");
  };

  return {
    selectedFiles,
    previews,
    uploading,
    uploadStatus,
    errorMessage,
    handleFileSelect,
    handleError,
    handleUpload,
    resetUpload,
  };
};
