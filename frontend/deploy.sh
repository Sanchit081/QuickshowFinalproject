#!/bin/bash

echo "🚀 Deploying QuickShow to Vercel..."

# Clean build
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    npx vercel --prod
    
    echo "🎉 Deployment complete!"
else
    echo "❌ Build failed!"
    exit 1
fi
