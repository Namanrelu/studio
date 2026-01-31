import { getGoogleSheetData } from '@/lib/google-sheets';
import {
  NewProjectSubmission,
  ProjectApprovalSubmission,
  ProjectDeliverySubmission,
  ProjectEstimationSubmission,
  ProjectFeedbackSubmission,
  VersionUpgradeSubmission,
} from '@/lib/types';
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

type DatabaseRow = {
  projectId: string;
  newProject?: NewProjectSubmission;
  versionUpgrade?: VersionUpgradeSubmission;
  estimation?: ProjectEstimationSubmission;
  approval?: ProjectApprovalSubmission;
  delivery?: ProjectDeliverySubmission;
  feedback?: ProjectFeedbackSubmission;
};

function formatDate(value?: string) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, 'MMM dd, yyyy HH:mm');
}

function buildDatabaseRows(data: Awaited<ReturnType<typeof getGoogleSheetData>>): DatabaseRow[] {
  const projectMap = new Map<string, DatabaseRow>();

  const ensureRow = (projectId: string) => {
    const existing = projectMap.get(projectId);
    if (existing) return existing;
    const row = { projectId };
    projectMap.set(projectId, row);
    return row;
  };

  data.newProjectSubmissions.forEach(submission => {
    const row = ensureRow(submission.projectId);
    row.newProject = submission;
  });

  data.versionUpgradeSubmissions.forEach(submission => {
    const row = ensureRow(submission.projectId);
    row.versionUpgrade = submission;
  });

  data.projectEstimationSubmissions.forEach(submission => {
    const row = ensureRow(submission.projectId);
    row.estimation = submission;
  });

  data.projectApprovalSubmissions.forEach(submission => {
    const row = ensureRow(submission.projectId);
    row.approval = submission;
  });

  data.projectDeliverySubmissions.forEach(submission => {
    const row = ensureRow(submission.projectId);
    row.delivery = submission;
  });

  data.projectFeedbackSubmissions.forEach(submission => {
    const row = ensureRow(submission.projectId);
    row.feedback = submission;
  });

  return Array.from(projectMap.values());
}

export default async function DatabasePage() {
  const googleSheetData = await getGoogleSheetData();
  const databaseRows = buildDatabaseRows(googleSheetData);

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Project Database</CardTitle>
          <CardDescription>
            A consolidated view of each project across the selected subsheets. Duplicate entries are removed by using the most recent submission per project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project ID</TableHead>
                <TableHead>New Project Timestamp</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Company Type</TableHead>
                <TableHead>Project Description</TableHead>
                <TableHead>Client Message</TableHead>
                <TableHead>Client Country</TableHead>
                <TableHead>Client Timezone</TableHead>
                <TableHead>Communication Platforms</TableHead>
                <TableHead>Business Manager</TableHead>
                <TableHead>Internal Instructions</TableHead>
                <TableHead>Attachments</TableHead>
                <TableHead>GDrive Folder Link</TableHead>
                <TableHead>Version Upgrade Timestamp</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>New Requirements</TableHead>
                <TableHead>Estimation Timestamp</TableHead>
                <TableHead>Estimated Hours</TableHead>
                <TableHead>Estimated Cost</TableHead>
                <TableHead>Approval Timestamp</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Approval Date</TableHead>
                <TableHead>Expected Delivery Date</TableHead>
                <TableHead>Delivery Method</TableHead>
                <TableHead>Delivery Timestamp</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Delivered By</TableHead>
                <TableHead>Delivery Notes</TableHead>
                <TableHead>Feedback Timestamp</TableHead>
                <TableHead>Satisfaction Score</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Client Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {databaseRows
                .sort((a, b) => {
                  const aTime = a.newProject?.timestamp || a.versionUpgrade?.timestamp || '';
                  const bTime = b.newProject?.timestamp || b.versionUpgrade?.timestamp || '';
                  return new Date(bTime).getTime() - new Date(aTime).getTime();
                })
                .map(row => (
                  <TableRow key={row.projectId}>
                    <TableCell className="font-medium">{row.projectId}</TableCell>
                    <TableCell>{formatDate(row.newProject?.timestamp)}</TableCell>
                    <TableCell>{row.newProject?.projectName || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.clientName || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.emailAddress || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.companyName || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.companyType || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.projectDescription || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.clientMessage || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.clientCountry || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.clientTimezone || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.communicationPlatforms || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.businessManager || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.internalInstructions || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.attachments || 'N/A'}</TableCell>
                    <TableCell>{row.newProject?.gdriveFolderLink || 'N/A'}</TableCell>
                    <TableCell>{formatDate(row.versionUpgrade?.timestamp)}</TableCell>
                    <TableCell>{row.versionUpgrade?.version || 'N/A'}</TableCell>
                    <TableCell>{row.versionUpgrade?.newRequirements || 'N/A'}</TableCell>
                    <TableCell>{formatDate(row.estimation?.timestamp)}</TableCell>
                    <TableCell>{row.estimation?.estimatedHours ?? 'N/A'}</TableCell>
                    <TableCell>{row.estimation?.estimatedCost ?? 'N/A'}</TableCell>
                    <TableCell>{formatDate(row.approval?.timestamp)}</TableCell>
                    <TableCell>{row.approval?.approvedBy || 'N/A'}</TableCell>
                    <TableCell>{formatDate(row.approval?.approvalDate)}</TableCell>
                    <TableCell>{formatDate(row.approval?.expectedDeliveryDate)}</TableCell>
                    <TableCell>{row.approval?.deliveryMethod || 'N/A'}</TableCell>
                    <TableCell>{formatDate(row.delivery?.timestamp)}</TableCell>
                    <TableCell>{formatDate(row.delivery?.deliveryDate)}</TableCell>
                    <TableCell>{row.delivery?.deliveredBy || 'N/A'}</TableCell>
                    <TableCell>{row.delivery?.notes || 'N/A'}</TableCell>
                    <TableCell>{formatDate(row.feedback?.timestamp)}</TableCell>
                    <TableCell>{row.feedback?.satisfactionScore ?? 'N/A'}</TableCell>
                    <TableCell>{row.feedback?.feedback || 'N/A'}</TableCell>
                    <TableCell>{row.feedback?.clientContact || 'N/A'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
