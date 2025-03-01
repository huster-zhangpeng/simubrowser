import React, { useState, useCallback, useEffect } from 'react';
import { Bookmark as BookmarkType } from '../types';
import Bookmark from './Bookmark';

interface BookmarkBarProps {
  bookmarks: BookmarkType[];
  onUpdateBookmarks: (bookmarks: BookmarkType[]) => void;
  onNavigate: (url: string) => void;
}

const BookmarkBar: React.FC<BookmarkBarProps> = ({ bookmarks, onUpdateBookmarks, onNavigate }) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const handleLongPress = useCallback(() => {
    setIsDeleteMode(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    onUpdateBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    
    if (updatedBookmarks.length === 0) {
      setIsDeleteMode(false);
    }
  }, [bookmarks, onUpdateBookmarks]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.bookmark-container')) {
      setIsDeleteMode(false);
    }
  }, []);

  useEffect(() => {
    if (isDeleteMode) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDeleteMode, handleClickOutside]);

  if (bookmarks.length === 0) {
    return null;
  }

  return (
    <div className="bookmark-container w-full max-w-screen-lg mx-auto py-1 sm:py-2 overflow-x-auto snap-x touch-pan-x">
      <div className="flex flex-nowrap gap-2 px-4 min-w-full">
        {bookmarks.map(bookmark => (
          <div key={bookmark.id} className="flex-none snap-start">
            <Bookmark
              bookmark={bookmark}
              isDeleteMode={isDeleteMode}
              onDelete={handleDelete}
              onLongPress={handleLongPress}
              onNavigate={onNavigate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkBar;