import type {
  AllSubmissions,
  NewProjectSubmission,
  VersionUpgradeSubmission,
  ProjectEstimationSubmission,
  ProjectApprovalSubmission,
  ProjectDeliverySubmission,
  ProjectFeedbackSubmission,
} from '@/lib/types';

const SHEET_ID = '1EZg3oVqZLoZPLpLHXph9GPcBV-vGZt2GHpEFrmJ19pI';

const GID_MAP = {
  newProjectSubmissions: '1420623075',
  versionUpgradeSubmissions: '1903335532',
  projectEstimationSubmissions: '1473213063',
  projectApprovalSubmissions: '1384723730',
  projectDeliverySubmissions: '1285433698',
  projectFeedbackSubmissions: '179493132',
};

// Maps Google Sheet column headers to our data model keys.
const KEY_MAPS = {
    newProjectSubmissions: {
      'Timestamp': 'timestamp',
      'Project ID': 'projectId',
      'Project Name': 'projectName',
      'Client Name': 'clientName',
      'Project Type': 'projectType'
    },
    versionUpgradeSubmissions: {
      'Timestamp': 'timestamp',
      'Project ID': 'projectId',
      'Version': 'version',
      'New Requirements': 'newRequirements'
    },
    projectEstimationSubmissions: {
      'Timestamp': 'timestamp',
      'Project ID': 'projectId',
      'Estimated Hours': 'estimatedHours',
      'Estimated Cost': 'estimatedCost'
    },
    projectApprovalSubmissions: {
      'Timestamp': 'timestamp',
      'Project ID': 'projectId',
      'Approved By': 'approvedBy',
      'Approval Date': 'approvalDate',
      'Expected Delivery Date': 'expectedDeliveryDate',
      'Delivery Method': 'deliveryMethod'
    },
    projectDeliverySubmissions: {
      'Timestamp': 'timestamp',
      'Project ID': 'projectId',
      'Delivery Date': 'deliveryDate',
      'Delivered By': 'deliveredBy',
      'Notes': 'notes'
    },
    projectFeedbackSubmissions: {
      'Timestamp': 'timestamp',
      'Project ID': 'projectId',
      'Satisfaction Score (1-5)': 'satisfactionScore',
      'Feedback': 'feedback',
      'Client Contact': 'clientContact'
    }
};

type SheetNames = keyof typeof GID_MAP;


function parseCsv(csv: string, sheetName: SheetNames): any[] {
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headerLine = lines.shift()!;
  const headers = headerLine.split(',').map(h => h.replace(/"/g, '').trim());
  const keyMap = KEY_MAPS[sheetName];

  return lines.map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj: { [key: string]: any } = {};

    headers.forEach((header, i) => {
      const modelKey = keyMap[header as keyof typeof keyMap];
      if (modelKey) {
        let value = values[i]?.replace(/"/g, '').trim() || '';

        if (modelKey.toLowerCase().includes('date') || modelKey.toLowerCase().includes('timestamp')) {
            if (value) {
                // Assuming format is 'M/D/YYYY' or 'M/D/YYYY H:mm:ss'
                obj[modelKey] = new Date(value).toISOString();
            } else {
                obj[modelKey] = value;
            }
        } else if (modelKey === 'estimatedHours' || modelKey === 'estimatedCost' || modelKey === 'satisfactionScore') {
          obj[modelKey] = value ? parseFloat(value) : 0;
        } else {
          obj[modelKey] = value;
        }
      }
    });
    return obj;
  });
}


async function fetchSheet(gid: string, sheetName: SheetNames): Promise<any[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
    const response = await fetch(url, { cache: 'no-store' }); // Disable cache to get fresh data
    if (!response.ok) {
      console.error(`Failed to fetch sheet '${sheetName}'. Status: ${response.status}`);
      return [];
    }
    const csvData = await response.text();
    if (!csvData) return [];
    return parseCsv(csvData, sheetName);
  } catch (error) {
    console.error(`Error fetching or parsing sheet '${sheetName}':`, error);
    return [];
  }
}

export async function getGoogleSheetData(): Promise<AllSubmissions> {
  const [
    newProjectSubmissions,
    versionUpgradeSubmissions,
    projectEstimationSubmissions,
    projectApprovalSubmissions,
    projectDeliverySubmissions,
    projectFeedbackSubmissions,
  ] = await Promise.all([
    fetchSheet(GID_MAP.newProjectSubmissions, 'newProjectSubmissions'),
    fetchSheet(GID_MAP.versionUpgradeSubmissions, 'versionUpgradeSubmissions'),
    fetchSheet(GID_MAP.projectEstimationSubmissions, 'projectEstimationSubmissions'),
    fetchSheet(GID_MAP.projectApprovalSubmissions, 'projectApprovalSubmissions'),
    fetchSheet(GID_MAP.projectDeliverySubmissions, 'projectDeliverySubmissions'),
    fetchSheet(GID_MAP.projectFeedbackSubmissions, 'projectFeedbackSubmissions'),
  ]);

  return {
    newProjectSubmissions: newProjectSubmissions as NewProjectSubmission[],
    versionUpgradeSubmissions: versionUpgradeSubmissions as VersionUpgradeSubmission[],
    projectEstimationSubmissions: projectEstimationSubmissions as ProjectEstimationSubmission[],
    projectApprovalSubmissions: projectApprovalSubmissions as ProjectApprovalSubmission[],
    projectDeliverySubmissions: projectDeliverySubmissions as ProjectDeliverySubmission[],
    projectFeedbackSubmissions: projectFeedbackSubmissions as ProjectFeedbackSubmission[],
  };
}
