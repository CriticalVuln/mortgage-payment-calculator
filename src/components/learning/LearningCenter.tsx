import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Settings, Plus, ExternalLink } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useLearningCenter from '../../context/LearningCenterContext';
import { Article } from '../../types/learningCenter';

// Temporary inline components to fix import issues
const ArticleCard = ({ article, onClick }: any) => (
  <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow h-[250px]" onClick={() => onClick(article)}>
    <h3 className="font-semibold text-xl mb-3">{article.title}</h3>
    <p className="text-gray-600 text-base">{article.summary}</p>
  </div>
);

const AdminPanel = () => (
  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
    <h3 className="font-semibold mb-2">Admin Panel</h3>
    <p className="text-sm text-gray-600">Admin functionality temporarily disabled during development.</p>
  </div>
);

const ArticleDetail = ({ article, onBack }: any) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <button 
      onClick={onBack} 
      className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
    >
      <span className="mr-1">←</span> Back to articles
    </button>
    <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
    <p className="text-gray-600">{article.summary}</p>
    {/* Added some content to ensure the component renders properly */}
    <div className="mt-6 prose max-w-none">
      <p>This is a placeholder article content. The full content would be loaded here.</p>
    </div>
  </div>
);

interface LearningCenterProps {
  onArticleClick?: (articleId: string) => void;
}

const LearningCenter: React.FC<LearningCenterProps> = ({ onArticleClick }) => {  const { state, toggleAdmin } = useLearningCenter();
  const { articles, isLoading, error, isAdmin } = state;
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  // Set Learning Center SEO metadata on mount
  useEffect(() => {
    // SEO functionality temporarily disabled
    document.title = 'Learning Center - My Mortgage Calc';
  }, []);
    // Make sure we have a fallback for when no articles are loaded
  useEffect(() => {
    if ((!articles || articles.length === 0) && !isLoading && !error) {
      // We could reload articles here if needed
      console.log("No articles available in Learning Center");
    }
  }, [articles, isLoading, error]);
  const handleArticleClick = (article: Article) => {
    if (!article) {
      console.error("Tried to click on an undefined article");
      return;
    }
    
    if (onArticleClick) {
      onArticleClick(article.id);
    } else {
      // Ensure article has required fields before setting it
      if (article.id && article.title) {
        setSelectedArticle(article);
      } else {
        console.error("Article is missing required fields:", article);
      }
    }
  };
  const handleBackToList = () => {
    // First ensure the articles list is available before removing the selected article
    if (!articles || articles.length === 0) {
      // We should still allow navigation back even if no articles are loaded
      console.log("No articles loaded, but returning to list view");
    }
    // Set selected article to null to return to the list view
    setSelectedArticle(null);
  };

  // If an article is selected, show the article detail view
  if (selectedArticle) {
    return (
      <ArticleDetail 
        article={selectedArticle} 
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-primary-600 mr-3" />
            <h1 className="text-4xl font-bold text-neutral-900">
              Learning <span className="text-primary-600">Center</span>
            </h1>
          </div>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Comprehensive guides and expert insights to help you navigate your home buying journey
          </p>
        </motion.div>
      </div>

      {/* Admin Toggle (hidden button for demo) */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAdmin}
          className="opacity-30 hover:opacity-100 transition-opacity"
        >
          <Settings className="h-4 w-4 mr-1" />
          {isAdmin ? 'Exit Admin' : 'Admin'}
        </Button>
      </div>

      {/* Admin Panel */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <AdminPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 bg-red-50 border-red-200">
            <div className="text-center">
              <p className="text-red-800 font-medium">Error loading articles</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </motion.div>
      )}

      {/* Articles Grid */}
      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {articles.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Articles Yet</h3>
              <p className="text-neutral-500 mb-6">
                Start building your learning center by adding educational resources about mortgages and home buying.
              </p>
              {isAdmin && (
                <Button
                  variant="primary"
                  onClick={toggleAdmin}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add First Article
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >                  <ArticleCard
                    article={article}
                    onClick={() => handleArticleClick(article)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Call to Action */}
      {!isLoading && !error && articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                Ready to Start Your Home Buying Journey?
              </h3>
              <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                Use our advanced mortgage calculator to get a detailed breakdown of your monthly payments and explore different scenarios.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/'}
                icon={<ExternalLink className="h-5 w-5" />}
              >
                Try Our Mortgage Calculator
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default LearningCenter;
