export interface Tab {
  id: string;
  url: string;
  title: string;
  history: string[];
  currentHistoryIndex: number;
  error: string | null;
}

export interface BrowserState {
  tabs: Tab[];
  activeTabId: string;
}

export interface UserType {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface CurrentUserContextType {
  currentUser: UserType | null;
  setCurrentUser: (user: UserType | null) => void;
  isAuthenticated: boolean;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export interface ShortcutSite {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  icon?: string;
  createdAt: number;
}

export interface BookmarkProps {
  bookmark: Bookmark;
  isDeleteMode: boolean;
  onDelete: (id: string) => void;
  onLongPress: () => void;
}

export interface BookmarkBarProps {
  bookmarks: Bookmark[];
  onUpdateBookmarks: (bookmarks: Bookmark[]) => void;
}

export interface BookmarkUtils {
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => Promise<Bookmark>;
  removeBookmark: (id: string) => Promise<void>;
  getBookmarks: () => Promise<Bookmark[]>;
  getBookmarkByUrl: (url: string) => Promise<Bookmark | null>;
  updateBookmark: (id: string, data: Partial<Omit<Bookmark, 'id'>>) => Promise<Bookmark>;
}

export function getDomainFromUrl(url: string): string {
  if (url === 'about:blank' || url === 'chrome://newtab') {
    return 'New Tab';
  }

  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return url;
  }
}