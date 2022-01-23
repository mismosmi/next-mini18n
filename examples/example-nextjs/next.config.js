/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
  },

  pageExtensions: ["route.tsx", "route.ts"],
};

module.exports = nextConfig;
