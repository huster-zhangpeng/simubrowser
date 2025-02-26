import React from 'react';
import { Tab } from '../types';

interface TabCounterProps {
  tabs: Tab[];
  onClick: () => void;
}

export function TabCounter({ tabs, onClick }: TabCounterProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full 
        bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
        text-gray-700 dark:text-gray-300 transition-colors duration-200"
      aria-label={`${tabs.length} tabs open`}
    >
      {tabs.length}
    </button>
  );
}