import React from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface NavigationBarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
}

export function NavigationBar({
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onRefresh,
}: NavigationBarProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`p-1.5 rounded-full hover:bg-gray-100 ${
          !canGoBack ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className={`p-1.5 rounded-full hover:bg-gray-100 ${
          !canGoForward ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <button
        onClick={onRefresh}
        className="p-1.5 rounded-full hover:bg-gray-100"
      >
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
  );
}