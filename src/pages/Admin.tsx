import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, UserCog } from "lucide-react";

type Profile = {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
  email?: string;
};

const Admin = () => {
  const { isManager } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Redirect non-manager users
  if (!isManager) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
        // Get all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (profilesError) {
          throw profilesError;
        }
        
        // Get user emails from auth.users (need to be an admin/service_role to do this)
        // In a real app, you'd use a Supabase function with service_role to do this
        
        setProfiles(profilesData || []);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Error",
          description: "Failed to load user profiles",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, [toast]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      // Update the local state
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === userId ? { ...profile, role: newRole } : profile
        )
      );
      
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button variant="outline" size="icon">
          <UserCog className="h-5 w-5" />
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Profiles</CardTitle>
          <CardDescription>
            All registered users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : profiles.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No user profiles found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        profile.role === UserRole.MANAGER 
                          ? 'bg-green-100 text-green-800'
                          : profile.role === UserRole.TECHNICIAN
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {profile.role}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(profile.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {profile.role !== UserRole.MANAGER && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRoleChange(profile.id, UserRole.MANAGER)}
                          >
                            Make Manager
                          </Button>
                        )}
                        {profile.role !== UserRole.TECHNICIAN && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRoleChange(profile.id, UserRole.TECHNICIAN)}
                          >
                            Make Technician
                          </Button>
                        )}
                        {profile.role !== UserRole.EMPLOYEE && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRoleChange(profile.id, UserRole.EMPLOYEE)}
                          >
                            Make Employee
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin; 