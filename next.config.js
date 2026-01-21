/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
    reactStrictMode: true,
    experimental: {
        // Reduce hydration mismatches
        optimizeCss: false,
        // Optimización de paquetes
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    },

    // Optimización de imágenes
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60, // 1 minuto
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // Compresión
    compress: true,

    // Optimización del build
    poweredByHeader: false,

    // Configuración de headers para caché
    async headers() {
        return [
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            {
                source: '/images/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, immutable'
                    }
                ]
            },
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate'
                    }
                ]
            }
        ]
    },

    // Webpack optimization
    webpack: (config, { isServer }) => {
        // Optimización para cliente
        if (!isServer) {
            config.resolve.fallback.fs = false
            config.resolve.fallback.net = false
            config.resolve.fallback.tls = false
        }

        // Tree shaking optimizado
        config.optimization.usedExports = true
        config.optimization.sideEffects = false

        // Optimización de chunk splitting
        config.optimization.splitChunks = {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'all',
                    enforce: true,
                },
            },
        }

        return config
    }
}

module.exports = withBundleAnalyzer(nextConfig)