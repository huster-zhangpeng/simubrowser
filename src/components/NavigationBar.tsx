import React from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Plus } from 'lucide-react';
import { TabCounter } from './TabCounter';
import { UserAvatar } from './UserAvatar';
import { AddressBar } from './AddressBar';
import { ThemeToggle } from './ThemeToggle';
import { Tab } from '../types';

interface NavigationBarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  tabs: Tab[];
  onTabViewOpen: () => void;
  onNewTab: () => void;
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
}: NavigationBarProps) {
  return (
    <div className="flex items-center w-full min-w-0 space-x-2 dark:bg-gray-900">
      {/* Navigation buttons - desktop only */}
      <div className="hidden md:flex items-center space-x-2">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className={`w-8 h-8 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${
            !canGoBack ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ChevronLeft className="w-full h-full dark:text-gray-400" />
        </button>
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className={`w-8 h-8 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${
            !canGoForward ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ChevronRight className="w-full h-full dark:text-gray-400" />
        </button>
        <button
          onClick={onRefresh}
          className="w-8 h-8 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <RefreshCw className="w-full h-full dark:text-gray-400" />
        </button>
      </div>

      {/* Address bar */}
      <div className="flex-1 min-w-0">
        <AddressBar currentUrl="" onNavigate={() => {}} />
      </div>

      {/* Right side tools */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onNewTab}
          className="md:hidden w-8 h-8 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Plus className="w-full h-full dark:text-gray-400" />
        </button>
        <TabCounter className="md:hidden" tabs={tabs} onClick={onTabViewOpen} />
        <UserAvatar />
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}