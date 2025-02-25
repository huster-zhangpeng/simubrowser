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