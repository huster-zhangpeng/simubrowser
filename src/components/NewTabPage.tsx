import React, { useState, useEffect } from 'react';
import { ShortcutSite, Bookmark } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { TrashIcon } from '@heroicons/react/24/outline';

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
  data: ShortcutSite | Bookmark;
  type: 'bookmark' | 'shortcut';
  onDelete?: (id: string) => void;
}

const ShortcutCard: React.FC<ShortcutCardProps> = ({ data, type, onDelete }) => {
  const { theme } = useTheme();
  const isBookmark = type === 'bookmark';

  return (
    <div className="relative group">
      <a
        href={data.url}
        className={`
          block p-4 rounded-lg transition-all duration-200
          ${theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-white hover:bg-gray-50'}
          shadow-sm hover:shadow-md
          flex items-center gap-3
          border border-gray-200 dark:border-gray-700
        `}
      >
        <span className="text-2xl w-6 h-6 flex items-center justify-center">
          {data.icon}
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
          {data.title}
        </span>
      </a>
      {isBookmark && onDelete && (
        <button
          onClick={() => onDelete(data.id)}
          className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100
            transition-opacity duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <TrashIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      )}
    </div>
  );
};

interface NewTabPageProps {
  onNavigate?: (url: string) => void;
}

const NewTabPage: React.FC<NewTabPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  
  const handleDeleteBookmark = async (id: string) => {
    try {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
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

  return (
    <div className={`
      min-h-screen w-full p-8
      ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}
    `}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`
          text-2xl font-bold mb-8 text-center
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
        `}>
          Quick Access
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {shortcuts.map((site) => (
            <ShortcutCard
              key={site.id}
              data={site}
              type="shortcut"
            />
          ))}
        </div>
        <h2 className={`
          text-2xl font-bold my-8 text-center
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
        `}>
          Bookmarks
        </h2>
        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {bookmarks.map((bookmark) => (
              <ShortcutCard
                key={bookmark.id}
                data={{
                  id: bookmark.id,
                  title: bookmark.title,
                  url: bookmark.url,
                  icon: bookmark.icon || '🔖'
                }}
                type="bookmark"
                onDelete={handleDeleteBookmark}
              />
            ))}
          </div>
        ) : (
          <p className={`text-center text-gray-500 dark:text-gray-400 mt-4`}>
            No bookmarks yet. Click the star icon in the address bar to add bookmarks.
          </p>
        )}
      </div>
    </div>
  );
};

export default NewTabPage;