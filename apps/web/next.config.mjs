import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/tokens', '@repo/content', '@repo/shared'],
  outputFileTracingRoot: join(__dirname, '../..'),
}

export default nextConfig
