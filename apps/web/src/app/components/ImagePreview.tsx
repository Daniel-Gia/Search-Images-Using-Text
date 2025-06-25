import Image from "next/image";

interface ImagePreviewProps {
  file: File;
  preview: string;
  onUpload: () => void;
  onReset: () => void;
  uploading: boolean;
}

export default function ImagePreview({ file, preview, onUpload, onReset, uploading }: ImagePreviewProps) {
  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="bg-gray-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Preview</h3>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <div className="w-64 h-64 relative rounded-lg overflow-hidden border-2 border-blue-300">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Filename</label>
              <p className="text-gray-700 bg-white p-2 rounded border">{file.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">File Size</label>
              <p className="text-gray-700 bg-white p-2 rounded border">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">File Type</label>
              <p className="text-gray-700 bg-white p-2 rounded border">{file.type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onUpload}
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Image
            </>
          )}
        </button>
        <button
          onClick={onReset}
          disabled={uploading}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md"
        >
          Choose Different Image
        </button>
      </div>
    </div>
  );
}
