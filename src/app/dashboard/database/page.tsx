import { getGoogleSheetData } from '@/lib/google-sheets';
import { buildDatabaseRows } from '@/lib/project-utils';
import { createCsv } from '@/lib/csv';
import { DatabaseExport } from '@/components/dashboard/database-export';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function DatabasePage() {
  const googleSheetData = await getGoogleSheetData();
  const databaseRows = buildDatabaseRows(googleSheetData);
  const csvHeaders = [
    'Project ID',
    'New Project Timestamp',
    'Project Name',
    'Client Name',
    'Email',
    'Company Name',
    'Company Type',
    'Project Description',
    'Client Message',
    'Client Country',
    'Client Timezone',
    'Communication Platforms',
    'Business Manager',
    'Internal Instructions',
    'Attachments',
    'GDrive Folder Link',
    'Version Upgrade Timestamp',
    'Version',
    'New Requirements',
    'Estimation Timestamp',
    'Estimated Hours',
    'Estimated Cost',
    'Approval Timestamp',
    'Approved By',
    'Approval Date',
    'Expected Delivery Date',
    'Delivery Method',
    'Delivery Timestamp',
    'Delivery Date',
    'Delivered By',
    'Delivery Notes',
    'Feedback Timestamp',
    'Satisfaction Score',
    'Feedback',
    'Client Contact',
  ];

  const csvRows = databaseRows.map(row => ({
    'Project ID': row.projectId,
    'New Project Timestamp': row.newProject?.timestamp ?? '',
    'Project Name': row.newProject?.projectName ?? '',
    'Client Name': row.newProject?.clientName ?? '',
    'Email': row.newProject?.emailAddress ?? '',
    'Company Name': row.newProject?.companyName ?? '',
    'Company Type': row.newProject?.companyType ?? '',
    'Project Description': row.newProject?.projectDescription ?? '',
    'Client Message': row.newProject?.clientMessage ?? '',
    'Client Country': row.newProject?.clientCountry ?? '',
    'Client Timezone': row.newProject?.clientTimezone ?? '',
    'Communication Platforms': row.newProject?.communicationPlatforms ?? '',
    'Business Manager': row.newProject?.businessManager ?? '',
    'Internal Instructions': row.newProject?.internalInstructions ?? '',
    'Attachments': row.newProject?.attachments ?? '',
    'GDrive Folder Link': row.newProject?.gdriveFolderLink ?? '',
    'Version Upgrade Timestamp': row.versionUpgrade?.timestamp ?? '',
    'Version': row.versionUpgrade?.version ?? '',
    'New Requirements': row.versionUpgrade?.newRequirements ?? '',
    'Estimation Timestamp': row.estimation?.timestamp ?? '',
    'Estimated Hours': row.estimation?.estimatedHours ?? '',
    'Estimated Cost': row.estimation?.estimatedCost ?? '',
    'Approval Timestamp': row.approval?.timestamp ?? '',
    'Approved By': row.approval?.approvedBy ?? '',
    'Approval Date': row.approval?.approvalDate ?? '',
    'Expected Delivery Date': row.approval?.expectedDeliveryDate ?? '',
    'Delivery Method': row.approval?.deliveryMethod ?? '',
    'Delivery Timestamp': row.delivery?.timestamp ?? '',
    'Delivery Date': row.delivery?.deliveryDate ?? '',
    'Delivered By': row.delivery?.deliveredBy ?? '',
    'Delivery Notes': row.delivery?.notes ?? '',
    'Feedback Timestamp': row.feedback?.timestamp ?? '',
    'Satisfaction Score': row.feedback?.satisfactionScore ?? '',
    'Feedback': row.feedback?.feedback ?? '',
    'Client Contact': row.feedback?.clientContact ?? '',
  }));

  const csvContent = createCsv(csvHeaders, csvRows);

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
          <DatabaseExport csvContent={csvContent} filename="project-database.csv" />
        </CardContent>
      </Card>
    </main>
  );
}
