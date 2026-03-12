/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '/e-test',
  assetPrefix: '/e-test/',
}
module.exports = nextConfig
