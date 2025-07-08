import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackendNotFound from "./components/ui/BackendNotFound";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Image Search",
    description: "Search for images using natural language queries",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    try {
        console.log("🩹 Checking backend health...");
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
        const res = await fetch(`${backendUrl}/health`, {
            next: { revalidate: 10 },
        });

        if (!res.ok) {
            return <BackendNotFound />;
        }
    } catch (error) {
        console.error("❌ Error checking backend health:", error);
        return <BackendNotFound />;
    }

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
        </html>
    );
}
