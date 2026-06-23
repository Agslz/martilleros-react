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
      { source: "/panel/fianzas", destination: "/panel/credenciales", permanent: true },
    ]
  },
  async rewrites() {
    const backendUrl = (
      process.env.BACKEND_URL ??
      process.env.RAILWAY_BACKEND_URL ??
      "http://127.0.0.1:8080"
    ).replace(/\/$/, "")

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
