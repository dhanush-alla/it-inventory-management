
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AssetStatusBadge from '@/components/assets/AssetStatusBadge';
import { DashboardStats } from '@/types';

interface RecentAssignmentsProps {
  stats: DashboardStats;
}

export function RecentAssignments({ stats }: RecentAssignmentsProps) {
  return (
    <Card className="card-hover-effect">
      <CardHeader>
        <CardTitle>Recent Asset Assignments</CardTitle>
        <CardDescription>
          The most recent asset assignments in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-1 md:grid-cols-5 text-sm">
            {/* Table Header */}
            <div className="hidden md:flex md:col-span-5 items-center border-b bg-muted/50 p-2.5 font-medium">
              <div className="md:col-span-1 w-full">Asset</div>
              <div className="md:col-span-1 w-full">Employee</div>
              <div className="md:col-span-1 w-full">Status</div>
              <div className="md:col-span-1 w-full">Date Assigned</div>
              <div className="md:col-span-1 w-full">Date Returned</div>
            </div>
            
            {/* Table Body */}
            {stats.recentAssignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="md:col-span-5 grid grid-cols-1 md:grid-cols-5 items-center border-b p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="md:col-span-1 flex flex-col md:flex-row gap-1 md:items-center">
                  <span className="font-medium md:hidden">Asset:</span>
                  <span>{assignment.asset?.name}</span>
                </div>
                
                <div className="md:col-span-1 flex flex-col md:flex-row gap-1 md:items-center">
                  <span className="font-medium md:hidden">Employee:</span>
                  <span>{assignment.employee?.name}</span>
                </div>
                
                <div className="md:col-span-1 flex flex-col md:flex-row gap-1 md:items-center">
                  <span className="font-medium md:hidden">Status:</span>
                  {assignment.asset && (
                    <AssetStatusBadge status={assignment.asset.status} />
                  )}
                </div>
                
                <div className="md:col-span-1 flex flex-col md:flex-row gap-1 md:items-center">
                  <span className="font-medium md:hidden">Date Assigned:</span>
                  <span>{format(new Date(assignment.assignedDate), 'MMM d, yyyy')}</span>
                </div>
                
                <div className="md:col-span-1 flex flex-col md:flex-row gap-1 md:items-center">
                  <span className="font-medium md:hidden">Date Returned:</span>
                  <span>
                    {assignment.returnDate 
                      ? format(new Date(assignment.returnDate), 'MMM d, yyyy')
                      : 'Not returned'
                    }
                  </span>
                </div>
              </div>
            ))}
            
            {stats.recentAssignments.length === 0 && (
              <div className="md:col-span-5 p-4 text-center text-muted-foreground">
                No recent assignments found
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
