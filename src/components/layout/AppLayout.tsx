import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { SearchProvider } from '@/contexts/SearchContext';

export function AppLayout() {
  // Initialize to true for desktop, false for mobile
  const isMobile = window.innerWidth < 768;
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [initialRender, setInitialRender] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(isMobile ? 0 : 150);
  
  useEffect(() => {
    // After initial render, set to false
    setInitialRender(false);
    
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile && !sidebarOpen) {
        setSidebarOpen(true);
      } else if (isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);
  
  // Update sidebar width when sidebar state changes
  useEffect(() => {
    if (sidebarOpen) {
      setSidebarWidth(window.innerWidth < 1024 ? 70 : 150);
    } else {
      setSidebarWidth(0);
    }
  }, [sidebarOpen]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <SearchProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header - sticks to top */}
        <Header toggleSidebar={toggleSidebar} />
        
        {/* Main content area with L-shaped layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
          
          {/* Main content - scrollable */}
          <main className="flex-1 overflow-auto p-4 md:p-6 transition-all duration-300">
            <Outlet />
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}

export default AppLayout;
