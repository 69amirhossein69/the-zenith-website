/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://zhilwbvzrspnxqoehcuz.supabase.co/storage/v1/object/public/cabin-images/**"
      ),
    ],
  },
  // output: "export",
};

export default nextConfig;
