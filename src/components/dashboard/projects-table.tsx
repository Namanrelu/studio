import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CombinedProjectData } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type ProjectsTableProps = {
  data: CombinedProjectData[];
};

const statusColors: Record<CombinedProjectData['status'], string> = {
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Delayed': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'On Hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Planning': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  'Approved': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
};

export function ProjectsTable({ data }: ProjectsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">All Projects</CardTitle>
        <CardDescription>A list of all current and past projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Expected Delivery</TableHead>
              <TableHead className="text-right">Actual Delivery</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(project => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('border-transparent', statusColors[project.status])}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell className="text-right">
                  {project.expectedDelivery ? format(project.expectedDelivery, 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  {project.actualDelivery ? format(project.actualDelivery, 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
