import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Asset } from "@/types";
import { AssetStatusBadge } from './AssetStatusBadge';
import { CalendarIcon, CpuIcon } from "lucide-react";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AssetCardProps {
  asset: Asset;
  className?: string;
}

export function AssetCard({ asset, className }: AssetCardProps) {
  const category = asset.category || 'Unknown Category';
  
  const manufacturedDate = asset.manufactured && !isNaN(Date.parse(asset.manufactured))
    ? format(new Date(asset.manufactured), 'yyyy-MM-dd')
    : 'N/A';

  return (
    <Link to={`/assets/${asset.id}`}>
      <Card className={cn("h-full overflow-hidden transition-all card-hover-effect", className)}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base">{asset.name}</CardTitle>
            <AssetStatusBadge status={asset.status} />
          </div>
        </CardHeader>
        <CardContent className="pb-2 text-sm">
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <CpuIcon className="mr-1 h-3.5 w-3.5" />
              <span>{category}</span>
            </div>
            <p className="text-muted-foreground">
              {asset.manufacturer} {asset.model}
            </p>
            <p className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="mr-1 h-3 w-3" />
              <span>Manufactured: {manufacturedDate}</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground border-t pt-3">
          {asset.assetExpenditure ? `Expenditure: ₹${asset.assetExpenditure}` : ''}
        </CardFooter>
      </Card>
    </Link>
  );
}

export default AssetCard;
