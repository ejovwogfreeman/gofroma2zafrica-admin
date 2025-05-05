/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://logistics-backend-1-s91j.onrender.com",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
