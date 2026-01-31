import { getGoogleSheetData } from '@/lib/google-sheets';
import { NewProjectSubmission } from '@/lib/types';
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
import { format } from 'date-fns';

function getUniqueProjects(projects: NewProjectSubmission[]): NewProjectSubmission[] {
  const projectMap = new Map<string, NewProjectSubmission>();
  projects.forEach(project => {
    if (project.projectId) {
      const existing = projectMap.get(project.projectId);
      if (!existing || new Date(project.timestamp) > new Date(existing.timestamp)) {
        projectMap.set(project.projectId, project);
      }
    }
  });
  return Array.from(projectMap.values());
}

export default async function DatabasePage() {
  const googleSheetData = await getGoogleSheetData();
  const uniqueProjects = getUniqueProjects(googleSheetData.newProjectSubmissions);

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Project Database</CardTitle>
          <CardDescription>
            A list of all unique projects from the Google Sheet. Duplicates are handled by showing the most recent entry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project ID</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Business Manager</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueProjects.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(project => (
                <TableRow key={project.projectId}>
                  <TableCell className="font-medium">{project.projectId}</TableCell>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{project.clientName}</TableCell>
                  <TableCell>
                    {project.timestamp ? format(new Date(project.timestamp), 'MMM dd, yyyy HH:mm') : 'N/A'}
                  </TableCell>
                  <TableCell>{project.businessManager}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
