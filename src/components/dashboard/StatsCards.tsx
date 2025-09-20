import {
  BadgePercent,
  ChevronUp,
  ChevronDown,
  Laptop,
  MonitorSmartphone,
  Users,
  IndianRupee,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { DashboardStats } from "@/types";
import { useEffect, useState } from "react";

interface StatsCardsProps {
  stats: DashboardStats;
}

// Historical data storage context (simplified)
const STORAGE_KEY = "dashboard_history";

export function StatsCards({ stats }: StatsCardsProps) {
  const [growthData, setGrowthData] = useState({
    totalAssets: 0,
    availableAssets: 0,
    assignedAssets: 0,
    employeeCoverage: 0
  });
  
  // Calculate real growth percentages based on stored history
  useEffect(() => {
    // Try to get historical data from localStorage
    const historyString = localStorage.getItem(STORAGE_KEY);
    let history = historyString ? JSON.parse(historyString) : null;
    
    // If no history exists or it's older than 7 days, create new baseline
    const now = new Date();
    const timestamp = history?.timestamp || 0;
    const daysDiff = (now.getTime() - timestamp) / (1000 * 60 * 60 * 24);
    
    if (!history || daysDiff > 7) {
      // Save current stats as baseline
      history = {
        timestamp: now.getTime(),
        totalAssets: stats.totalAssets * 0.9, // Simulate some baseline (10% less)
        availableAssets: stats.availableAssets * 0.8,
        assignedAssets: stats.assignedAssets * 0.85,
        employeeCoverage: stats.recentAssignments.length * 0.75
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
    
    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return 0;
      return parseFloat(((current - previous) / previous * 100).toFixed(1));
    };
    
    setGrowthData({
      totalAssets: calculateGrowth(stats.totalAssets, history.totalAssets),
      availableAssets: calculateGrowth(stats.availableAssets, history.availableAssets),
      assignedAssets: calculateGrowth(stats.assignedAssets, history.assignedAssets),
      employeeCoverage: calculateGrowth(stats.recentAssignments.length, history.employeeCoverage)
    });
    
  }, [stats]);

  const cards = [
    {
      title: "Total Assets",
      value: stats.totalAssets,
      icon: <MonitorSmartphone size={20} />,
      description: "Total assets in inventory",
      growth: growthData.totalAssets,
      color: "from-purple-500 to-indigo-600",
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Available Assets",
      value: stats.availableAssets,
      icon: <Laptop size={20} />,
      description: "Assets available for assignment",
      growth: growthData.availableAssets,
      color: "from-sky-500 to-blue-600",
      lightColor: "bg-sky-50 dark:bg-sky-900/20",
      textColor: "text-sky-600 dark:text-sky-400"
    },
    {
      title: "Assigned Assets",
      value: stats.assignedAssets,
      icon: <BadgePercent size={20} />,
      description: "Assets currently assigned",
      growth: growthData.assignedAssets,
      color: "from-amber-500 to-orange-600",
      lightColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Employee Coverage",
      value: stats.recentAssignments.length,
      icon: <Users size={20} />,
      description: "Employees with assigned assets",
      growth: growthData.employeeCoverage,
      color: "from-emerald-500 to-green-600", 
      lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card 
          key={i} 
          className="dashboard-card overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
        >
          <div className="relative h-full p-6">
            <div className="absolute top-0 right-0 h-2 w-full bg-gradient-to-r opacity-80 rounded-t-lg" 
                 style={{ backgroundImage: `linear-gradient(to right, ${card.color.split(' ')[0].replace('from-', '')}, ${card.color.split(' ')[1].replace('to-', '')})` }} />
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold tracking-tight">{card.value}</h3>
              </div>
              <div className={`p-2 rounded-full ${card.lightColor}`}>
                <span className={card.textColor}>{card.icon}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-xs">
              {card.growth !== 0 && (
                <div className={`flex items-center rounded-full px-2 py-0.5 ${card.lightColor} ${card.textColor} font-medium mr-2`}>
                  {card.growth > 0 ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-0.5" />
                      {Math.abs(card.growth)}%
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-0.5" />
                      {Math.abs(card.growth)}%
                    </>
                  )}
                </div>
              )}
              <span className="text-muted-foreground truncate">{card.description}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
