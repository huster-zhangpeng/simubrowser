import React from 'react';
import { X } from 'lucide-react';
import { Tab } from '../types';
import NewTabPage from './NewTabPage';

interface TabCardViewProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNavigate?: (url: string) => void;
}

export function TabCardView({
  isOpen,
  onClose,
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNavigate,
}: TabCardViewProps) {
  if (!isOpen) return null;

  const handleTabClick = (tabId: string) => {
    onTabSelect(tabId);
    onClose();
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fixed inset-x-0 bottom-0 p-4 bg-white dark:bg-gray-900 rounded-t-2xl
          transform transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold dark:text-white">
            {tabs.length} Tabs
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            aria-label="Close tab view"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pb-safe">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                relative group cursor-pointer rounded-lg overflow-hidden border
                ${
                  tab.id === activeTabId
                    ? 'border-blue-500 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-700'
                }
                hover:border-blue-500 dark:hover:border-blue-400
                transition-colors duration-200
              `}
            >
              <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-800">
                {tab.url ? (
                  <iframe
                    src={tab.url}
                    title={tab.title}
                    className="w-full h-full pointer-events-none"
                    sandbox=""
                  />
                ) : (
                  <NewTabPage
                    onNavigate={onNavigate}
                    className="h-full w-full pointer-events-none"
                  />
                )}
              </div>
              <div className="p-2 bg-white dark:bg-gray-900">
                <p className="text-sm font-medium truncate dark:text-white">
                  {tab.title || 'New Tab'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {tab.url || 'browser://newtab'}
                </p>
              </div>
              <button
                onClick={(e) => handleTabClose(e, tab.id)}
                className="absolute top-1 right-1 p-1 bg-gray-900/50 rounded-full
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Close tab"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
