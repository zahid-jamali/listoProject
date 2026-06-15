/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "67dd-2407-aa80-15-8e3-b490-7cba-d71-f6d0.ngrok-free.app", // Yeh aapka current ngrok domain hai
    "*.ngrok-free.app", // Taake next time ngrok ka domain change bhi ho toh masla na aaye
  ],
};

export default nextConfig;
