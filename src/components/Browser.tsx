import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NavigationBar } from './NavigationBar';
import { TabBar } from './TabBar';
import { TabCardView } from './TabCardView';
import NewTabPage from './NewTabPage';
import { BrowserState, Tab, getDomainFromUrl } from '../types';
import { ShieldAlert } from 'lucide-react';
import useStateRef from 'react-usestateref';

const createNewTab = (): Tab => ({
  id: uuidv4(),
  url: '',
  addr: '',
  title: 'New Tab',
  history: [],
  currentHistoryIndex: 0,
  error: null,
});

const findEmptyTab = (tabs: Tab[]): string | null => {
  const emptyTab = tabs.find((tab) => tab.url === '');
  return emptyTab ? emptyTab.id : null;
};

export function Browser() {
  const initialTab = createNewTab();
  const [browserState, setBrowserState, browserStateRef] =
    useStateRef<BrowserState>({
      tabs: [initialTab],
      activeTabId: initialTab.id,
    });

  const [isTabViewOpen, setIsTabViewOpen] = useState(false);

  const activeTab = useCallback(() => {
    return browserStateRef.current.tabs.find(
      (tab) => tab.id === browserState.activeTabId
    )!;
  }, [browserState, browserStateRef]);

  const updateActiveTab = useCallback(
    (updates: Partial<Tab>) => {
      setBrowserState((prev) => ({
        ...prev,
        tabs: prev.tabs.map((tab) =>
          tab.id === prev.activeTabId ? { ...tab, ...updates } : tab
        ),
      }));
    },
    [setBrowserState]
  );

  const handleNavigate = useCallback(
    (addr: string, type: string) => {
      if (activeTab().addr == addr) return;

      const newHistory = activeTab()
        .history.slice(0, activeTab().currentHistoryIndex + 1)
        .concat({
          addr,
          type,
        });

      console.log('newHistory:', newHistory);

      // 检测类型, 如果是 html5 history 则不需要更新 url, 如果是其他类型则需要更新 url
      let newUrl = type === 'html5' ? activeTab().url : addr;
      if (newUrl === '') {
        newUrl = addr;
      }

      console.log(`Navigating to ${addr} with type ${type}, newUrl: ${newUrl}`);

      updateActiveTab({
        url: newUrl,
        addr,
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1,
        error: null, // Clear any previous errors
      });
    },
    [activeTab, updateActiveTab]
  );

  const setActiveTabId = useCallback(
    (tabId: string) => {
      setBrowserState((prev) => ({ ...prev, activeTabId: tabId }));
    },
    [setBrowserState]
  );

  const handleNewTab = useCallback(() => {
    const emptyTabId = findEmptyTab(browserState.tabs);
    if (emptyTabId) {
      setActiveTabId(emptyTabId);
    } else {
      const newTab = createNewTab();
      setBrowserState((prev) => ({
        ...prev,
        tabs: [...prev.tabs, newTab],
        activeTabId: newTab.id,
      }));
    }
  }, [browserState.tabs, setActiveTabId, setBrowserState]);

  const handleCloseTab = (tabId: string) => {
    setBrowserState((prev) => {
      const newTabs = prev.tabs.filter((tab) => tab.id !== tabId);
      if (newTabs.length === 0) {
        const newTab = createNewTab();
        return {
          tabs: [newTab],
          activeTabId: newTab.id,
        };
      }
      return {
        tabs: newTabs,
        activeTabId:
          prev.activeTabId === tabId ? newTabs[0].id : prev.activeTabId,
      };
    });
  };

  const handleBack = () => {
    if (activeTab().currentHistoryIndex > 0) {
      const current = activeTab().history[activeTab().currentHistoryIndex];
      const before = activeTab().history[activeTab().currentHistoryIndex - 1];

      let newUrl = '';
      if (current.type === 'html5') {
        newUrl = activeTab().url;
        const iframe = document.getElementById(
          activeTab().id
        ) as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              action: 'navigate',
              type: 'back',
            },
            '*'
          );
        }
      } else {
        newUrl = before.addr;
      }

      updateActiveTab({
        currentHistoryIndex: activeTab().currentHistoryIndex - 1,
        url: newUrl,
        addr: before.addr,
        error: null,
      });
    }
  };

  const handleForward = () => {
    if (activeTab().currentHistoryIndex < activeTab().history.length - 1) {
      const last = activeTab().history[activeTab().currentHistoryIndex + 1];
      // 如果是 html5 history 则不需要更新 url, 而是发送事件给 iframe
      let newUrl = '';
      if (last.type === 'html5') {
        newUrl = activeTab().url;
        const iframe = document.getElementById(
          activeTab().id
        ) as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              action: 'navigate',
              type: 'forward',
            },
            '*'
          );
        }
      } else {
        newUrl = last.addr;
      }

      updateActiveTab({
        currentHistoryIndex: activeTab().currentHistoryIndex + 1,
        url: newUrl,
        addr: last.addr,
        error: null,
      });
    }
  };

  const handleRefresh = () => {
    updateActiveTab({ error: null }); // Clear any previous errors
    const iframe = document.querySelector(
      `iframe[data-tab-id="${activeTab().id}"]`
    ) as HTMLIFrameElement;
    if (iframe) {
      const currentSrc = activeTab().addr;
      iframe.src = 'about:blank';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 50);
    }
  };

  const handleIframeError = () => {
    updateActiveTab({
      error:
        'This website cannot be displayed in an iframe due to security restrictions.',
      title: 'Cannot Display Content',
    });
  };

  const handleIframeLoad = useCallback(
    (event: React.SyntheticEvent<HTMLIFrameElement>) => {
      try {
        const iframe = event.target as HTMLIFrameElement;
        const title =
          iframe.contentDocument?.title || getDomainFromUrl(activeTab().url);
        updateActiveTab({ title });
      } catch (error) {
        console.error('Error loading iframe:', error);
        const title = getDomainFromUrl(activeTab().url);
        updateActiveTab({ title });
      }
    },
    [activeTab, updateActiveTab]
  );

  const isCurrentTabNewTabPage = activeTab().url === '';

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.data.action === 'open_url') {
        console.info('Received message event:', event);
        let url = event.data.url as string;
        if (url.startsWith('/')) {
          url = `${event.origin}${url}`;
        }
        switch (event.data.target) {
          case '_blank': {
            const newTab = createNewTab();
            newTab.url = url;
            setBrowserState((prev) => ({
              ...prev,
              tabs: [...prev.tabs, newTab],
              activeTabId: newTab.id,
            }));
            break;
          }

          default: {
            console.log('Navigating to:', url);
            handleNavigate(url as string, event.data.target as string);
          }
        }
      }

      if (event.data.environment === 'ANYSEE') {
        const iframe = document.getElementById(
          activeTab().id
        ) as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ origin: 'ANYSEE' }, '*');
        }
      }
    },
    [setBrowserState, handleNavigate, activeTab]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-darkBg">
      <TabBar
        tabs={browserState.tabs}
        activeTabId={browserState.activeTabId}
        onTabSelect={(id) =>
          setBrowserState((prev) => ({ ...prev, activeTabId: id }))
        }
        onTabClose={handleCloseTab}
        onNewTab={handleNewTab}
        isNewTabPage={isCurrentTabNewTabPage}
      />
      <div className="flex-1 relative">
        {browserState.tabs.map((tab) => (
          <div
            key={`${tab.id}-${tab.url}`}
            className={`absolute inset-0 flex flex-col overflow-hidden ${
              tab.id === browserState.activeTabId ? 'visible' : 'hidden'
            }`}
          >
            <div className="flex items-center space-x-4 px-2 bg-gray-50 dark:bg-darkSecondary">
              <NavigationBar
                canGoBack={tab.currentHistoryIndex > 0}
                canGoForward={tab.currentHistoryIndex < tab.history.length - 1}
                onBack={handleBack}
                onForward={handleForward}
                onRefresh={handleRefresh}
                tabs={browserState.tabs}
                onTabViewOpen={() => setIsTabViewOpen(true)}
                onNewTab={handleNewTab}
                onNavigate={handleNavigate}
                currentUrl={() => {
                  return activeTab().addr;
                }}
                isNewTabPage={isCurrentTabNewTabPage}
              />
            </div>
            {tab.error ? (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-darkSecondary">
                <div className="bg-white dark:bg-darkBg p-8 rounded-lg shadow-md max-w-md text-center dark:shadow-darkSecondary">
                  <ShieldAlert className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-darkText mb-2">
                    Security Notice
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {tab.error}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Try opening{' '}
                    <a
                      href={tab.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-light dark:text-primary-dark hover:underline"
                    >
                      {tab.url}
                    </a>{' '}
                    in a new window instead.
                  </p>
                </div>
              </div>
            ) : !tab.url ? (
              <NewTabPage onNavigate={handleNavigate} />
            ) : (
              <iframe
                id={tab.id}
                src={tab.url}
                className="w-full h-full border-0 flex-1 min-w-0"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={tab.title}
                data-tab-id={tab.id}
                allowFullScreen
                allow="fullscreen"
                sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-pointer-lock allow-popups allow-presentation"
              />
            )}
          </div>
        ))}
      </div>
      <TabCardView
        isOpen={isTabViewOpen}
        onClose={() => setIsTabViewOpen(false)}
        tabs={browserState.tabs}
        activeTabId={browserState.activeTabId}
        onTabSelect={(id) =>
          setBrowserState((prev) => ({ ...prev, activeTabId: id }))
        }
        onTabClose={handleCloseTab}
      />
    </div>
  );
}
