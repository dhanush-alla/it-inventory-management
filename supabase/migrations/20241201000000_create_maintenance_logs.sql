-- Create maintenance_logs table for storing asset maintenance tickets
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('maintenance', 'malfunction', 'misc')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for maintenance_logs table
-- Users can only create tickets for devices assigned to them
CREATE POLICY "Users can create tickets for their assigned devices" ON maintenance_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM assignments 
      WHERE assignments.device_id = maintenance_logs.device_id 
      AND assignments.user_id = auth.uid()
      AND assignments.return_date IS NULL
    )
  );

-- Users can view tickets for devices assigned to them
CREATE POLICY "Users can view tickets for their assigned devices" ON maintenance_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assignments 
      WHERE assignments.device_id = maintenance_logs.device_id 
      AND assignments.user_id = auth.uid()
      AND assignments.return_date IS NULL
    )
  );

-- Managers can view all tickets
CREATE POLICY "Managers can view all tickets" ON maintenance_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'MANAGER'
    )
  );

-- Managers can update all tickets
CREATE POLICY "Managers can update all tickets" ON maintenance_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'MANAGER'
    )
  );

-- Users can update their own tickets
CREATE POLICY "Users can update their own tickets" ON maintenance_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_maintenance_logs_device_id ON maintenance_logs(device_id);
CREATE INDEX idx_maintenance_logs_user_id ON maintenance_logs(user_id);
CREATE INDEX idx_maintenance_logs_created_at ON maintenance_logs(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_maintenance_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_maintenance_logs_updated_at
  BEFORE UPDATE ON maintenance_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_maintenance_logs_updated_at(); 