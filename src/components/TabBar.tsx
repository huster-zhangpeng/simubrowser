import React from 'react';
import { Plus, X } from 'lucide-react';
import { Tab, getDomainFromUrl } from '../types';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
  isNewTabPage?: boolean;
}

export function TabBar({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
  isNewTabPage = false,
}: TabBarProps) {
  return (
    <div className="relative flex items-center bg-gray-200 px-2 hidden sm:flex">
      <div className="flex-1 relative">
        <div className="flex items-center gap-1 overflow-x-auto snap-x py-1 scroll-smooth touch-pan-x">
          {tabs.map((tab) => (
            <div
              key={tab.id}
            className={`group flex items-center gap-1 px-3 py-2 pr-2 rounded-t-lg cursor-pointer snap-start min-w-[100px] sm:min-w-[140px] md:min-w-[160px] scroll-ml-6 transition-colors ${
              tab.id === activeTabId
                ? 'bg-white text-gray-800 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => onTabSelect(tab.id)}
          >
            <span className="truncate max-w-[200px]">
              {getDomainFromUrl(tab.url)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className="ml-2 p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          ))}
        {!isNewTabPage && (
          <button
            onClick={onNewTab}
            className="p-2 hover:bg-gray-300 rounded-full"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-200 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}