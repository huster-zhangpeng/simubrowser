import React from 'react';
import { Browser } from './components/Browser';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="h-screen bg-gray-100 dark:bg-darkBg">
        <Browser />
      </div>
    </ThemeProvider>
  );
}

export default App;