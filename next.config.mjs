/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
    env: {
    JWT_SECRET: process.env.JWT_SECRET,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    ACQUIRED_API_URL: process.env.ACQUIRED_API_URL,
    ACQUIRED_APP_ID: process.env.ACQUIRED_APP_ID,
    ACQUIRED_APP_KEY: process.env.ACQUIRED_APP_KEY,
    ACQUIRED_APP_PUBLIC_KEY: process.env.ACQUIRED_APP_PUBLIC_KEY,
    ACQUIRED_APP_COMPANY_ID: process.env.ACQUIRED_APP_COMPANY_ID,
    MONGO_URI: process.env.MONGO_URI,
    WEBHOOK_URL: process.env.WEBHOOK_URL,
    CONTACT_URL: process.env.CONTACT_URL,
    REDIRECT_URL: process.env.REDIRECT_URL,
  },
};

export default nextConfig;
