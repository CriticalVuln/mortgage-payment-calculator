// src/utils/router.ts
export type AppView = 'calculator' | 'rates' | 'learning' | 'article';

export interface RouteState {
  view: AppView;
  articleId?: string;
  articleSlug?: string;
}

export class Router {
  private static instance: Router;
  private listeners: ((state: RouteState) => void)[] = [];
  
  static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }
  
  constructor() {
    // Listen for browser navigation events
    window.addEventListener('popstate', () => {
      this.notifyListeners();
    });
  }
  
  subscribe(listener: (state: RouteState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  private notifyListeners() {
    const state = this.getCurrentState();
    this.listeners.forEach(listener => listener(state));
  }
  
  getCurrentState(): RouteState {
    const path = window.location.pathname;
    
    // Remove leading slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    if (!cleanPath || cleanPath === '') {
      return { view: 'calculator' };
    }
    
    if (cleanPath === 'rates') {
      return { view: 'rates' };
    }
    
    if (cleanPath === 'learning') {
      return { view: 'learning' };
    }
    
    if (cleanPath.startsWith('article/')) {
      const articleSlug = cleanPath.replace('article/', '');
      return { 
        view: 'article', 
        articleSlug,
        articleId: articleSlug // For backward compatibility
      };
    }
    
    // Default to calculator for unknown routes
    return { view: 'calculator' };
  }
  
  navigate(view: AppView, articleSlug?: string) {
    let path = '/';
    
    switch (view) {
      case 'calculator':
        path = '/';
        break;
      case 'rates':
        path = '/rates';
        break;
      case 'learning':
        path = '/learning';
        break;
      case 'article':
        if (articleSlug) {
          path = `/article/${articleSlug}`;
        } else {
          path = '/learning';
        }
        break;
    }
    
    // Update browser history
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      this.notifyListeners();
    }
  }
  
  replace(view: AppView, articleSlug?: string) {
    let path = '/';
    
    switch (view) {
      case 'calculator':
        path = '/';
        break;
      case 'rates':
        path = '/rates';
        break;
      case 'learning':
        path = '/learning';
        break;
      case 'article':
        if (articleSlug) {
          path = `/article/${articleSlug}`;
        } else {
          path = '/learning';
        }
        break;
    }
    
    // Replace current history entry
    window.history.replaceState({}, '', path);
    this.notifyListeners();
  }
}

export const router = Router.getInstance();
