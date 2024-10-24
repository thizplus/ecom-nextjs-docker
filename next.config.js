/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  reactStrictMode: false,
  output: 'standalone',
  webpack: config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      resolve: {
        fullySpecified: false
      }
    })

    return config
  }
}

module.exports = nextConfig
