interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onClear: () => void;
  loading: boolean;
  isSearching: boolean;
  resultsCount?: number;
}

export default function SearchBar({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onClear,
  loading,
  isSearching,
  resultsCount = 0
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-200">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search for images using text descriptions..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 placeholder-gray-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            {loading ? "Searching..." : "Search"}
          </button>
          {isSearching && (
            <button
              onClick={onClear}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {isSearching && (
        <p className="mt-3 text-blue-700 font-medium">
          Found {resultsCount} result(s) for &quot;{searchQuery}&quot;
        </p>
      )}
    </div>
  );
}
