import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NavigationBar } from './NavigationBar';
import { AddressBar } from './AddressBar';
import { TabBar } from './TabBar';
import { BrowserState, Tab } from '../types';
import { ShieldAlert } from 'lucide-react';

const createNewTab = (): Tab => ({
  id: uuidv4(),
  url: 'about:blank',
  title: 'New Tab',
  history: ['about:blank'],
  currentHistoryIndex: 0,
  error: null,
});

export function Browser() {
  const initialTab = createNewTab();
  const [browserState, setBrowserState] = useState<BrowserState>({
    tabs: [initialTab],
    activeTabId: initialTab.id,
  });

  const activeTab = browserState.tabs.find(
    (tab) => tab.id === browserState.activeTabId
  )!;

  const updateActiveTab = (updates: Partial<Tab>) => {
    setBrowserState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab) =>
        tab.id === prev.activeTabId ? { ...tab, ...updates } : tab
      ),
    }));
  };

  const handleNavigate = (url: string) => {
    const newHistory = activeTab.history
      .slice(0, activeTab.currentHistoryIndex + 1)
      .concat(url);
    updateActiveTab({
      url,
      history: newHistory,
      currentHistoryIndex: newHistory.length - 1,
      error: null, // Clear any previous errors
    });
  };

  const handleNewTab = () => {
    const newTab = createNewTab();
    setBrowserState((prev) => ({
      tabs: [...prev.tabs, newTab],
      activeTabId: newTab.id,
    }));
  };

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
    if (activeTab.currentHistoryIndex > 0) {
      updateActiveTab({
        currentHistoryIndex: activeTab.currentHistoryIndex - 1,
        url: activeTab.history[activeTab.currentHistoryIndex - 1],
        error: null,
      });
    }
  };

  const handleForward = () => {
    if (activeTab.currentHistoryIndex < activeTab.history.length - 1) {
      updateActiveTab({
        currentHistoryIndex: activeTab.currentHistoryIndex + 1,
        url: activeTab.history[activeTab.currentHistoryIndex + 1],
        error: null,
      });
    }
  };

  const handleRefresh = () => {
    updateActiveTab({ error: null }); // Clear any previous errors
    const iframe = document.querySelector(`iframe[data-tab-id="${activeTab.id}"]`);
    if (iframe) {
      iframe.setAttribute('key', Date.now().toString());
    }
  };

  const handleIframeError = () => {
    updateActiveTab({
      error: "This website cannot be displayed in an iframe due to security restrictions.",
      title: "Cannot Display Content",
    });
  };

  const handleIframeLoad = useCallback((event: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const title = event.currentTarget.contentDocument?.title;
      if (title) {
        updateActiveTab({ title });
      }
    } catch (error) {
      // Handle cross-origin restrictions gracefully
      handleIframeError();
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TabBar
        tabs={browserState.tabs}
        activeTabId={browserState.activeTabId}
        onTabSelect={(id) => setBrowserState((prev) => ({ ...prev, activeTabId: id }))}
        onTabClose={handleCloseTab}
        onNewTab={handleNewTab}
      />
      <div className="flex items-center space-x-4 p-2 bg-gray-50 border-b">
        <NavigationBar
          canGoBack={activeTab.currentHistoryIndex > 0}
          canGoForward={activeTab.currentHistoryIndex < activeTab.history.length - 1}
          onBack={handleBack}
          onForward={handleForward}
          onRefresh={handleRefresh}
        />
        <AddressBar
          currentUrl={activeTab.url}
          onNavigate={handleNavigate}
        />
      </div>
      <div className="flex-1 relative">
        {browserState.tabs.map((tab) => (
          <div
            key={`${tab.id}-${tab.url}`}
            className={`absolute inset-0 ${
              tab.id === browserState.activeTabId ? 'visible' : 'hidden'
            }`}
          >
            {tab.error ? (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
                  <ShieldAlert className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Security Notice</h2>
                  <p className="text-gray-600">{tab.error}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    Try opening <a href={tab.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {tab.url}
                    </a> in a new window instead.
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                src={tab.url}
                className="w-full h-full border-0"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={tab.title}
                data-tab-id={tab.id}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}