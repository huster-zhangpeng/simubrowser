import React, { useState, KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { UserType } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

interface AddressBarProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
  currentUser?: UserType;
  onLogout?: () => void;
  onSettings?: () => void;
}

export function AddressBar({ currentUrl, onNavigate, currentUser, onLogout, onSettings }: AddressBarProps) {
  const [inputValue, setInputValue] = useState(currentUrl);
  const { theme, setTheme } = useTheme();

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let url = inputValue.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      onNavigate(url);
    }
  };

  return (
    <div className="flex items-center w-full">
      <div className="flex flex-1 items-center bg-white dark:bg-darkSecondary rounded-lg px-3 py-2 shadow-sm border dark:border-darkBorder mr-2">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 outline-none text-sm dark:bg-darkSecondary dark:text-darkText"
          placeholder="Enter URL or search"
        />
      </div>
      <div className="flex items-center space-x-2">
        <UserAvatar
          currentUser={currentUser}
          onLogout={onLogout}
          onSettings={onSettings}
        />
        <ThemeToggle onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
      </div>
    </div>
  );
}