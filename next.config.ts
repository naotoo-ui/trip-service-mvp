import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        // Wikipedia 上の画像を Next.js Image で扱えるよう許可
        remotePatterns: [
            { protocol: 'https', hostname: 'upload.wikimedia.org' },
        ],
    },
};

export default nextConfig;
