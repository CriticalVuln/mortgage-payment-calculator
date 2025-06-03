#!/bin/bash
# This is a fallback build script for Vercel deployment

set -e  # Exit on any error

echo "Starting build process..."

# Ensure npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed"
    exit 1
fi

# Clean install dependencies
echo "Installing dependencies..."
npm ci

# Add node_modules/.bin to PATH
export PATH="$PWD/node_modules/.bin:$PATH"

# Check if vite is available
if ! command -v vite &> /dev/null; then
    echo "Vite not found in PATH, using npx..."
    # Run TypeScript check
    echo "Running TypeScript check..."
    npx tsc --noEmit
    
    # Run the build
    echo "Building the project..."
    npx vite build
else
    echo "Vite found in PATH"
    # Run TypeScript check
    echo "Running TypeScript check..."
    tsc --noEmit
    
    # Run the build
    echo "Building the project..."
    vite build
fi

# Check if build succeeded
if [ -d "dist" ]; then
    echo "Build successful! Output in dist/ directory"
    exit 0
else
    echo "Build failed - no dist directory found!"
    exit 1
fi
