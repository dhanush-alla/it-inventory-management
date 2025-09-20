import { Asset, AssetAssignment, AssetStatus, Category, Employee, User, UserRole } from "../types";

// Mock Users
export const users: User[] = [
  { 
    id: "user-1", 
    name: "John Doe", 
    email: "john.doe@example.com", 
    role: UserRole.MANAGER 
  },
  { 
    id: "user-2", 
    name: "Jane Smith", 
    email: "jane.smith@example.com", 
    role: UserRole.TECHNICIAN 
  }
];

// Mock Categories
export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Laptops",
    description: "All company laptops",
    createdAt: new Date(2023, 1, 15).toISOString(),
    updatedAt: new Date(2023, 1, 15).toISOString()
  },
  {
    id: "cat-2",
    name: "Monitors",
    description: "Computer displays",
    createdAt: new Date(2023, 1, 16).toISOString(),
    updatedAt: new Date(2023, 1, 16).toISOString()
  },
  {
    id: "cat-3",
    name: "Mobile Phones",
    description: "Company mobile devices",
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString()
  },
  {
    id: "cat-4",
    name: "Networking Equipment",
    description: "Routers, switches, and other networking hardware",
    createdAt: new Date(2023, 3, 5).toISOString(),
    updatedAt: new Date(2023, 3, 5).toISOString()
  },
  {
    id: "cat-5",
    name: "Software Licenses",
    description: "Software licenses and subscriptions",
    createdAt: new Date(2023, 3, 20).toISOString(),
    updatedAt: new Date(2023, 3, 20).toISOString()
  }
];

// Mock Assets
export const assets: Asset[] = [
  {
    id: "asset-1",
    name: "Dell XPS 13",
    description: "Developer laptop",
    categoryId: "cat-1",
    manufacturer: "Dell",
    model: "XPS 13 9310",
    serialNumber: "DELLXPS13001",
    purchaseDate: new Date(2022, 5, 10).toISOString(),
    purchasePrice: 1299.99,
    warrantyExpiry: new Date(2025, 5, 10).toISOString(),
    status: AssetStatus.ASSIGNED,
    notes: "Includes dock and charger",
    barcodeData: "ASSET-DELLXPS13001",
    createdAt: new Date(2022, 5, 12).toISOString(),
    updatedAt: new Date(2022, 5, 12).toISOString()
  },
  {
    id: "asset-2",
    name: "Dell UltraSharp 27",
    description: "27-inch 4K monitor",
    categoryId: "cat-2",
    manufacturer: "Dell",
    model: "U2720Q",
    serialNumber: "DELL27U001",
    purchaseDate: new Date(2022, 6, 15).toISOString(),
    purchasePrice: 499.99,
    warrantyExpiry: new Date(2025, 6, 15).toISOString(),
    status: AssetStatus.ASSIGNED,
    barcodeData: "ASSET-DELL27U001",
    createdAt: new Date(2022, 6, 16).toISOString(),
    updatedAt: new Date(2022, 6, 16).toISOString()
  },
  {
    id: "asset-3",
    name: "iPhone 13 Pro",
    description: "Company phone",
    categoryId: "cat-3",
    manufacturer: "Apple",
    model: "iPhone 13 Pro",
    serialNumber: "APPLEIPH13001",
    purchaseDate: new Date(2022, 9, 20).toISOString(),
    purchasePrice: 999.99,
    warrantyExpiry: new Date(2024, 9, 20).toISOString(),
    status: AssetStatus.ASSIGNED,
    barcodeData: "ASSET-APPLEIPH13001",
    createdAt: new Date(2022, 9, 22).toISOString(),
    updatedAt: new Date(2022, 9, 22).toISOString()
  },
  {
    id: "asset-4",
    name: "Cisco Switch",
    description: "48-port gigabit switch",
    categoryId: "cat-4",
    manufacturer: "Cisco",
    model: "Catalyst 3850",
    serialNumber: "CISCO3850001",
    purchaseDate: new Date(2021, 3, 5).toISOString(),
    purchasePrice: 2899.99,
    warrantyExpiry: new Date(2026, 3, 5).toISOString(),
    status: AssetStatus.AVAILABLE,
    barcodeData: "ASSET-CISCO3850001",
    createdAt: new Date(2021, 3, 6).toISOString(),
    updatedAt: new Date(2021, 3, 6).toISOString()
  },
  {
    id: "asset-5",
    name: "Microsoft Office 365",
    description: "Enterprise E3 License",
    categoryId: "cat-5",
    manufacturer: "Microsoft",
    model: "Office 365 E3",
    serialNumber: "MS365E3001",
    purchaseDate: new Date(2023, 1, 1).toISOString(),
    purchasePrice: 36.00,
    status: AssetStatus.AVAILABLE,
    barcodeData: "ASSET-MS365E3001",
    createdAt: new Date(2023, 1, 2).toISOString(),
    updatedAt: new Date(2023, 1, 2).toISOString()
  },
  {
    id: "asset-6",
    name: "MacBook Pro",
    description: "Design team laptop",
    categoryId: "cat-1",
    manufacturer: "Apple",
    model: "MacBook Pro 16",
    serialNumber: "APPLEMAC16001",
    purchaseDate: new Date(2022, 7, 15).toISOString(),
    purchasePrice: 2499.99,
    warrantyExpiry: new Date(2025, 7, 15).toISOString(),
    status: AssetStatus.MAINTENANCE,
    notes: "Screen repairs needed",
    barcodeData: "ASSET-APPLEMAC16001",
    createdAt: new Date(2022, 7, 16).toISOString(),
    updatedAt: new Date(2022, 7, 16).toISOString()
  },
  {
    id: "asset-7",
    name: "ThinkPad X1 Carbon",
    description: "Sales team laptop",
    categoryId: "cat-1",
    manufacturer: "Lenovo",
    model: "ThinkPad X1 Carbon Gen 9",
    serialNumber: "LENOVOX1001",
    purchaseDate: new Date(2022, 8, 5).toISOString(),
    purchasePrice: 1799.99,
    warrantyExpiry: new Date(2025, 8, 5).toISOString(),
    status: AssetStatus.RETIRED,
    notes: "Motherboard failure",
    barcodeData: "ASSET-LENOVOX1001",
    createdAt: new Date(2022, 8, 6).toISOString(),
    updatedAt: new Date(2022, 8, 6).toISOString()
  }
];

// Mock Employees
export const employees: Employee[] = [
  {
    id: "emp-1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    employeeId: "EMP001",
    department: "Engineering",
    phoneNumber: "555-0101",
    location: "Office 3A"
  },
  {
    id: "emp-2",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    employeeId: "EMP002",
    department: "Marketing",
    phoneNumber: "555-0102",
    location: "Office 2B"
  },
  {
    id: "emp-3",
    name: "Carol Martinez",
    email: "carol.martinez@example.com",
    employeeId: "EMP003",
    department: "Finance",
    phoneNumber: "555-0103",
    location: "Office 4C"
  }
];

// Mock Asset Assignments
export const assetAssignments: AssetAssignment[] = [
  {
    id: "assign-1",
    assetId: "asset-1",
    employeeId: "emp-1",
    assignedBy: "user-1",
    assignedDate: new Date(2023, 0, 15).toISOString(),
    notes: "Primary work laptop"
  },
  {
    id: "assign-2",
    assetId: "asset-2",
    employeeId: "emp-1",
    assignedBy: "user-1",
    assignedDate: new Date(2023, 0, 15).toISOString(),
    notes: "Monitor for development work"
  },
  {
    id: "assign-3",
    assetId: "asset-3",
    employeeId: "emp-2",
    assignedBy: "user-2",
    assignedDate: new Date(2023, 1, 10).toISOString(),
    notes: "Marketing team mobile phone"
  }
];

// Helper function to get an asset with its category details
export const getAssetWithCategory = (assetId: string): Asset | undefined => {
  const asset = assets.find(a => a.id === assetId);
  if (!asset) return undefined;
  
  const category = categories.find(c => c.id === asset.categoryId);
  return {
    ...asset,
    category
  };
};

// Helper function to get an assignment with expanded details
export const getAssignmentWithDetails = (assignmentId: string): AssetAssignment | undefined => {
  const assignment = assetAssignments.find(a => a.id === assignmentId);
  if (!assignment) return undefined;
  
  const asset = getAssetWithCategory(assignment.assetId);
  const employee = employees.find(e => e.id === assignment.employeeId);
  
  return {
    ...assignment,
    asset,
    employee
  };
};

// Mock Dashboard Statistics
export const getDashboardStats = () => {
  const totalAssets = assets.length;
  const availableAssets = assets.filter(a => a.status === AssetStatus.AVAILABLE).length;
  const assignedAssets = assets.filter(a => a.status === AssetStatus.ASSIGNED).length;
  const maintenanceAssets = assets.filter(a => a.status === AssetStatus.MAINTENANCE).length;
  const retiredAssets = assets.filter(a => a.status === AssetStatus.RETIRED).length;
  
  // Calculate assets by category
  const assetsByCategory = categories.map(category => {
    const count = assets.filter(asset => asset.categoryId === category.id).length;
    return {
      categoryName: category.name,
      count
    };
  });
  
  // Get recent assignments
  const recentAssignments = assetAssignments
    .sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime())
    .slice(0, 5)
    .map(assignment => {
      const asset = assets.find(a => a.id === assignment.assetId);
      const employee = employees.find(e => e.id === assignment.employeeId);
      return {
        ...assignment,
        asset,
        employee
      };
    });
  
  return {
    totalAssets,
    availableAssets,
    assignedAssets,
    maintenanceAssets,
    retiredAssets,
    assetsByCategory,
    recentAssignments
  };
};

// Dummy user devices (should match UserAssetsSection)
export const userDevices = [
  {
    id: 'dev-001',
    name: 'Dell Latitude 5420',
    category: 'Laptops',
    manufactured: '2022-03-15',
    status: 'Assigned',
    maintenanceCost: 12000,
    details: 'Intel i7, 16GB RAM, 512GB SSD',
  },
  {
    id: 'dev-002',
    name: 'iPhone 13',
    category: 'Mobile',
    manufactured: '2021-09-20',
    status: 'Assigned',
    maintenanceCost: 8000,
    details: '128GB, Blue',
  },
  {
    id: 'dev-003',
    name: 'HP LaserJet Pro',
    category: 'Printers',
    manufactured: '2020-11-05',
    status: 'Assigned',
    maintenanceCost: 4500,
    details: 'Wireless, Duplex Printing',
  },
];

// Assets by category (user-specific)
export const assetsByCategory = [
  { categoryName: 'Laptops', count: userDevices.filter(d => d.category === 'Laptops').length },
  { categoryName: 'Mobile', count: userDevices.filter(d => d.category === 'Mobile').length },
  { categoryName: 'Printers', count: userDevices.filter(d => d.category === 'Printers').length },
];

// Asset status (user-specific)
export const assetStatusCounts = {
  availableAssets: userDevices.filter(d => d.status === 'Available').length,
  assignedAssets: userDevices.filter(d => d.status === 'Assigned').length,
  maintenanceAssets: userDevices.filter(d => d.status === 'Maintenance').length,
  retiredAssets: userDevices.filter(d => d.status === 'Retired').length,
};
