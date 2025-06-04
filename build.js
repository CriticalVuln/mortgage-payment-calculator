const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');

try {
  // Ensure we're in the right directory
  process.chdir(__dirname);
  
  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    console.log('Installing dependencies...');
    execSync('npm ci', { stdio: 'inherit' });
  }
  
  // Run TypeScript check
  console.log('Running TypeScript check...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  
  // Run Vite build
  console.log('Building with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Generate sitemap and robots.txt
  console.log('Generating sitemap and robots.txt...');
  try {
    execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });
  } catch (sitemapError) {
    console.warn('Warning: Sitemap generation failed:', sitemapError.message);
    // Don't fail the build if sitemap generation fails
  }
  
  // Verify build output
  if (fs.existsSync('dist')) {
    console.log('Build completed successfully!');
    process.exit(0);
  } else {
    throw new Error('Build output directory not found');
  }
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
