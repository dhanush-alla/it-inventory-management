// User and authentication types
export enum UserRole {
  MANAGER = "MANAGER",
  TECHNICIAN = "TECHNICIAN"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Asset related types
export enum AssetStatus {
  AVAILABLE = "AVAILABLE",
  ASSIGNED = "ASSIGNED",
  MAINTENANCE = "MAINTENANCE",
  RETIRED = "RETIRED"
}

// Maintenance log types
export enum MaintenanceLogType {
  MAINTENANCE = "maintenance",
  MALFUNCTION = "malfunction",
  MISC = "misc"
}

export enum MaintenanceLogStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed"
}

export interface MaintenanceLog {
  id: string;
  deviceId: string;
  userId: string;
  type: MaintenanceLogType;
  description?: string;
  status: MaintenanceLogStatus;
  createdAt: string;
  updatedAt: string;
  // Optional joined data
  device?: Asset;
  user?: User;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  model: string;
  manufactured: string;
  assetExpenditure?: number;
  warrantyExpiry?: string;
  status: AssetStatus;
  notes?: string;
  barcodeData: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  phoneNumber?: string;
  location?: string;
}

export interface AssetAssignment {
  id: string;
  assetId: string;
  asset?: Asset;
  employeeId: string;
  employee?: Employee;
  assignedBy: string;
  assignedDate: string;
  returnDate?: string;
  notes?: string;
}

export interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  maintenanceAssets: number;
  retiredAssets: number;
  assetsByCategory: {
    categoryName: string;
    count: number;
  }[];
  recentAssignments: AssetAssignment[];
}
