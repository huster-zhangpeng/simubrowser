import React from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Plus } from 'lucide-react';
import { TabCounter } from './TabCounter';
import { Tab, UserType } from '../types';
import { UserAvatar } from './UserAvatar';
import { ThemeToggle } from './ThemeToggle';
import { AddressBar } from './AddressBar';
import { useTheme } from '../contexts/ThemeContext';

interface NavigationBarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  tabs: Tab[];
  onTabViewOpen: () => void;
  onNewTab: () => void;
  currentUrl: string;
  onNavigate: (url: string) => void;
  currentUser?: UserType;
  onLogout?: () => void;
  onSettings?: () => void;
}

export function NavigationBar({
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onRefresh,
  tabs,
  onTabViewOpen,
  onNewTab,
  currentUrl,
  onNavigate,
  currentUser,
  onLogout,
  onSettings,
}: NavigationBarProps) {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-1 items-center gap-2 p-2 dark:bg-gray-900 min-w-0">
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className={`w-8 h-8 sm:w-10 sm:h-10 p-2 sm:p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${
            !canGoBack ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ChevronLeft className="text-xl dark:text-gray-400" />
        </button>
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className={`w-10 h-10 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${
            !canGoForward ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ChevronRight className="text-xl dark:text-gray-400" />
        </button>
        <button
          onClick={onRefresh}
          className="w-10 h-10 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
        <RefreshCw className="text-xl dark:text-gray-400" />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <AddressBar currentUrl={currentUrl} onNavigate={onNavigate} />
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={onNewTab}
            className="w-8 h-8 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 dark:text-gray-400" />
          </button>
          <TabCounter tabs={tabs} onClick={onTabViewOpen} />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
          <UserAvatar
            currentUser={currentUser}
            onLogout={onLogout}
            onSettings={onSettings}
          />
        </div>
      </div>
    </div>
  );
}