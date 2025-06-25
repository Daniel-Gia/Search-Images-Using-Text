import { useRef } from "react";

interface UploadDropZoneProps {
  onFileSelect: (files: File[]) => void;
  onError: (message: string) => void;
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export default function UploadDropZone({ onFileSelect, onError }: UploadDropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList | File[]): File[] => {
    const arr = Array.from(files);
    const valid = arr.filter(file => ALLOWED_TYPES.includes(file.type));
    if (valid.length !== arr.length) {
      onError("Only PNG, JPG, JPEG, and WEBP files are allowed.");
      return [];
    }
    return valid;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const valid = validateFiles(files);
      if (valid.length > 0) onFileSelect(valid);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const valid = validateFiles(files);
      if (valid.length > 0) onFileSelect(valid);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-blue-50 hover:bg-blue-100"
      onClick={() => fileInputRef.current?.click()}
    >
      <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <h3 className="text-xl font-semibold text-blue-900 mb-2">Upload Images</h3>
      <p className="text-blue-700 mb-4">
        Drag and drop your images here, or click to browse
      </p>
      <p className="text-sm text-blue-600">
        Supports: PNG, JPG, JPEG, WEBP
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
