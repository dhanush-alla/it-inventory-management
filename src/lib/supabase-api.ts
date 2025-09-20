import { supabase } from "@/integrations/supabase/client";
import { Asset, AssetAssignment, AssetStatus, Category, DashboardStats, Employee, MaintenanceLog, MaintenanceLogType, MaintenanceLogStatus } from "@/types";
import { 
  mapSupabaseAsset, 
  mapSupabaseCategory, 
  mapSupabaseEmployee,
  mapSupabaseAssetAssignment,
  toSupabaseAsset,
  toSupabaseCategory,
  toSupabaseEmployee,
  toSupabaseAssignment
} from "./supabase-mappers";
import { assetsByCategory, assetStatusCounts, userDevices } from './mock-data';

// Assets API
export const getAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .order('name');
  if (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
  return data.map(asset => mapSupabaseAsset(asset));
};

export const getAssetById = async (id: string): Promise<Asset | null> => {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error(`Error fetching asset with id ${id}:`, error);
    throw error;
  }
  
  return data ? mapSupabaseAsset(data) : null;
};

export const createAsset = async (asset: Partial<Asset>): Promise<Asset> => {
  const { data, error } = await supabase
    .from('devices')
    .insert(toSupabaseAsset(asset))
    .select()
    .single();
  
  if (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
  
  return mapSupabaseAsset(data);
};

export const updateAsset = async (id: string, asset: Partial<Asset>): Promise<Asset> => {
  const { data, error } = await supabase
    .from('devices')
    .update(toSupabaseAsset(asset))
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating asset with id ${id}:`, error);
    throw error;
  }
  
  return mapSupabaseAsset(data);
};

export const deleteAsset = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting asset with id ${id}:`, error);
    throw error;
  }
};

export const getAssetByBarcode = async (barcodeData: string): Promise<Asset | null> => {
  try {
    // Try with barcode_data column first
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .or(`barcode.eq.${barcodeData},barcode.eq.${barcodeData}`)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching asset with barcode ${barcodeData}:`, error);
      throw error;
    }
    
    if (data) {
      return mapSupabaseAsset(data);
    }
    
    return null;
  } catch (error) {
    console.error(`Error in getAssetByBarcode:`, error);
    return null;
  }
};

// Employees API
export const getEmployees = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, Name, name');
  if (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
  return data;
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    throw error;
  }
  
  return data ? mapSupabaseEmployee(data) : null;
};

export const createEmployee = async (employee: Partial<Employee>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert(toSupabaseEmployee(employee))
    .select()
    .single();
  
  if (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
  
  return mapSupabaseEmployee(data);
};

// Asset Assignments API
export const getAssetAssignments = async (): Promise<AssetAssignment[]> => {
  const { data, error } = await supabase
    .from('assignments')
    .select(`
      *,
      assets(*),
      employees(*)
    `)
    .order('assigned_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching asset assignments:', error);
    throw error;
  }
  
  return data.map(assignment => 
    mapSupabaseAssetAssignment(assignment, assignment.assets, assignment.employees)
  );
};

export const createAssetAssignment = async (assignment: Partial<AssetAssignment>): Promise<AssetAssignment> => {
  const { data, error } = await supabase
    .from('assignments')
    .insert(toSupabaseAssignment(assignment))
    .select()
    .single();
  
  if (error) {
    console.error('Error creating asset assignment:', error);
    throw error;
  }
  
  return mapSupabaseAssetAssignment(data);
};

export const returnAsset = async (assignmentId: string, returnDate: string): Promise<AssetAssignment> => {
  const { data, error } = await supabase
    .from('assignments')
    .update({ return_date: returnDate })
    .eq('id', assignmentId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error returning asset with assignment id ${assignmentId}:`, error);
    throw error;
  }
  
  return mapSupabaseAssetAssignment(data);
};

// Dashboard Stats
export const getDashboardStats = async (): Promise<DashboardStats & { totalAssetValue: number }> => {
  // Fetch all devices
  const { data: assets, error: assetsError } = await supabase
    .from('devices')
    .select('*');
  if (assetsError) throw assetsError;
  if (!assets || !Array.isArray(assets)) {
    return {
      totalAssets: 0,
      availableAssets: 0,
      assignedAssets: 0,
      maintenanceAssets: 0,
      retiredAssets: 0,
      assetsByCategory: [],
      recentAssignments: [],
      totalAssetValue: 0,
    };
  }

  // Count by status (defensive: handle missing status)
  const availableAssets = assets.filter(a => (a.status || '').toLowerCase() === 'available').length;
  const assignedAssets = assets.filter(a => (a.status || '').toLowerCase() === 'assigned').length;
  const maintenanceAssets = assets.filter(a => (a.status || '').toLowerCase() === 'maintenance').length;
  const retiredAssets = assets.filter(a => (a.status || '').toLowerCase() === 'retired').length;

  // Group by category (defensive: handle missing category)
  const categoryCount: Record<string, { categoryName: string; count: number }> = {};
  assets.forEach(asset => {
    const categoryName = asset.category || asset.category_id || 'Uncategorized';
    if (!categoryCount[categoryName]) {
      categoryCount[categoryName] = { categoryName: String(categoryName), count: 0 };
    }
    categoryCount[categoryName].count++;
  });
  const assetsByCategory = Object.values(categoryCount);

  // Sum asset_value
  const totalAssetValue = assets.reduce((sum, asset) => sum + (asset.asset_value || 0), 0);

  return {
    totalAssets: assets.length,
    availableAssets,
    assignedAssets,
    maintenanceAssets,
    retiredAssets,
    assetsByCategory,
    recentAssignments: [], // You can fill this with live data if needed
    totalAssetValue,
  };
};

// Update existing functions to use our new API
export const updateAssetScanner = async (barcodeData: string): Promise<Asset | null> => {
  try {
    return await getAssetByBarcode(barcodeData);
  } catch (error) {
    console.error('Error in updateAssetScanner:', error);
    return null;
  }
};

// Report API functions
export const getAssetStatusReport = async (): Promise<{ status: AssetStatus; count: number }[]> => {
  const { data: assets, error } = await supabase
    .from('devices')
    .select('status');
  
  if (error) {
    console.error('Error fetching asset status report:', error);
    throw error;
  }
  
  const statusCounts = {
    [AssetStatus.AVAILABLE]: 0,
    [AssetStatus.ASSIGNED]: 0,
    [AssetStatus.MAINTENANCE]: 0,
    [AssetStatus.RETIRED]: 0
  };
  
  assets.forEach(asset => {
    statusCounts[asset.status]++;
  });
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status as AssetStatus,
    count
  }));
};

export const getAssetsByCategory = async (): Promise<{ category: string; count: number }[]> => {
  const { data, error } = await supabase
    .from('devices')
    .select(`
      category_id,
      categories (
        name
      )
    `);
  
  if (error) {
    console.error('Error fetching assets by category:', error);
    throw error;
  }
  
  const categoryCount: Record<string, { category: string; count: number }> = {};
  
  data.forEach(asset => {
    const categoryName = asset.categories?.name || 'Uncategorized';
    if (!categoryCount[categoryName]) {
      categoryCount[categoryName] = { category: categoryName, count: 0 };
    }
    categoryCount[categoryName].count++;
  });
  
  return Object.values(categoryCount);
};

export const getAssetValueByCategory = async (): Promise<{ category: string; value: number }[]> => {
  const { data, error } = await supabase
    .from('devices')
    .select(`
      category_id,
      purchase_price,
      categories (
        name
      )
    `);
  
  if (error) {
    console.error('Error fetching asset values by category:', error);
    throw error;
  }
  
  const categoryValue: Record<string, { category: string; value: number }> = {};
  
  data.forEach(asset => {
    const categoryName = asset.categories?.name || 'Uncategorized';
    const price = Number(asset.purchase_price) || 0;
    
    if (!categoryValue[categoryName]) {
      categoryValue[categoryName] = { category: categoryName, value: 0 };
    }
    categoryValue[categoryName].value += price;
  });
  
  return Object.values(categoryValue);
};

export const getAssetAgeReport = async (): Promise<{ ageGroup: string; count: number }[]> => {
  const { data: assets, error } = await supabase
    .from('devices')
    .select('purchase_date');
  
  if (error) {
    console.error('Error fetching asset age report:', error);
    throw error;
  }
  
  const now = new Date();
  const ageGroups = {
    'Less than 1 year': 0,
    '1-2 years': 0,
    '2-3 years': 0,
    '3-5 years': 0,
    'Over 5 years': 0,
    'Unknown': 0
  };
  
  assets.forEach(asset => {
    if (!asset.purchase_date) {
      ageGroups['Unknown']++;
      return;
    }
    
    const purchaseDate = new Date(asset.purchase_date);
    const ageInYears = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    if (ageInYears < 1) ageGroups['Less than 1 year']++;
    else if (ageInYears < 2) ageGroups['1-2 years']++;
    else if (ageInYears < 3) ageGroups['2-3 years']++;
    else if (ageInYears < 5) ageGroups['3-5 years']++;
    else ageGroups['Over 5 years']++;
  });
  
  return Object.entries(ageGroups).map(([ageGroup, count]) => ({
    ageGroup,
    count
  }));
};

export const getAssignmentReport = async (): Promise<{ month: string; count: number }[]> => {
  const { data, error } = await supabase
    .from('assignments')
    .select('assigned_date');
  
  if (error) {
    console.error('Error fetching assignment report:', error);
    throw error;
  }
  
  const last12Months: Record<string, { month: string; count: number }> = {};
  
  // Initialize last 12 months
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthName = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    last12Months[monthKey] = { month: monthName, count: 0 };
  }
  
  // Count assignments by month
  data.forEach(assignment => {
    if (!assignment.assigned_date) return;
    
    const assignedDate = new Date(assignment.assigned_date);
    const monthKey = `${assignedDate.getFullYear()}-${String(assignedDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (last12Months[monthKey]) {
      last12Months[monthKey].count++;
    }
  });
  
  // Convert to array and reverse to get chronological order
  return Object.values(last12Months).reverse();
};

// Fetch devices assigned to the current user
export async function getUserDevices(userId: string) {
  const { data, error } = await supabase
    .from('assignments')
    .select('*, devices(*)')
    .eq('user_id', userId)
    .eq('status', 'Assigned');
  if (error) throw error;
  // Map to device objects
  return data.map((row: any) => ({
    ...row.devices,
    assignment_id: row.id,
    assigned_date: row.assigned_date,
    assignment_status: row.status,
  }));
}

// Assign a device to a user
export async function assignDeviceToUser(userId: string, deviceId: string) {
  const { data, error } = await supabase
    .from('assignments')
    .insert([{ user_id: userId, device_id: deviceId, status: 'Assigned' }]);
  if (error) throw error;
  return data;
}

// Unassign a device
export async function unassignDevice(assignmentId: string) {
  const { data, error } = await supabase
    .from('assignments')
    .update({ status: 'Unassigned' })
    .eq('id', assignmentId);
  if (error) throw error;
  return data;
}

// Utility: Seed default categories if not present
export async function seedDefaultCategories() {
  const defaultCategories = [
    { name: 'LAPTOPS' },
    { name: 'PRINTERS' },
    { name: 'DESKTOPS' },
    { name: 'SERVERS' },
    { name: 'NETWORK' },
    { name: 'MOBILE' },
    { name: 'TABLETS' },
    { name: 'MONITORS' },
    { name: 'ACCESSORIES' },
  ];
  for (const cat of defaultCategories) {
    await supabase.from('categories').upsert([cat], { onConflict: ['name'] });
  }
}

export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, Name');
  if (error) throw error;
  return data;
};

// Maintenance Logs API
export const createMaintenanceLog = async (maintenanceLog: Partial<MaintenanceLog>): Promise<MaintenanceLog> => {
  const { data, error } = await supabase
    .from('maintenance_logs')
    .insert({
      device_id: maintenanceLog.deviceId,
      user_id: maintenanceLog.userId,
      type: maintenanceLog.type,
      description: maintenanceLog.description,
      status: maintenanceLog.status || MaintenanceLogStatus.OPEN
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating maintenance log:', error);
    throw error;
  }
  
  return mapSupabaseMaintenanceLog(data);
};

export const getMaintenanceLogsByDevice = async (deviceId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('maintenance_logs_with_user')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching maintenance logs by device:', error);
    throw error;
  }

  return data;
};

export const getMaintenanceLogsByUser = async (userId: string): Promise<MaintenanceLog[]> => {
  const { data, error } = await supabase
    .from('maintenance_logs')
    .select(`
      *,
      devices(*),
      profiles(id, name, email, role)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching maintenance logs by user:', error);
    throw error;
  }
  
  return data.map(log => mapSupabaseMaintenanceLog(log, log.devices, log.profiles));
};

export const getAllMaintenanceLogs = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('maintenance_logs_with_user')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all maintenance logs:', error);
    throw error;
  }

  return data;
};

export const updateMaintenanceLogStatus = async (id: string, status: MaintenanceLogStatus): Promise<MaintenanceLog> => {
  const { data, error } = await supabase
    .from('maintenance_logs')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating maintenance log status:', error);
    throw error;
  }
  
  return mapSupabaseMaintenanceLog(data);
};

export const getMaintenanceLogById = async (id: string): Promise<MaintenanceLog | null> => {
  const { data, error } = await supabase
    .from('maintenance_logs')
    .select(`
      *,
      devices(*),
      profiles(id, name, email, role)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No rows returned
    }
    console.error('Error fetching maintenance log by id:', error);
    throw error;
  }
  
  return mapSupabaseMaintenanceLog(data, data.devices, data.profiles);
};

// Helper function to map Supabase maintenance log data to our interface
const mapSupabaseMaintenanceLog = (log: any, device?: any, user?: any): MaintenanceLog => {
  return {
    id: log.id,
    deviceId: log.device_id,
    userId: log.user_id,
    type: log.type as MaintenanceLogType,
    description: log.description,
    status: log.status as MaintenanceLogStatus,
    createdAt: log.created_at,
    updatedAt: log.updated_at,
    device: device ? mapSupabaseAsset(device) : undefined,
    user: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any
    } : undefined
  };
};
