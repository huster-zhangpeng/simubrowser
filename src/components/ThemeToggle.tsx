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
      className="
        w-8 h-8 sm:w-10 sm:h-10
        p-2 sm:p-3
        rounded-lg
        transition-all duration-300 ease-in-out
        hover:bg-gray-100 
        focus:outline-none focus:ring-2 
        focus:ring-primary-light focus:ring-opacity-50
        dark:hover:bg-darkSecondary dark:focus:ring-primary-dark
        hidden sm:block
        bg-white dark:bg-darkPrimary
      "
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300 hover:rotate-12" />
      )}
    </button>
  );
}
