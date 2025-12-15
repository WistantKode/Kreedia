/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        domains: [
            'lh3.googleusercontent.com', // Google profile images
            'images.unsplash.com',       // Unsplash images (if used)
            'via.placeholder.com',       // Placeholder images
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    webpack: (config) => {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true, // Active top-level await
        };
        config.resolve.fallback = { fs: false };

        return config;
    },
};

export default nextConfig;