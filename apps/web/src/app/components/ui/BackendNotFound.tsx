"use client";

import React, { useState } from "react";

const BackendNotFound = () => {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRefresh = () => {
        setIsRetrying(true);
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="mb-6">
                    <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-blue-700 mb-3">Backend Not Found</h2>

                <p className="text-blue-600 mb-4">Unable to connect to the image search backend service.</p>

                <p className="text-blue-600 mb-6">
                    The backend service might still be starting up, which can take a few moments. <span className="font-bold">(First boot of the backend takes longer because it needs to download the CLIP model)</span>
                    <br />
                    You can click refresh to try connecting again.
                </p>

                <button onClick={handleRefresh} disabled={isRetrying} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md">
                    {isRetrying ? "Refreshing..." : "Refresh Connection"}
                </button>
            </div>
        </div>
    );
};

export default BackendNotFound;
