/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.STATIC_EXPORT === "true" ? "export" : "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
