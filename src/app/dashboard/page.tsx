import { SubmissionsAnalysis } from '@/components/dashboard/submissions-analysis';
import { getGoogleSheetData } from '@/lib/google-sheets';
import { NewProjectSubmission } from '@/lib/types';

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


export default async function DashboardPage() {
  const googleSheetData = await getGoogleSheetData();
  const uniqueProjects = getUniqueProjects(googleSheetData.newProjectSubmissions);

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <SubmissionsAnalysis projects={uniqueProjects} />
    </main>
  );
}
