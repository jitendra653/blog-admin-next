/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'reactadvance.s3.eu-north-1.amazonaws.com',
              port: '',
              pathname: '/**',
            },
          ],
        // domains: ['reactadvance.s3.eu-north-1.amazonaws.com'],
    },
    reactStrictMode: false,
    eslint: {
      ignoreDuringBuilds: true,
    },

};

export default nextConfig;
