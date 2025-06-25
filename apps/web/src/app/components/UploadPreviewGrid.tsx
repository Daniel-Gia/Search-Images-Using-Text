import Image from "next/image";

interface UploadPreviewGridProps {
  previews: string[];
  files: File[];
  onRemove?: (index: number) => void;
}

export default function UploadPreviewGrid({ previews, files, onRemove }: UploadPreviewGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {previews.map((preview, idx) => (
        <div key={idx} className="relative group border rounded-lg overflow-hidden bg-gray-50">
          <Image src={preview} alt={files[idx]?.name || `Image ${idx+1}`} width={200} height={200} className="object-cover w-full h-40" />
          <div className="p-2 text-xs text-center truncate">{files[idx]?.name}</div>
          {onRemove && (
            <button
              type="button"
              className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100"
              onClick={() => onRemove(idx)}
              aria-label="Remove image"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
