import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Asset, AssetStatus } from '@/types';
import AssetCard from '@/components/assets/AssetCard';
import { Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { useQuery } from '@tanstack/react-query';
import { getAssets } from '@/lib/supabase-api';

const Assets = () => {
  const { isManager } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const location = useLocation();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  
  // Handle URL search params and sync with global search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    
    if (searchParam) {
      setSearchQuery(searchParam);
      setLocalSearchQuery(searchParam);
    } else if (searchQuery) {
      // If there's a global search query but no URL param, sync with local state
      setLocalSearchQuery(searchQuery);
    }
  }, [location.search, searchQuery, setSearchQuery]);
  
  // Update local search when typing in the asset search box
  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
    setSearchQuery(e.target.value);
  };
  
  const { data: assets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets
  });

  // Filter assets based on search query and filters
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      (asset.serialNumber && asset.serialNumber.toLowerCase().includes(localSearchQuery.toLowerCase())) ||
      (asset.model && asset.model.toLowerCase().includes(localSearchQuery.toLowerCase())) ||
      (asset.manufacturer && asset.manufacturer.toLowerCase().includes(localSearchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || asset.categoryId === categoryFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const isLoading = assetsLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">
            Manage your inventory assets
          </p>
        </div>
        
        {isManager && (
          <Button asChild>
            <Link to="/assets/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Link>
          </Button>
        )}
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter and search assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search input */}
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={localSearchQuery}
                onChange={handleLocalSearchChange}
              />
            </div>
            
            {/* Category filter */}
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="LAPTOP">Laptop</SelectItem>
                  <SelectItem value="DESKTOP">Desktop</SelectItem>
                  <SelectItem value="PRINTER">Printer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Status filter */}
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(AssetStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAssets.length} {filteredAssets.length === 1 ? 'asset' : 'assets'}
        </p>
        
        {(filteredAssets.length === 0 && (localSearchQuery || categoryFilter !== 'all' || statusFilter !== 'all')) && (
          <Button variant="link" onClick={() => {
            setLocalSearchQuery('');
            setSearchQuery('');
            setCategoryFilter('all');
            setStatusFilter('all');
          }}>
            Clear Filters
          </Button>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard 
              key={asset.id}
              asset={asset}
              className={cn(
                asset.status === AssetStatus.MAINTENANCE && "border-orange-300",
                asset.status === AssetStatus.RETIRED && "border-destructive/40"
              )}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-muted/40">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-background p-3 mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No assets found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {localSearchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? "Try adjusting your filters"
                : "Start by adding your first asset"
              }
            </p>
            {isManager && (
              <Button asChild>
                <Link to="/assets/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Asset
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Assets;
