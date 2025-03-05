import React, { useState, useEffect } from 'react';
import { ShortcutSite, Bookmark } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import BookmarkBar from './BookmarkBar';

const shortcuts: ShortcutSite[] = [
  {
    id: '1',
    title: 'HTML5 Test',
    url: 'https://html5test.com',
    icon: '🌐'
  },
  {
    id: '2',
    title: 'Bilibili',
    url: 'https://www.bilibili.com',
    icon: '📺'
  },
  {
    id: '3',
    title: 'Can I use',
    url: 'https://caniuse.com',
    icon: '🐱'
  },
  {
    id: '4',
    title: 'DeepSeek',
    url: 'https://www.deepseek.com',
    icon: '🔍'
  },
  {
    id: '5',
    title: 'Cengage',
    url: 'https://www.cengageasia.com',
    icon: '▶️'
  },
  {
    id: '6',
    title: 'AtomGit',
    url: 'https://atomgit.com',
    icon: '🤖'
  }
];

interface ShortcutCardProps {
  site: ShortcutSite;
  onClick: (url: string) => void;
  className?: string;
}

const ShortcutCard: React.FC<ShortcutCardProps> = ({ site, onClick, className }) => {
  const { theme } = useTheme();
  
  return (
    <button
      onClick={() => onClick(site.url)}
      className={`
        w-full rounded-lg transition-all duration-200
        ${className ? 'p-2' : 'p-3 sm:p-4'}
        ${theme === 'dark' 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-white hover:bg-gray-50'}
        hover:scale-105
        flex flex-col items-center justify-center gap-2
        border border-gray-200 dark:border-gray-700
      `}
    >
      <span className={`${className ? 'text-xl' : 'text-2xl'}`}>{site.icon}</span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {site.title}
      </span>
    </button>
  );
};

interface NewTabPageProps {
  onNavigate?: (url: string) => void;
  className?: string;
}

const NewTabPage: React.FC<NewTabPageProps> = ({ onNavigate, className }) => {
  const { theme } = useTheme();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  
  const handleShortcutClick = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    }
  };

  useEffect(() => {
    const loadBookmarks = async () => {
      const data = JSON.parse(localStorage.getItem('bookmarks') || '[]') as Bookmark[];
      const sortedBookmarks = data.sort((a, b) => b.createdAt - a.createdAt);
      setBookmarks(sortedBookmarks);
    };
    loadBookmarks();
  }, []);

  const handleUpdateBookmarks = (updatedBookmarks: Bookmark[]) => {
    setBookmarks(updatedBookmarks);
  };

  return (
    <div className={`
      w-full overflow-auto
      ${className ? 'aspect-[4/3]' : 'min-h-screen'}
      ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}
      ${className ? 'p-2' : ''}
      ${className || ''}
    `}>
      <div className={`w-full max-w-6xl mx-auto ${className ? 'p-2 space-y-2' : 'p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8'}`}>
        <h1 className={`
          ${className ? 'text-xl' : 'text-3xl'} font-bold text-center
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
        `}>
          Quick Access
        </h1>
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 
          ${className ? 'gap-2' : 'gap-4 sm:gap-6 md:gap-8'}
        `}>
          {shortcuts.map((site) => (
            <ShortcutCard
              key={site.id}
              site={site}
              onClick={handleShortcutClick}
              className={className}
            />
          ))}
        </div>
        <h2 className={`
          text-2xl font-bold my-8 text-center
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
        `}>
          Bookmarks
        </h2>
        <BookmarkBar
          bookmarks={bookmarks}
          onUpdateBookmarks={handleUpdateBookmarks}
          onNavigate={onNavigate || (() => {})}
        />
        {bookmarks.length === 0 && (
          <p className={`text-center text-gray-500 dark:text-gray-400 mt-4`}>
            No bookmarks yet. Click the star icon in the address bar to add bookmarks.
          </p>
        )}
      </div>
    </div>
  );
};

export default NewTabPage;