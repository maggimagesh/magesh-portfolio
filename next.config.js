/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
