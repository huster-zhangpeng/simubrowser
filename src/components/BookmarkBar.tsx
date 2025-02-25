import React, { useState, useCallback, useEffect } from 'react';
import { Bookmark as BookmarkType } from '../types';
import Bookmark from './Bookmark';

interface BookmarkBarProps {
  bookmarks: BookmarkType[];
  onUpdateBookmarks: (bookmarks: BookmarkType[]) => void;
}

const BookmarkBar: React.FC<BookmarkBarProps> = ({ bookmarks, onUpdateBookmarks }) => {
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
    <div className="bookmark-container w-full max-w-screen-lg mx-auto px-4 py-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
      {bookmarks.map(bookmark => (
        <Bookmark
          key={bookmark.id}
          bookmark={bookmark}
          isDeleteMode={isDeleteMode}
          onDelete={handleDelete}
          onLongPress={handleLongPress}
        />
      ))}
    </div>
  );
};

export default BookmarkBar;