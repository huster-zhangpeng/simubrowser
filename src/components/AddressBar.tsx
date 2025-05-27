import { useState, KeyboardEvent, useEffect, useCallback } from 'react';
import { Search, Star, StarOff } from 'lucide-react';
import { Bookmark, getDomainFromUrl } from '../types';

const RESERVED_SUBDOMAINS = ['doc', 'docs', 'www', 'console', 'api'];

interface AddressBarProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
}

export function AddressBar({ currentUrl, onNavigate }: AddressBarProps) {
  const [inputValue, setInputValue] = useState(currentUrl);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const checkIsBookmarked = useCallback(async (url: string) => {
    const bookmarks = await getBookmarksFromStorage();
    const found = bookmarks.find((b) => b.url === url);
    setIsBookmarked(!!found);
  }, []);

  useEffect(() => {
    checkIsBookmarked(currentUrl);
  }, [currentUrl, checkIsBookmarked]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let url = inputValue.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // Check if domain is genmeta.net
        if (url.endsWith('genmeta.net')) {
          // Extract subdomain if present
          const parts = url.split('.');
          if (parts.length == 3) {
            const subdomain = parts[0];
            // If subdomain is not reserved, use http://
            if (!RESERVED_SUBDOMAINS.includes(subdomain)) {
              url = `http://${url}`;
            } else {
              url = `https://${url}`;
            }
          } else {
            // Not match subdomain
            url = `https://${url}`;
          }
        } else {
          // Not genmeta.net domain
          url = `https://${url}`;
        }
      }
      onNavigate(url);
    }
  };

  const getBookmarksFromStorage = (): Promise<Bookmark[]> => {
    return Promise.resolve(
      JSON.parse(localStorage.getItem('bookmarks') || '[]')
    );
  };

  const saveBookmarksToStorage = (bookmarks: Bookmark[]): Promise<void> => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    return Promise.resolve();
  };

  const toggleBookmark = useCallback(async () => {
    const bookmarks = await getBookmarksFromStorage();

    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((b) => b.url !== currentUrl);
      await saveBookmarksToStorage(newBookmarks);
      setIsBookmarked(false);
    } else {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        url: currentUrl,
        title: getDomainFromUrl(currentUrl),
        createdAt: Date.now(),
      };
      await saveBookmarksToStorage([...bookmarks, newBookmark]);
      setIsBookmarked(true);
    }
  }, [currentUrl, isBookmarked]);

  return (
    <div className="flex flex-1 min-w-0">
      <div className="flex flex-1 min-w-0 items-center bg-white dark:bg-darkSecondary rounded-lg px-3 shadow-sm border dark:border-darkBorder transition-all duration-200">
        <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 min-w-0 h-8 sm:h-10 outline-none text-sm dark:bg-darkSecondary dark:text-darkText mr-2 text-ellipsis overflow-hidden whitespace-nowrap"
          placeholder="Enter URL or search"
        />
        <button
          onClick={toggleBookmark}
          className="hover:text-yellow-500 flex-shrink-0"
          title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
          {isBookmarked ? (
            <Star className="w-5 h-5 text-yellow-400" />
          ) : (
            <StarOff className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
}
