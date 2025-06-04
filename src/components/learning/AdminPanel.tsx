import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { Plus, GripVertical, ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useLearningCenter } from '../../context/LearningCenterContext';

const AdminPanel: React.FC = () => {
  const { 
    state, 
    addArticleFromUrl, 
    updateArticleOrder, 
    deleteArticle, 
    refreshMetadata,
    forceRefreshAll,
    getTimeUntilNextRefresh 
  } = useLearningCenter();
  const { articles, isLoading } = state;  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddArticle = async () => {
    if (!newUrl.trim()) return;
    
    setIsAdding(true);
    try {
      await addArticleFromUrl(newUrl);
      setNewUrl('');
    } catch (error) {
      console.error('Failed to add article:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(articles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sort indexes
    const updatedArticles = items.map((article, index) => ({
      ...article,
      sort_index: index + 1
    }));

    await updateArticleOrder(updatedArticles);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      await deleteArticle(id);
    }
  };
  const handleRefresh = async (id: string) => {
    await refreshMetadata(id);
  };

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      await forceRefreshAll();
    } catch (error) {
      console.error('Failed to refresh articles:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="p-6 bg-amber-50 border-amber-200">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Admin Panel</h2>
        <p className="text-neutral-600 text-sm">
          Add new articles by URL and drag to reorder. Changes save automatically.
        </p>
      </div>

      {/* Add New Article */}
      <div className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Enter article URL (e.g., https://example.com/article)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddArticle()}
            />
          </div>
          <Button
            variant="primary"
            onClick={handleAddArticle}
            disabled={!newUrl.trim() || isAdding}
            isLoading={isAdding}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Article
          </Button>
        </div>      </div>

      {/* Refresh System */}
      <div className="mb-6">
        <h3 className="font-semibold text-neutral-900 mb-3">Automatic Refresh System</h3>
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div>
            <p className="text-sm text-green-800 font-medium">
              {getTimeUntilNextRefresh()}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Articles automatically refresh every 24 hours to keep metadata current
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleForceRefresh}
            disabled={isRefreshing || isLoading}
            isLoading={isRefreshing}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh All Now
          </Button>
        </div>
      </div>

      {/* Articles List with Drag & Drop */}
      {articles.length > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-900 mb-4">
            Manage Articles ({articles.length})
          </h3>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="articles">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-2 min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'border-primary-400 bg-primary-50' 
                      : 'border-neutral-300 bg-white'
                  }`}
                >
                  {articles.map((article, index) => (
                    <Draggable key={article.id} draggableId={article.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 bg-white rounded-lg border shadow-sm transition-all ${
                            snapshot.isDragging 
                              ? 'shadow-lg rotate-2 border-primary-300' 
                              : 'hover:shadow-md border-neutral-200'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          layout
                        >
                          <div className="flex items-center gap-3">
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="flex-shrink-0 p-1 text-neutral-400 hover:text-neutral-600 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>

                            {/* Article Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-neutral-900 truncate">
                                    {article.title}
                                  </h4>
                                  <p className="text-sm text-neutral-500 truncate">
                                    {article.canonical_url}
                                  </p>
                                  {article.tags && article.tags.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                      {article.tags.slice(0, 3).map((tag, i) => (
                                        <span
                                          key={i}
                                          className="inline-block bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 ml-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(article.canonical_url, '_blank')}
                                    className="p-2 h-8 w-8"
                                    title="View original"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRefresh(article.id)}
                                    className="p-2 h-8 w-8"
                                    title="Refresh metadata"
                                    disabled={isLoading}
                                  >
                                    <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(article.id)}
                                    className="p-2 h-8 w-8 text-red-600 hover:bg-red-50"
                                    title="Delete article"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {articles.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      <p>No articles yet. Add your first article above.</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Drag articles to reorder them - changes save automatically</li>
          <li>• Article metadata is automatically extracted from URLs</li>
          <li>• Use the refresh button to update article information</li>
          <li>• Articles appear in your Learning Center immediately</li>
        </ul>
      </div>
    </Card>
  );
};

export default AdminPanel;
