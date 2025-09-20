import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('id, Name, name, role')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id
  });

  if (!user) return null;
  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!profile) return <div className="p-8 text-center text-red-600">Profile not found</div>;

  const displayName = profile?.Name || 'Unknown';
  const displayEmail = profile?.name || 'Unknown';
  const displayRole = profile?.role ? profile.role.charAt(0) + profile.role.slice(1).toLowerCase() : 'User';

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-4xl text-primary font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <CardTitle>{displayName}</CardTitle>
            <CardDescription>{displayEmail}</CardDescription>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {displayRole}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Additional profile details or actions can go here */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 