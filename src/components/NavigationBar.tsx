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
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`w-8 h-8 sm:w-10 sm:h-10 p-2 sm:p-3 rounded-full hover:bg-gray-100 ${
          !canGoBack ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ChevronLeft className="text-lg sm:text-xl" />
      </button>
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className={`w-8 h-8 sm:w-10 sm:h-10 p-2 sm:p-3 rounded-full hover:bg-gray-100 ${
          !canGoForward ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ChevronRight className="text-lg sm:text-xl" />
      </button>
      <button
        onClick={onRefresh}
        className="w-8 h-8 sm:w-10 sm:h-10 p-2 sm:p-3 rounded-full hover:bg-gray-100"
      >
        <RefreshCw className="text-lg sm:text-xl" />
      </button>
    </div>
  );
}