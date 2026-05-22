import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // @local-llm/client は file: 依存(ローカルワークスペース)で配置されているため、
    // Next.js (Turbopack) に明示的に transpile 対象であることを伝える。
    transpilePackages: ['@local-llm/client'],
};

export default nextConfig;
