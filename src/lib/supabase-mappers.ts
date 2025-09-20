import { Asset, AssetAssignment, AssetStatus, Category, Employee } from "@/types";

// Type mappers to convert between Supabase types and our application types
export const mapSupabaseCategory = (category: any): Category => {
  return {
    id: category.id,
    name: category.name,
    description: category.description || "",
    createdAt: category.created_at,
    updatedAt: category.updated_at
  };
};

export const mapSupabaseAsset = (device: any): Asset => {
  return {
    id: device.id,
    name: device.name,
    description: device.details || device.description || '',
    category: device.category || '',
    manufacturer: device.manufacturer || '',
    model: device.model || '',
    manufactured: device.manufactured || new Date().toISOString(),
    assetExpenditure: device.asset_expenditure || 0,
    status: device.status as AssetStatus,
    barcodeData: device.barcode || '',
    createdAt: device.created_at,
    updatedAt: device.updated_at,
    warrantyExpiry: undefined
  };
};

export const mapSupabaseEmployee = (employee: any): Employee => {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    employeeId: employee.employee_id || "",
    department: employee.department || "",
    phoneNumber: employee.phone,
    location: employee.location
  };
};

export const mapSupabaseAssetAssignment = (
  assignment: any, 
  asset?: any,
  employee?: any
): AssetAssignment => {
  return {
    id: assignment.id,
    assetId: assignment.asset_id,
    asset: asset ? mapSupabaseAsset(asset) : undefined,
    employeeId: assignment.employee_id,
    employee: employee ? mapSupabaseEmployee(employee) : undefined,
    assignedBy: assignment.assigned_by || "",
    assignedDate: assignment.assigned_date,
    returnDate: assignment.return_date,
    notes: assignment.notes
  };
};

// Functions to convert our application types to Supabase format
export const toSupabaseAsset = (asset: Partial<Asset>) => {
  return {
    name: asset.name,
    details: asset.description,
    category: asset.category,
    manufacturer: asset.manufacturer,
    model: asset.model,
    manufactured: asset.manufactured,
    asset_expenditure: asset.assetExpenditure,
    status: asset.status,
    barcode: asset.barcodeData
  };
};

export const toSupabaseCategory = (category: Partial<Category>) => {
  return {
    name: category.name,
    description: category.description
  };
};

export const toSupabaseEmployee = (employee: Partial<Employee>) => {
  return {
    name: employee.name,
    email: employee.email,
    employee_id: employee.employeeId,
    department: employee.department,
    phone: employee.phoneNumber,
    location: employee.location
  };
};

export const toSupabaseAssignment = (assignment: Partial<AssetAssignment>) => {
  return {
    asset_id: assignment.assetId,
    employee_id: assignment.employeeId,
    assigned_by: assignment.assignedBy,
    assigned_date: assignment.assignedDate,
    return_date: assignment.returnDate,
    notes: assignment.notes
  };
};
