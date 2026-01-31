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
      'Email Address': 'emailAddress',
      'Project Name': 'projectName',
      'Client Name': 'clientName',
      'Company Name': 'companyName',
      'Company Type': 'companyType',
      'Project Description': 'projectDescription',
      'Client Message': 'clientMessage',
      'Client Country': 'clientCountry',
      'Client Timezone': 'clientTimezone',
      'Communication Platforms': 'communicationPlatforms',
      'Business Manager': 'businessManager',
      'Internal Instructions': 'internalInstructions',
      'Attachments': 'attachments',
      'Normalized Name': 'projectId',
      'Gdrive Folder Link': 'gdriveFolderLink'
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
  
  const clientTimezoneIndex = headers.indexOf('Client Timezone');

  return lines.map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj: { [key: string]: any } = {};

    headers.forEach((header, i) => {
      const modelKey = keyMap[header as keyof typeof keyMap];
      if (modelKey) {
        let value = values[i]?.replace(/"/g, '').trim() || '';

        if (sheetName === 'newProjectSubmissions' && modelKey === 'timestamp' && value) {
            const match = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?: (\d{1,2}):(\d{1,2}):(\d{1,2}))?/);
            if (match) {
                const day = match[1].padStart(2, '0');
                const month = match[2].padStart(2, '0');
                const year = match[3];
                const hour = match[4] ? match[4].padStart(2, '0') : '00';
                const minute = match[5] ? match[5].padStart(2, '0') : '00';
                const second = match[6] ? match[6].padStart(2, '0') : '00';
                
                const isoDateTime = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

                let tzOffsetString = 'Z'; // Default to UTC
                const tzString = clientTimezoneIndex !== -1 ? values[clientTimezoneIndex]?.replace(/"/g, '').trim() : '';
                if (tzString) { // e.g. "GMT+10:00"
                    const tzMatch = tzString.match(/GMT([+-])(\d{1,2}):(\d{2})/);
                    if (tzMatch) {
                        tzOffsetString = `${tzMatch[1]}${tzMatch[2].padStart(2, '0')}:${tzMatch[3]}`;
                    }
                }
                
                const date = new Date(`${isoDateTime}${tzOffsetString}`);
                if (!isNaN(date.getTime())) {
                    obj[modelKey] = date.toISOString();
                } else {
                    obj[modelKey] = value;
                }
            } else { // fallback
                 const date = new Date(value);
                 if (!isNaN(date.getTime())) {
                     obj[modelKey] = date.toISOString();
                 } else {
                    obj[modelKey] = value;
                 }
            }
        } else if ((modelKey.toLowerCase().includes('date') || modelKey.toLowerCase().includes('timestamp')) && value) {
            // Existing logic for other dates/timestamps
             const match = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?: (\d{1,2}):(\d{1,2}):(\d{1,2}))?/);
                if (match) {
                    const day = parseInt(match[1], 10);
                    const month = parseInt(match[2], 10) - 1; // JS month is 0-indexed
                    const year = parseInt(match[3], 10);
                    const hour = match[4] ? parseInt(match[4], 10) : 0;
                    const minute = match[5] ? parseInt(match[5], 10) : 0;
                    const second = match[6] ? parseInt(match[6], 10) : 0;
                    
                    const date = new Date(Date.UTC(year, month, day, hour, minute, second));
                    if (!isNaN(date.getTime())) {
                        obj[modelKey] = date.toISOString();
                    } else {
                        obj[modelKey] = value;
                    }
                } else {
                    // Fallback for other formats
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                        obj[modelKey] = date.toISOString();
                    } else {
                        obj[modelKey] = value;
                    }
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
