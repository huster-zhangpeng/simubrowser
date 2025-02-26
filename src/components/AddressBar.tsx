import React from 'react';

export function AddressBar() {

  useEffect(() => {
    checkIsBookmarked(currentUrl);
  }, [currentUrl, checkIsBookmarked]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let url = inputValue.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      onNavigate(url);
    }
  };

  const getBookmarksFromStorage = (): Promise<Bookmark[]> => {
    return Promise.resolve(JSON.parse(localStorage.getItem('bookmarks') || '[]'));
  };

  const saveBookmarksToStorage = (bookmarks: Bookmark[]): Promise<void> => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    return Promise.resolve();
  };

  const toggleBookmark = useCallback(async () => {
    const bookmarks = await getBookmarksFromStorage();

    if (isBookmarked) {
      const newBookmarks = bookmarks.filter(b => b.url !== currentUrl);
      await saveBookmarksToStorage(newBookmarks);
      setIsBookmarked(false);
    } else {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        url: currentUrl,
        title: getDomainFromUrl(currentUrl),
        createdAt: Date.now()
      };
      await saveBookmarksToStorage([...bookmarks, newBookmark]);
      setIsBookmarked(true);
    }
  }, [currentUrl, isBookmarked]);

  return (
    <div className="flex items-center w-full">
      <div className="flex flex-1 min-w-0 items-center bg-white dark:bg-darkSecondary rounded-lg px-3 h-10 shadow-sm border dark:border-darkBorder">
        <input
          type="text"
          value="browser://newtab"
          readOnly
          className="flex-1 min-w-0 h-8 sm:h-10 outline-none text-sm text-gray-500 dark:bg-darkSecondary dark:text-gray-400 cursor-default select-none"
        />
      </div>
    </div>
  );
}