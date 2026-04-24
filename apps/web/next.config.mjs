/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/tokens', '@repo/content', '@repo/shared'],
}

export default nextConfig
