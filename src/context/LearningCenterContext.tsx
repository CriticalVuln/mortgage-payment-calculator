import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Article, LearningCenterState } from '../types/learningCenter';
import { articleService } from '../services/articleService';
import { refreshScheduler } from '../services/refreshScheduler';

interface LearningCenterContextType {
  state: LearningCenterState;
  loadArticles: () => Promise<void>;
  addArticleFromUrl: (url: string) => Promise<void>;
  updateArticleOrder: (articles: Article[]) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  refreshMetadata: (id: string) => Promise<void>;
  forceRefreshAll: () => Promise<void>;
  getTimeUntilNextRefresh: () => string;
  toggleAdmin: () => void;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ARTICLES'; payload: Article[] }
  | { type: 'ADD_ARTICLE'; payload: Article }
  | { type: 'UPDATE_ARTICLE'; payload: Article }
  | { type: 'DELETE_ARTICLE'; payload: string }
  | { type: 'TOGGLE_ADMIN' };

const initialState: LearningCenterState = {
  articles: [],
  isLoading: false,
  error: null,
  isAdmin: false,
  lastMetadataFetch: {}
};

const learningCenterReducer = (state: LearningCenterState, action: Action): LearningCenterState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload, isLoading: false, error: null };
    
    case 'ADD_ARTICLE':
      return { 
        ...state, 
        articles: [...state.articles, action.payload].sort((a, b) => a.sort_index - b.sort_index),
        isLoading: false,
        error: null
      };
    
    case 'UPDATE_ARTICLE':
      return {
        ...state,
        articles: state.articles.map(article => 
          article.id === action.payload.id ? action.payload : article
        ),
        isLoading: false,
        error: null
      };
    
    case 'DELETE_ARTICLE':
      return {
        ...state,
        articles: state.articles.filter(article => article.id !== action.payload),
        isLoading: false,
        error: null
      };
    
    case 'TOGGLE_ADMIN':
      return { ...state, isAdmin: !state.isAdmin };
    
    default:
      return state;
  }
};

const LearningCenterContext = createContext<LearningCenterContextType | undefined>(undefined);

export const LearningCenterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(learningCenterReducer, initialState);

  const loadArticles = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const articles = await articleService.getArticles();
      dispatch({ type: 'SET_ARTICLES', payload: articles });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load articles' });
    }
  };

  const addArticleFromUrl = async (url: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newArticle = await articleService.addArticleFromUrl(url);
      dispatch({ type: 'ADD_ARTICLE', payload: newArticle });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to add article' });
    }
  };

  const updateArticleOrder = async (articles: Article[]) => {
    try {
      await articleService.updateArticleOrder(articles);
      dispatch({ type: 'SET_ARTICLES', payload: articles });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update order' });
    }
  };

  const deleteArticle = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await articleService.deleteArticle(id);
      dispatch({ type: 'DELETE_ARTICLE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete article' });
    }
  };

  const refreshMetadata = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedArticle = await articleService.refreshMetadata(id);
      dispatch({ type: 'UPDATE_ARTICLE', payload: updatedArticle });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to refresh metadata' });
    }
  };
  const toggleAdmin = () => {
    dispatch({ type: 'TOGGLE_ADMIN' });
  };

  const forceRefreshAll = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await refreshScheduler.forceRefresh();
      // Reload articles after refresh
      await loadArticles();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to refresh all articles' });
    }
  };

  const getTimeUntilNextRefresh = () => {
    return refreshScheduler.getTimeUntilNextRefreshString();
  };

  // Load articles on mount and start refresh scheduler
  useEffect(() => {
    loadArticles();
    refreshScheduler.start();
    
    // Cleanup on unmount
    return () => {
      refreshScheduler.stop();
    };
  }, []);
  return (
    <LearningCenterContext.Provider value={{
      state,
      loadArticles,
      addArticleFromUrl,
      updateArticleOrder,
      deleteArticle,
      refreshMetadata,
      forceRefreshAll,
      getTimeUntilNextRefresh,
      toggleAdmin
    }}>
      {children}
    </LearningCenterContext.Provider>
  );
};

export const useLearningCenter = () => {
  const context = useContext(LearningCenterContext);
  if (context === undefined) {
    throw new Error('useLearningCenter must be used within a LearningCenterProvider');
  }
  return context;
};

// Make sure useLearningCenter is also included in the default exports
export { useLearningCenter as default };
