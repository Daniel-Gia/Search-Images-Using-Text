import Image from "next/image";

interface SearchResult {
  filename: string;
  score: number;
}

interface ImageGridProps {
    images?: string[];
    searchResults?: SearchResult[];
    isSearching: boolean;
    loading: boolean;
}

export default function ImageGrid({ images = [], searchResults = [], isSearching, loading }: ImageGridProps) {
    if (loading && !isSearching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const hasResults = isSearching ? searchResults.length > 0 : images.length > 0;

    if (!hasResults) {
        return (
            <div className="text-center py-16">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto border border-blue-200">
                    <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{isSearching ? "No results found" : "No images found"}</h3>
                    <p className="text-gray-600 mb-4">{isSearching ? "Try adjusting your search terms" : "Upload your first image to get started"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {isSearching
                ? searchResults.map((result, index) => (
                      <div key={`${result.filename}-${index}`} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300 overflow-hidden group">
                          <div className="aspect-square relative overflow-hidden">
                              <Image
                                  src={`/images/${result.filename}`}
                                  alt={result.filename}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                  onError={() => {
                                      console.error("Image failed to load:", `$/images/${result.filename}`);
                                  }}
                              />
                          </div>
                          <div className="p-3">
                              <p className="text-sm text-gray-600 truncate" title={result.filename}>
                                  {result.filename}
                              </p>
                              <p className="text-xs text-blue-600 font-semibold mt-1">Score: {result.score?.toFixed(1) || 0}%</p>
                          </div>
                      </div>
                  ))
                : images.map((filename) => (
                      <div key={filename} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300 overflow-hidden group">
                          <div className="aspect-square relative overflow-hidden">
                              <Image
                                  src={`/images/${filename}`}
                                  alt={filename}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                  onError={() => {
                                      console.error("Image failed to load:", `/images/${filename}`);
                                  }}
                              />
                          </div>
                          <div className="p-3">
                              <p className="text-sm text-gray-600 truncate" title={filename}>
                                  {filename}
                              </p>
                          </div>
                      </div>
                  ))}
        </div>
    );
}
