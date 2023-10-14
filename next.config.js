/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});
const nextConfig = {}

module.exports = withPWA({
  // Your Next.js config
  experimental: {
    serverActions: true
  },
  images: {
    domains: ['plmqhcualnnsirfqjcsj.supabase.co'],
  }
});
