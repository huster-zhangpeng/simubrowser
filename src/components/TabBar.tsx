import React from 'react';
import { Plus, X } from 'lucide-react';
import { Tab, getDomainFromUrl } from '../types';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
}

export function TabBar({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
}: TabBarProps) {
  return (
    <div className="flex items-center bg-gray-200 px-2">
      <div className="flex items-center space-x-1 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`group flex items-center px-4 py-2 pr-2 rounded-t-lg cursor-pointer ${
              tab.id === activeTabId
                ? 'bg-white text-gray-800'
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
        <button
          onClick={onNewTab}
          className="p-2 hover:bg-gray-300 rounded-full"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}