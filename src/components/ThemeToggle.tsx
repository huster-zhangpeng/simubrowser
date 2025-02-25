import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  onClick?: () => void;
}

export function ThemeToggle({ onClick }: ThemeToggleProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg transition-colors duration-200
        hover:bg-gray-100 focus:outline-none focus:ring-2 
        focus:ring-primary-light focus:ring-opacity-50
        dark:hover:bg-darkSecondary dark:focus:ring-primary-dark"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
}