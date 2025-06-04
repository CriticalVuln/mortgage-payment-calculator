import { articleService } from './articleService';
import { Article } from '../types/learningCenter';

export class RefreshScheduler {
  private static instance: RefreshScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private readonly STORAGE_KEY = 'learningCenter_lastRefresh';

  private constructor() {}

  static getInstance(): RefreshScheduler {
    if (!RefreshScheduler.instance) {
      RefreshScheduler.instance = new RefreshScheduler();
    }
    return RefreshScheduler.instance;
  }

  /**
   * Start the automatic refresh scheduler
   */
  start(): void {
    // Check if we need an immediate refresh
    this.checkAndRefreshIfNeeded();

    // Set up interval for future refreshes
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.checkAndRefreshIfNeeded();
    }, this.REFRESH_INTERVAL);

    console.log('Article metadata refresh scheduler started');
  }

  /**
   * Stop the automatic refresh scheduler
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('Article metadata refresh scheduler stopped');
  }

  /**
   * Force a refresh of all articles
   */
  async forceRefresh(): Promise<void> {
    console.log('Force refreshing article metadata...');
      try {
      const articles = await articleService.getArticles();
      const refreshPromises = articles.map(article => this.refreshArticleMetadata(article));
      
      await Promise.all(refreshPromises);
      this.updateLastRefreshTime();
      
      console.log(`Successfully refreshed metadata for ${articles.length} articles`);
    } catch (error) {
      console.error('Error during force refresh:', error);
      throw error;
    }
  }

  /**
   * Check if refresh is needed and perform it
   */
  private async checkAndRefreshIfNeeded(): Promise<void> {
    const lastRefresh = this.getLastRefreshTime();
    const now = Date.now();
    
    if (!lastRefresh || (now - lastRefresh) > this.REFRESH_INTERVAL) {
      console.log('24 hours have passed, refreshing article metadata...');
      await this.forceRefresh();
    }
  }  /**
   * Refresh metadata for a single article
   */
  private async refreshArticleMetadata(article: Article): Promise<void> {
    try {
      await articleService.refreshMetadata(article.id);
      console.log(`Refreshed metadata for: ${article.title}`);
    } catch (error) {
      console.error(`Failed to refresh metadata for article ${article.id}:`, error);
      // Don't throw - we want to continue refreshing other articles
    }
  }

  /**
   * Get the last refresh timestamp
   */
  private getLastRefreshTime(): number | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? parseInt(stored, 10) : null;
    } catch {
      return null;
    }
  }

  /**
   * Update the last refresh timestamp
   */
  private updateLastRefreshTime(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
    } catch (error) {
      console.error('Failed to update last refresh time:', error);
    }
  }

  /**
   * Get time until next scheduled refresh
   */
  getTimeUntilNextRefresh(): number {
    const lastRefresh = this.getLastRefreshTime();
    if (!lastRefresh) return 0;
    
    const nextRefresh = lastRefresh + this.REFRESH_INTERVAL;
    const now = Date.now();
    
    return Math.max(0, nextRefresh - now);
  }

  /**
   * Get human-readable time until next refresh
   */
  getTimeUntilNextRefreshString(): string {
    const msUntilRefresh = this.getTimeUntilNextRefresh();
    
    if (msUntilRefresh === 0) {
      return 'Refresh due now';
    }
    
    const hours = Math.floor(msUntilRefresh / (1000 * 60 * 60));
    const minutes = Math.floor((msUntilRefresh % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m until next refresh`;
    } else {
      return `${minutes}m until next refresh`;
    }
  }
}

// Export singleton instance
export const refreshScheduler = RefreshScheduler.getInstance();
