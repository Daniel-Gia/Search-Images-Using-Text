"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Link from "next/link";
import ImageGrid from "./components/ImageGrid";

interface SearchResult {
  filename: string;
  score: number;
}

type RawSearchResult = [string, number] | SearchResult;

export default function Home() {
    const [images, setImages] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const fetchImages = useCallback(async () => {
        try {
            setLoading(true);
            console.log("Fetching images from: /api/list_images");
            const response = await fetch(`/api/list_images`);
            const imageList = await response.json();
            console.log("Images fetched:", imageList);
            setImages(imageList);
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        try {
            setLoading(true);
            setIsSearching(true);

            const encodedQuery = encodeURIComponent(searchQuery);
            const response = await fetch(`/api/search_images/${encodedQuery}`);
            const data = await response.json();
            console.log("Search API response:", data);
            console.log("Search results array:", data.results);

            if (data.results && Array.isArray(data.results)) {
                // Convert array format to object format if needed
                const normalizedResults = data.results
                    .map((result: RawSearchResult) => {
                        if (Array.isArray(result) && result.length >= 2) {
                            return {
                                filename: result[0],
                                score: result[1],
                            };
                        } else if (result && typeof result === "object" && "filename" in result) {
                            return {
                                filename: result.filename,
                                score: result.score,
                            };
                        } else {
                            console.warn("Invalid result format:", result);
                            return null;
                        }
                    })
                    .filter(Boolean); // Remove null entries

                console.log("Normalized results:", normalizedResults);
                setSearchResults(data.results);
            } else {
                console.warn("No results array found in response");
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Error searching images:", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setIsSearching(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header
                title="Image Search Gallery"
                actionButton={{
                    href: "/upload",
                    text: "Upload Image",
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    ),
                }}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SearchBar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} onSearch={handleSearch} onClear={clearSearch} loading={loading} isSearching={isSearching} resultsCount={searchResults.length} />

                <ImageGrid images={images} searchResults={searchResults} isSearching={isSearching} loading={loading} />

                {!isSearching && images.length === 0 && !loading && (
                    <div className="text-center py-8">
                        <Link href="/upload" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Upload Image
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
