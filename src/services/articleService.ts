import { Article, ArticleMetadata } from '../types/learningCenter';
import { supabase, isSupabaseConfigured, demoArticles } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// Metadata extraction service
export const extractMetadataFromUrl = async (url: string): Promise<ArticleMetadata> => {
  try {
    // In a real implementation, this would be a server-side function
    // For demo purposes, we'll generate mock metadata
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Mock metadata based on URL patterns
    const mockMetadata: ArticleMetadata = {
      title: `Article from ${domain}`,
      summary: `This is a comprehensive article about mortgage and real estate topics from ${domain}. It covers important aspects that homebuyers and homeowners should know.`,
      author: 'Real Estate Expert',
      pub_date: new Date().toISOString(),
      quote: 'Understanding these concepts is essential for making informed decisions about your home purchase.',
      image_url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000)}?w=400`,
      canonical_url: url,
      tags: ['mortgage', 'real-estate', 'homebuying'],
      reading_time: Math.floor(Math.random() * 10) + 3
    };

    // Try to fetch actual metadata if possible (this would be server-side in production)
    try {
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          return {
            title: data.data.title || mockMetadata.title,
            summary: data.data.description || mockMetadata.summary,
            author: data.data.author || mockMetadata.author,
            pub_date: data.data.date || mockMetadata.pub_date,
            image_url: data.data.image?.url || mockMetadata.image_url,
            canonical_url: url,
            tags: mockMetadata.tags,
            reading_time: mockMetadata.reading_time
          };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch metadata, using mock data');
    }

    return mockMetadata;
  } catch (error) {
    throw new Error('Invalid URL provided');
  }
};

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Article CRUD operations
export const articleService = {  // Get all articles
  async getArticles(): Promise<Article[]> {
    if (!isSupabaseConfigured() || !supabase) {
      // Return demo data from localStorage or fallback
      const stored = localStorage.getItem('learning-center-articles');
      return stored ? JSON.parse(stored) : demoArticles;
    }

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('sort_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Add new article from URL
  async addArticleFromUrl(url: string): Promise<Article> {
    const metadata = await extractMetadataFromUrl(url);
    const slug = generateSlug(metadata.title);
    
    const newArticle: Article = {
      id: uuidv4(),
      slug,
      title: metadata.title,
      summary: metadata.summary,
      canonical_url: metadata.canonical_url,
      author: metadata.author,
      pub_date: metadata.pub_date,
      quote: metadata.quote,
      image_url: metadata.image_url,
      tags: metadata.tags,
      sort_index: 999,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reading_time: metadata.reading_time,
      is_published: true    };

    if (!isSupabaseConfigured() || !supabase) {
      // Store in localStorage for demo
      const stored = localStorage.getItem('learning-center-articles');
      const articles = stored ? JSON.parse(stored) : demoArticles;
      articles.push(newArticle);
      localStorage.setItem('learning-center-articles', JSON.stringify(articles));
      return newArticle;
    }

    const { data, error } = await supabase
      .from('articles')
      .insert([newArticle])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update article order
  async updateArticleOrder(articles: Article[]): Promise<void> {
    const updates = articles.map((article, index) => ({
      ...article,
      sort_index: index + 1,
      updated_at: new Date().toISOString()
    }));    if (!isSupabaseConfigured() || !supabase) {
      // Store in localStorage for demo
      localStorage.setItem('learning-center-articles', JSON.stringify(updates));
      return;
    }    const { error } = await supabase!
      .from('articles')
      .upsert(updates);

    if (error) throw error;
  },
  // Delete article
  async deleteArticle(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) {
      // Remove from localStorage for demo
      const stored = localStorage.getItem('learning-center-articles');
      const articles = stored ? JSON.parse(stored) : [];
      const filtered = articles.filter((article: Article) => article.id !== id);
      localStorage.setItem('learning-center-articles', JSON.stringify(filtered));
      return;
    }

    const { error } = await supabase!
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Refresh metadata for an article
  async refreshMetadata(id: string): Promise<Article> {
    const articles = await this.getArticles();
    const article = articles.find(a => a.id === id);
    
    if (!article) throw new Error('Article not found');

    const metadata = await extractMetadataFromUrl(article.canonical_url);
    
    const updatedArticle: Article = {
      ...article,
      title: metadata.title,
      summary: metadata.summary,
      author: metadata.author,
      pub_date: metadata.pub_date,
      quote: metadata.quote,
      image_url: metadata.image_url,
      tags: metadata.tags,
      reading_time: metadata.reading_time,
      updated_at: new Date().toISOString()
    };    if (!isSupabaseConfigured() || !supabase) {
      // Update in localStorage for demo
      const stored = localStorage.getItem('learning-center-articles');
      const allArticles = stored ? JSON.parse(stored) : [];
      const index = allArticles.findIndex((a: Article) => a.id === id);
      if (index !== -1) {
        allArticles[index] = updatedArticle;
        localStorage.setItem('learning-center-articles', JSON.stringify(allArticles));
      }
      return updatedArticle;
    }

    const { data, error } = await supabase!
      .from('articles')
      .update(updatedArticle)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
