import React from 'react';
import { Clock, User, ExternalLink, RefreshCw, Trash2, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Article } from '../../types/learningCenter';
import { useLearningCenter } from '../../context/LearningCenterContext';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  isAdmin: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, isAdmin }) => {
  const { refreshMetadata, deleteArticle } = useLearningCenter();

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await refreshMetadata(article.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this article?')) {
      await deleteArticle(article.id);
    }
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(article.canonical_url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 group">
      <div onClick={onClick} className="h-full flex flex-col">
        {/* Article Image */}
        <div className="relative h-48 overflow-hidden">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              <ExternalLink className="h-12 w-12 text-primary-400" />
            </div>
          )}
          
          {/* Admin Controls Overlay */}
          {isAdmin && (
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="bg-white/90 hover:bg-white text-neutral-700 p-2 h-8 w-8"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="bg-white/90 hover:bg-red-50 text-red-600 p-2 h-8 w-8"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Reading Time Badge */}
          {article.reading_time && (
            <div className="absolute bottom-2 left-2">
              <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {article.reading_time} min read
              </div>
            </div>
          )}

          {/* External Link Button */}
          <div className="absolute bottom-2 right-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExternalLink}
              className="bg-black/70 hover:bg-black/80 text-white p-2 h-8 w-8"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {article.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {article.tags.length > 3 && (
                <span className="inline-block text-neutral-500 text-xs px-2 py-1">
                  +{article.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {article.title}
          </h3>

          {/* Summary */}
          {article.summary && (
            <p className="text-neutral-600 text-sm mb-4 line-clamp-3 flex-1">
              {article.summary}
            </p>
          )}

          {/* Quote */}
          {article.quote && (
            <blockquote className="border-l-3 border-primary-300 pl-3 mb-4 text-sm text-neutral-700 italic">
              "{article.quote}"
            </blockquote>
          )}

          {/* Meta Information */}
          <div className="mt-auto pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center space-x-3">
                {article.author && (
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{article.author}</span>
                  </div>
                )}
                {article.pub_date && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(article.pub_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;
