import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { 
  LogOut, 
  Menu, 
  User,
  UserCircle,
  Bell,
  Search,
  HelpCircle,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout, isManager } = useAuth();
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm h-16">
      <div className="h-full flex items-center justify-between px-4">
        {/* Left side - Menu toggle and search */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className={cn(
              "text-slate-600 dark:text-slate-300 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50",
              "rounded-lg h-9 w-9"
            )}
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
      
          <div className="hidden md:flex relative">
            <form onSubmit={handleSearch}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={16} />
              </div>
              <input 
                type="search" 
                placeholder="Search..." 
                className="h-9 w-64 rounded-lg bg-slate-100 dark:bg-slate-800/50 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:text-white" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 dark:text-slate-300 rounded-lg h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800/50"
          >
            <HelpCircle size={18} />
          </Button>
          
          {/* Notification button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 dark:text-slate-300 rounded-lg h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800/50 relative"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="rounded-lg pl-2 pr-3 py-5 h-9 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 mt-1">
                <DropdownMenuLabel className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-base">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                      <span className="text-xs mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                        {user.role === 'MANAGER' ? 'Manager' : user.role === 'TECHNICIAN' ? 'Technician' : user.role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="px-4 py-2 cursor-pointer" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-4 py-2 cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout} 
                  className="px-4 py-2 text-destructive cursor-pointer transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button className="rounded-lg px-4 h-9 bg-primary hover:bg-primary/90 text-sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
