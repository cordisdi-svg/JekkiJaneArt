/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
