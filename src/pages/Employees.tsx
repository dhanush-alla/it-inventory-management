import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '@/lib/supabase-api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Employees = () => {
  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error loading employees</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>A list of all employees in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map(emp => (
                <TableRow key={emp.id}>
                  <TableCell className="font-mono text-xs">{emp.id}</TableCell>
                  <TableCell className="font-medium">{emp.Name}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees; 