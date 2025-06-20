import React, { useCallback, useRef } from 'react';
import { Bookmark as BookmarkType } from '../types';
import { IoCloseCircle } from 'react-icons/io5';

interface BookmarkProps {
  bookmark: BookmarkType;
  isDeleteMode: boolean;
  onDelete: (id: string) => void;
  onLongPress: () => void;
  onNavigate: (url: string, type: string) => void;
}

const Bookmark: React.FC<BookmarkProps> = ({
  bookmark,
  isDeleteMode,
  onDelete,
  onLongPress,
  onNavigate,
}) => {
  const longPressTimer = useRef<number>();
  const { title, url, icon, id } = bookmark;

  const handlePointerDown = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      onLongPress();
    }, 500);
  }, [onLongPress]);

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isDeleteMode) {
        onNavigate(url, '_self');
      }
    },
    [isDeleteMode, url, onNavigate]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(id);
    },
    [id, onDelete]
  );

  return (
    <div
      className="relative group flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
    >
      {isDeleteMode && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 z-10 text-red-500 hover:text-red-600 transition-colors"
        >
          <IoCloseCircle size={20} />
        </button>
      )}
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 mb-2">
        {icon ? (
          <img src={icon} alt={title} className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {title[0].toUpperCase()}
          </div>
        )}
      </div>
      <span className="text-sm text-center truncate w-full dark:text-gray-300">
        {title}
      </span>
    </div>
  );
};

export default Bookmark;
