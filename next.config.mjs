/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/subastas", destination: "/edictos", permanent: true },
      { source: "/subastas/:id", destination: "/edictos/:id", permanent: true },
    ]
  },
}

export default nextConfig
