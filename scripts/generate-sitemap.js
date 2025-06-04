// scripts/generate-sitemap.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOMAIN = 'https://mymortgagecalc.co';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client only if credentials are available
let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase client initialized');
} else {
  console.log('⚠️  Supabase credentials not found, will generate sitemap with static pages only');
}

// Static pages configuration
const staticPages = [
  {
    url: '/',
    priority: '1.0',
    changefreq: 'weekly',
    title: 'Mortgage Payment Calculator'
  },
  {
    url: '/rates',
    priority: '0.8',
    changefreq: 'daily',
    title: 'Mortgage Rates'
  },
  {
    url: '/learning',
    priority: '0.9',
    changefreq: 'weekly',
    title: 'Learning Center'
  }
];

// Fetch articles from Supabase
async function fetchArticles() {
  try {
    if (!supabase) {
      console.log('Supabase not available, using fallback articles');
      // Return some sample articles for demonstration
      return [
        {
          id: '1',
          slug: 'understanding-mortgage-basics',
          title: 'Understanding Mortgage Basics',
          updated_at: '2025-06-04T00:00:00Z',
          created_at: '2025-06-01T00:00:00Z'
        },
        {
          id: '2',
          slug: 'first-time-homebuyer-guide',
          title: 'First Time Homebuyer Guide',
          updated_at: '2025-06-04T00:00:00Z',
          created_at: '2025-06-02T00:00:00Z'
        },
        {
          id: '3',
          slug: 'mortgage-rate-comparison',
          title: 'Mortgage Rate Comparison',
          updated_at: '2025-06-04T00:00:00Z',
          created_at: '2025-06-03T00:00:00Z'
        }
      ];
    }

    console.log('Fetching articles from Supabase...');
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, slug, title, updated_at, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching articles from Supabase:', error.message);
      return [];
    }

    console.log(`Found ${articles?.length || 0} published articles`);
    return articles || [];
  } catch (error) {
    console.warn('Failed to connect to Supabase:', error.message);
    return [];
  }
}

// Generate sitemap XML
function generateSitemap(pages) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urlEntries = pages.map(page => `  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Generate robots.txt
function generateRobots() {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${DOMAIN}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1

# Block admin and API routes (if any)
Disallow: /api/
Disallow: /_*
`;
}

// Create URL slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100); // Limit length
}

// Main generation function
async function generateSitemapAndRobots() {
  try {
    console.log('Starting sitemap generation...');
    
    // Fetch articles from Supabase
    const articles = await fetchArticles();
    
    // Create all pages array
    const allPages = [...staticPages];
    
    // Add article pages
    articles.forEach(article => {
      const slug = article.slug || createSlug(article.title);
      allPages.push({
        url: `/article/${slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: article.updated_at 
          ? new Date(article.updated_at).toISOString().split('T')[0]
          : new Date(article.created_at).toISOString().split('T')[0]
      });
    });

    // Generate sitemap
    const sitemapContent = generateSitemap(allPages);
    
    // Generate robots.txt
    const robotsContent = generateRobots();
    
    // Determine output directory
    const outputDir = path.resolve(__dirname, '../dist');
    const publicDir = path.resolve(__dirname, '../public');
    
    // Ensure directories exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write to both dist (for production) and public (for development)
    const sitemapPath = path.join(outputDir, 'sitemap.xml');
    const robotsPath = path.join(outputDir, 'robots.txt');
    const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
    const publicRobotsPath = path.join(publicDir, 'robots.txt');
    
    // Write files
    fs.writeFileSync(sitemapPath, sitemapContent);
    fs.writeFileSync(robotsPath, robotsContent);
    fs.writeFileSync(publicSitemapPath, sitemapContent);
    fs.writeFileSync(publicRobotsPath, robotsContent);
    
    console.log(`✅ Sitemap generated with ${allPages.length} pages`);
    console.log(`   - Static pages: ${staticPages.length}`);
    console.log(`   - Article pages: ${articles.length}`);
    console.log(`📁 Files written to:`);
    console.log(`   - ${sitemapPath}`);
    console.log(`   - ${robotsPath}`);
    console.log(`   - ${publicSitemapPath}`);
    console.log(`   - ${publicRobotsPath}`);
    
    return { success: true, pageCount: allPages.length };
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    return { success: false, error: error.message };
  }
}

// Export for use in other scripts
export { generateSitemapAndRobots };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('generate-sitemap.js')) {
  generateSitemapAndRobots()
    .then(result => {
      if (result.success) {
        console.log(`🎉 Sitemap generation completed successfully!`);
        process.exit(0);
      } else {
        console.error(`❌ Sitemap generation failed: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}
