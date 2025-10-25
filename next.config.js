/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: false, // Netlify supports Next.js image optimization
  },
  trailingSlash: false,
  transpilePackages: ['@supabase/ssr', '@supabase/supabase-js'],
  
  // Optimize webpack for better memory usage
  webpack: (config, { isServer }) => {
    // Reduce memory pressure
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    }
    
    // Don't bundle react-quill on server side
    if (isServer) {
      config.externals = [...(config.externals || []), 'react-quill']
    }
    
    return config
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['react-quill', 'lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig
