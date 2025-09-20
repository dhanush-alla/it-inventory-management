
import { Badge } from "@/components/ui/badge";
import { AssetStatus } from "@/types";
import { cn } from "@/lib/utils";

interface AssetStatusBadgeProps {
  status: AssetStatus;
  className?: string;
}

export function AssetStatusBadge({ status, className }: AssetStatusBadgeProps) {
  let variant: "default" | "destructive" | "outline" | "secondary" | null = null;
  
  switch (status) {
    case AssetStatus.AVAILABLE:
      variant = "secondary";
      break;
    case AssetStatus.ASSIGNED:
      variant = "default";
      break;
    case AssetStatus.MAINTENANCE:
      variant = "outline";
      break;
    case AssetStatus.RETIRED:
      variant = "destructive";
      break;
  }
  
  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      {status.toLowerCase()}
    </Badge>
  );
}

export default AssetStatusBadge;
