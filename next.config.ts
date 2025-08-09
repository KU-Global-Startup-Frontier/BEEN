import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 빌드 시 ESLint 에러를 무시합니다 (임시)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 타입 에러가 있어도 빌드를 계속합니다 (임시)
    ignoreBuildErrors: false,
  }
};

export default nextConfig;
