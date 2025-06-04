import { Article } from '../types/learningCenter';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage?: string;
  schema: object;
}

/**
 * SEO Service for Learning Center
 * Handles SEO optimizations, Core Web Vitals, and structured data
 */
export class SEOService {
  private static readonly BASE_URL = 'https://mymortgagecalc.co';
  
  /**
   * Generate comprehensive SEO metadata for an article
   */
  static generateArticleMetadata(article: Article): SEOMetadata {
    const title = `${article.title} | My Mortgage Calc Learning Center`;
    const description = article.summary || `Learn about ${article.title} and other mortgage topics in our comprehensive Learning Center.`;
    const canonicalUrl = `${this.BASE_URL}/learning/${article.slug}`;
    const keywords = [
      'mortgage',
      'home loan',
      'real estate',
      'home buying',
      ...article.tags
    ];

    return {
      title,
      description,
      keywords,
      canonicalUrl,
      ogTitle: title,
      ogDescription: description,
      ogImage: article.image_url,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: article.image_url,
      schema: this.generateArticleSchema(article)
    };
  }

  /**
   * Generate JSON-LD Article schema for SEO
   */
  static generateArticleSchema(article: Article): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.summary,
      author: {
        '@type': 'Person',
        name: article.author || 'My Mortgage Calc Team'
      },
      publisher: {
        '@type': 'Organization',
        name: 'My Mortgage Calc',
        url: this.BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${this.BASE_URL}/logo.png`
        }
      },
      datePublished: article.pub_date || article.created_at,
      dateModified: article.updated_at,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.BASE_URL}/learning/${article.slug}`
      },
      image: article.image_url ? {
        '@type': 'ImageObject',
        url: article.image_url
      } : undefined,
      articleSection: 'Mortgage and Real Estate Education',
      keywords: article.tags.join(', '),
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      creativeWorkStatus: 'Published'
    };
  }

  /**
   * Generate Learning Center index page metadata
   */
  static generateLearningCenterMetadata(): SEOMetadata {
    const title = 'Learning Center | My Mortgage Calc - Mortgage Education Hub';
    const description = 'Comprehensive mortgage and real estate education center. Learn about home loans, rates, buying process, and financial planning from industry experts.';
    
    return {
      title,
      description,
      keywords: [
        'mortgage education',
        'home loan guide',
        'real estate learning',
        'home buying tips',
        'mortgage calculator',
        'first time home buyer'
      ],
      canonicalUrl: `${this.BASE_URL}/learning`,
      ogTitle: title,
      ogDescription: description,
      ogImage: `${this.BASE_URL}/og-learning-center.jpg`,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: `${this.BASE_URL}/twitter-learning-center.jpg`,
      schema: this.generateLearningCenterSchema()
    };
  }

  /**
   * Generate JSON-LD schema for Learning Center
   */
  static generateLearningCenterSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'My Mortgage Calc Learning Center',
      url: `${this.BASE_URL}/learning`,
      description: 'Comprehensive mortgage and real estate education center',
      provider: {
        '@type': 'Organization',
        name: 'My Mortgage Calc',
        url: this.BASE_URL
      },
      educationalCredentialAwarded: 'Financial Literacy',
      teaches: [
        'Mortgage Calculations',
        'Home Buying Process',
        'Real Estate Investment',
        'Financial Planning'
      ]
    };
  }

  /**
   * Inject meta tags into document head
   */
  static injectMetaTags(metadata: SEOMetadata): void {
    // Clear existing meta tags
    this.clearPreviousMetaTags();

    // Title
    document.title = metadata.title;

    // Basic meta tags
    this.addMetaTag('description', metadata.description);
    this.addMetaTag('keywords', metadata.keywords.join(', '));
    this.addMetaTag('canonical', metadata.canonicalUrl, 'rel');

    // Open Graph tags
    this.addMetaTag('og:title', metadata.ogTitle, 'property');
    this.addMetaTag('og:description', metadata.ogDescription, 'property');
    this.addMetaTag('og:url', metadata.canonicalUrl, 'property');
    this.addMetaTag('og:type', 'article', 'property');
    
    if (metadata.ogImage) {
      this.addMetaTag('og:image', metadata.ogImage, 'property');
    }

    // Twitter Card tags
    this.addMetaTag('twitter:card', 'summary_large_image', 'name');
    this.addMetaTag('twitter:title', metadata.twitterTitle, 'name');
    this.addMetaTag('twitter:description', metadata.twitterDescription, 'name');
    
    if (metadata.twitterImage) {
      this.addMetaTag('twitter:image', metadata.twitterImage, 'name');
    }

    // JSON-LD structured data
    this.injectStructuredData(metadata.schema);
  }

  /**
   * Add a meta tag to the document head
   */
  private static addMetaTag(name: string, content: string, attribute: string = 'name'): void {
    const meta = document.createElement('meta');
    
    if (attribute === 'rel') {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = content;
      document.head.appendChild(link);
      return;
    }

    meta.setAttribute(attribute, name);
    meta.content = content;
    meta.setAttribute('data-seo-generated', 'true');
    document.head.appendChild(meta);
  }

  /**
   * Inject JSON-LD structured data
   */
  private static injectStructuredData(schema: object): void {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"][data-seo-generated]');
    if (existing) {
      existing.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-generated', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Clear previously generated meta tags
   */
  private static clearPreviousMetaTags(): void {
    const generatedTags = document.querySelectorAll('[data-seo-generated]');
    generatedTags.forEach(tag => tag.remove());
  }

  /**
   * Preload critical resources for Core Web Vitals optimization
   */
  static preloadCriticalResources(): void {
    // Preload critical fonts
    this.preloadResource('/fonts/inter-var.woff2', 'font', 'font/woff2');
    
    // Preload hero image
    this.preloadResource('/images/hero-mortgage.webp', 'image');
    
    // Preconnect to external domains
    this.preconnectDomain('https://images.unsplash.com');
    this.preconnectDomain('https://fonts.googleapis.com');
  }

  /**
   * Preload a resource
   */
  private static preloadResource(href: string, as: string, type?: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    link.setAttribute('data-seo-generated', 'true');
    document.head.appendChild(link);
  }

  /**
   * Preconnect to external domain
   */
  private static preconnectDomain(href: string): void {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    link.setAttribute('data-seo-generated', 'true');
    document.head.appendChild(link);
  }

  /**
   * Generate sitemap entry for article
   */
  static generateSitemapEntry(article: Article): string {
    return `
  <url>
    <loc>${this.BASE_URL}/learning/${article.slug}</loc>
    <lastmod>${new Date(article.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`.trim();
  }

  /**
   * Calculate estimated reading time
   */
  static calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Optimize images for Core Web Vitals
   */
  static optimizeImage(url: string, width?: number, height?: number): string {
    if (!url) return '';
    
    // If it's an Unsplash URL, add optimization parameters
    if (url.includes('unsplash.com')) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('auto', 'format');
      params.set('fit', 'crop');
      params.set('q', '80');
      
      return `${url}?${params.toString()}`;
    }
    
    return url;
  }
}

export const seoService = SEOService;
