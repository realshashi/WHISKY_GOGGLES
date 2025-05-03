#!/bin/bash

# Build script for Vercel deployment
echo "Starting Vercel build process..."

# Build the frontend
echo "Building frontend..."
npm run build

# Build the Vercel-specific backend
echo "Building Vercel-specific backend..."
npx esbuild server/vercel.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"