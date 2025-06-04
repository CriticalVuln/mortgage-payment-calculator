export interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  canonical_url: string;
  author?: string;
  pub_date?: string;
  quote?: string;
  image_url?: string;
  tags: string[];
  sort_index: number;
  created_at: string;
  updated_at: string;
  reading_time?: number;
  is_published?: boolean;
}

export interface ArticleMetadata {
  title: string;
  summary?: string;
  author?: string;
  pub_date?: string;
  quote?: string;
  image_url?: string;
  canonical_url: string;
  tags: string[];
  reading_time?: number;
}

export interface DragDropResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
}

export interface LearningCenterState {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  lastMetadataFetch: Record<string, string>;
}
