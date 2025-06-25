import type { NextConfig } from "next";

const backend = process.env.BACKEND_URL;

const nextConfig: NextConfig = {
    output: "standalone",
    async rewrites() {
        return [
            {
                source: "/images/:path*",
                destination: `${backend}/images/:path*`,
            },
            {
                source: "/api/:path*",
                destination: `${backend}/:path*`,
            },
        ];
    },

    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8000",
                pathname: "/images/**",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "8000",
                pathname: "/images/**",
            },
            {
                protocol: "http",
                hostname: "backend",
                port: "8000",
                pathname: "/images/**",
            },
        ],
    },

    skipTrailingSlashRedirect: true,
};

export default nextConfig;
