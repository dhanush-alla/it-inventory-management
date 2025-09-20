import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ReportFilters: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    minValue: '',
    maxValue: '',
    includeRetired: false
  });

  const handleFilterChange = (
    field: keyof typeof filters, 
    value: string | boolean
  ) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      status: '',
      minValue: '',
      maxValue: '',
      includeRetired: false
    });
    setFromDate(undefined);
    setToDate(undefined);
  };

  const handleApplyFilters = () => {
    // Here we would typically make API calls with the filter values
    console.log('Applied filters:', { ...filters, fromDate, toDate });
    // This is just a mock-up for UI demonstration
  };

  return (
    <Card className="w-full">
      <CardContent className={cn("pt-6", !isExpanded && "pb-0")}>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assets or categories..."
              className="pl-8 max-w-lg"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:w-auto w-full flex items-center gap-2"
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            {isExpanded ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-4 py-2">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="laptops">Laptops</SelectItem>
                    <SelectItem value="phones">Phones</SelectItem>
                    <SelectItem value="monitors">Monitors</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="ASSIGNED">Assigned</SelectItem>
                    <SelectItem value="MAINTENANCE">In Maintenance</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>From Date</Label>
                <DatePicker
                  date={fromDate}
                  setDate={setFromDate}
                  placeholder="Select start date"
                />
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <DatePicker
                  date={toDate}
                  setDate={setToDate}
                  placeholder="Select end date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minValue">Min Value ($)</Label>
                <Input
                  id="minValue"
                  type="number"
                  placeholder="0"
                  value={filters.minValue}
                  onChange={(e) => handleFilterChange('minValue', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxValue">Max Value ($)</Label>
                <Input
                  id="maxValue"
                  type="number"
                  placeholder="5000"
                  value={filters.maxValue}
                  onChange={(e) => handleFilterChange('maxValue', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                checked={filters.includeRetired}
                onCheckedChange={(checked) => handleFilterChange('includeRetired', checked)}
                id="include-retired"
              />
              <Label htmlFor="include-retired">Include retired assets</Label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
              <Button onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportFilters; 