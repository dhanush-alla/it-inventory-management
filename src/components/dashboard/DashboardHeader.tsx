import { User } from '@/types';
import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const { isManager } = useAuth();
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('en-US', options);
  
  return (
    <div className="mb-8">
      <div className="flex flex-col space-y-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Welcome back, {userName || 'User'}!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-1">
            <CalendarDays size={14} className="mr-1 text-primary" />
            {formattedDate}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isManager && (
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium hover:bg-primary/20"
              asChild
            >
              <Link to="/reports">
                Generate Report
              </Link>
            </Button>
          )}
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-lg bg-primary text-white px-3 py-1.5 text-sm font-medium hover:bg-primary/90"
            asChild
          >
            <Link to="/assets/new">
              Add New Asset
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 rounded-lg">
        <h2 className="text-sm font-medium text-primary">Here's an overview of your inventory system</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Track your assets, manage assignments, and monitor usage all in one place.
        </p>
      </div>
    </div>
  );
}
