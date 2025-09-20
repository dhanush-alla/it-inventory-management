import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Box, 
  Users, 
  QrCode, 
  ClipboardList,
  FileBarChart2,
  BarChart3,
  Settings,
  FolderOpen,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers,
  Ticket
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

function SidebarItem({ to, icon, label, collapsed }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Link 
          to={to}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 my-1 relative group",
            isActive 
              ? "bg-primary/10 text-primary"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white",
            collapsed ? "justify-center" : "",
            "hover:translate-x-1"
          )}
        >
          <span className="flex-shrink-0 transition-transform duration-200">{icon}</span>
          <span className={cn("whitespace-nowrap transition-all duration-200", 
            collapsed ? "w-0 overflow-hidden opacity-0 absolute left-[100%]" : "opacity-100")}>
            {label}
          </span>
          {isActive && (
            <span className="absolute inset-y-0 left-0 w-0.5 bg-primary rounded-r-lg" />
          )}
        </Link>
      </TooltipTrigger>
      {collapsed && (
        <TooltipContent side="right" align="center" className="font-medium z-50">
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

export function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const { isAuthenticated, isManager, logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mounted, setMounted] = useState(false);
  
  // Handle window resize to auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle sidebar click on mobile - close after navigation
  const handleClick = () => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };
  
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity duration-300" 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={cn(
          "h-full z-20 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-[70px]" : "w-[150px]",
          mounted ? "opacity-100" : "opacity-0",
        )}
      >
        <div className={cn(
          "flex h-16 items-center px-4 justify-between border-b border-slate-200 dark:border-slate-800",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {/* {!collapsed && (
            <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-[1.02]" onClick={handleClick}>
              <div className="bg-primary/20 text-primary p-1.5 rounded-md">
                <Layers size={18} />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">IT Pulse</span>
            </Link>
          )} */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full h-8 w-8 transition-all duration-200"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className={cn(
            "flex flex-col p-3 text-slate-600 dark:text-slate-300", 
            collapsed ? "items-center" : "",
            "animate-fadeIn"
          )} onClick={handleClick}>
            <div className={cn("px-3 py-1.5 text-xs uppercase text-slate-500 font-semibold", 
              collapsed ? "sr-only" : "")}>
              Navigation
            </div>
            
            <SidebarItem 
              to="/" 
              icon={<LayoutDashboard size={collapsed ? 20 : 18} />} 
              label="Dashboard" 
              collapsed={collapsed}
            />
            
            <SidebarItem 
              to="/assets" 
              icon={<Box size={collapsed ? 20 : 18} />} 
              label="Assets" 
              collapsed={collapsed}
            />
            
            <SidebarItem 
              to="/asset-cost-analysis" 
              icon={<BarChart3 size={collapsed ? 20 : 18} />} 
              label="Cost Analysis" 
              collapsed={collapsed}
            />
            
            <SidebarItem 
              to="/employees" 
              icon={<Users size={collapsed ? 20 : 18} />} 
              label="Employees" 
              collapsed={collapsed}
            />
            
            <SidebarItem 
              to="/scanner" 
              icon={<QrCode size={collapsed ? 20 : 18} />} 
              label="Scanner" 
              collapsed={collapsed}
            />
            
            {isManager && (
              <>
                <SidebarItem 
                  to="/reports" 
                  icon={<FileBarChart2 size={collapsed ? 20 : 18} />} 
                  label="Reports" 
                  collapsed={collapsed}
                />
               
                <div className={cn("px-3 py-1.5 text-xs uppercase text-slate-500 font-semibold mt-6 mb-1", 
                  collapsed ? "sr-only" : "")}>Management</div>
                <SidebarItem 
                  to="/all-tickets" 
                  icon={<Ticket size={collapsed ? 20 : 18} />} 
                  label="All Tickets" 
                  collapsed={collapsed}
                />
                <SidebarItem 
                  to="/admin" 
                  icon={<ShieldCheck size={collapsed ? 20 : 18} />} 
                  label="User Admin" 
                  collapsed={collapsed}
                />
                <SidebarItem 
                  to="/settings" 
                  icon={<Settings size={collapsed ? 20 : 18} />} 
                  label="Settings" 
                  collapsed={collapsed}
                />
              </>
            )}
            
            {/* User profile section at bottom */}
            <div className="mt-auto pt-4">
              <div className={cn(
                "px-3 py-1.5 text-xs uppercase text-slate-500 font-semibold mb-1", 
                collapsed ? "sr-only" : "")}>
                Account
              </div>
              
              {!collapsed && user && (
                <div className="flex items-center gap-3 px-3 py-3 mx-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-200">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium truncate">{user.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</span>
                  </div>
                </div>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={logout}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 my-1 w-full hover:bg-red-500/10 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300",
                      collapsed ? "justify-center" : "",
                      "hover:translate-x-1"
                    )}
                  >
                    <LogOut size={collapsed ? 20 : 18} />
                    <span className={cn("transition-all duration-200", 
                      collapsed ? "w-0 overflow-hidden opacity-0" : "opacity-100")}>
                      Log out
                    </span>
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" align="center">
                    Log out
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}

export default Sidebar;
