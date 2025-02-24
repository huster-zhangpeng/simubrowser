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