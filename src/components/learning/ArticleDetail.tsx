import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Calendar, ExternalLink, Share2, Tag, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Article } from '../../types/learningCenter';
import { useLearningCenter } from '../../context/LearningCenterContext';
import { seoService } from '../../services/seoService';

interface ArticleDetailProps {
  article?: Article;
  articleId?: string;
  onBack: () => void;
  onArticleClick?: (articleId: string) => void;
  relatedArticles?: Article[];
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ 
  article: propArticle, 
  articleId, 
  onBack, 
  onArticleClick,
  relatedArticles: propRelatedArticles 
}) => {  const { state } = useLearningCenter();
  const [readingProgress, setReadingProgress] = useState(0);
  // Get article from context if articleId is provided
  const article = propArticle || (articleId ? state.articles.find(a => a.id === articleId) : undefined);
  const relatedArticles = propRelatedArticles || (article ? state.articles.filter(a => 
    a.id !== article.id && 
    a.tags?.some(tag => article.tags?.includes(tag))
  ).slice(0, 3) : []);
  
  // Reading progress effect - ALWAYS define hooks at the top level regardless of conditions
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    // Only add the event listener if we have an article
    if (article) {
      window.addEventListener('scroll', updateReadingProgress);
      return () => window.removeEventListener('scroll', updateReadingProgress);
    }
    return undefined; // Return empty cleanup function if no article
  }, [article]); // Add article as a dependency

  // SEO metadata injection effect - ALWAYS at top level
  useEffect(() => {
    if (article) {
      const metadata = seoService.generateArticleMetadata(article);
      seoService.injectMetaTags(metadata);
      
      // Cleanup on unmount
      return () => {
        // Reset to default Learning Center metadata when leaving article
        const learningCenterMetadata = seoService.generateLearningCenterMetadata();
        seoService.injectMetaTags(learningCenterMetadata);
      };
    }
    return undefined; // Return empty cleanup function if no article
  }, [article]);

  // Show loading or not found if article is not available
  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            {state.isLoading ? 'Loading article...' : 'Article not found'}
          </h1>
          <Button variant="secondary" onClick={onBack}>
            ← Back to Learning Center
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    author: {
      '@type': 'Person',
      name: article.author || 'Anonymous'
    },
    datePublished: article.pub_date,
    dateModified: article.updated_at,
    image: article.image_url,
    url: article.canonical_url,
    publisher: {
      '@type': 'Organization',
      name: 'My Mortgage Calc',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': window.location.href
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-neutral-200 z-50">
        <motion.div
          className="h-full bg-primary-600"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Learning Center
        </Button>

        {/* Article Header */}
        <div className="text-center mb-8">
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded-full"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              {article.summary}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-neutral-500 mb-8">
            {article.author && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{article.author}</span>
              </div>
            )}
            {article.pub_date && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(article.pub_date)}</span>
              </div>
            )}
            {article.reading_time && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{article.reading_time} min read</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="primary"
              onClick={() => window.open(article.canonical_url, '_blank', 'noopener,noreferrer')}
              icon={<ExternalLink className="h-4 w-4" />}
            >
              Read Full Article
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              icon={<Share2 className="h-4 w-4" />}
            >
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Hero Image */}
      {article.image_url && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop`;
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            {/* Quote */}
            {article.quote && (
              <blockquote className="border-l-4 border-primary-500 pl-6 mb-8 text-xl text-neutral-700 italic font-medium">
                "{article.quote}"
              </blockquote>
            )}

            {/* Content Placeholder */}
            <div className="space-y-6 text-neutral-700 leading-relaxed">
              <p>
                This article provides comprehensive insights into {article.title.toLowerCase()}. 
                For the complete analysis, expert opinions, and detailed information, please visit the original source.
              </p>
              
              {article.summary && (
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-neutral-900 mb-3">Summary</h3>
                  <p>{article.summary}</p>
                </div>
              )}

              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="font-semibold text-primary-900 mb-3">Continue Reading</h3>
                <p className="text-primary-800 mb-4">
                  This is a preview of the article. For the complete content, analysis, and expert insights, 
                  visit the original source.
                </p>
                <Button
                  variant="primary"
                  onClick={() => window.open(article.canonical_url, '_blank', 'noopener,noreferrer')}
                  icon={<ExternalLink className="h-4 w-4" />}
                >
                  Read Full Article
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="p-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-2xl font-bold text-neutral-900">Related Articles</h2>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  className="cursor-pointer group"
                  onClick={() => onArticleClick ? onArticleClick(relatedArticle.id) : window.location.href = `/learning/${relatedArticle.slug}`}
                >
                  <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                    {relatedArticle.image_url ? (
                      <img
                        src={relatedArticle.image_url}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                        <ExternalLink className="h-8 w-8 text-primary-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-sm text-neutral-600 line-clamp-2">
                    {relatedArticle.summary}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ArticleDetail;
