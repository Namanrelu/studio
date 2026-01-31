import type {
  AllSubmissions,
  NewProjectSubmission,
  ProjectApprovalSubmission,
  ProjectDeliverySubmission,
  ProjectEstimationSubmission,
  ProjectFeedbackSubmission,
  VersionUpgradeSubmission,
} from '@/lib/types';
import { dedupeByProjectId } from '@/lib/google-sheets';

export const SHEET_LABELS = {
  newProjectSubmissions: 'New Project Submissions',
  versionUpgradeSubmissions: 'Version Upgrade Submissions',
  projectEstimationSubmissions: 'Project Estimation Submissions',
  projectApprovalSubmissions: 'Project Approval Submissions',
  projectDeliverySubmissions: 'Project Delivery Submissions',
  projectFeedbackSubmissions: 'Project Feedback Submissions',
} as const;

export type DatabaseRow = {
  projectId: string;
  newProject?: NewProjectSubmission;
  versionUpgrade?: VersionUpgradeSubmission;
  estimation?: ProjectEstimationSubmission;
  approval?: ProjectApprovalSubmission;
  delivery?: ProjectDeliverySubmission;
  feedback?: ProjectFeedbackSubmission;
};

export function buildDatabaseRows(data: AllSubmissions): DatabaseRow[] {
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

export function buildDuplicateRows(rawData: AllSubmissions) {
  return {
    newProjectSubmissions: getDuplicates(rawData.newProjectSubmissions),
    versionUpgradeSubmissions: getDuplicates(rawData.versionUpgradeSubmissions),
    projectEstimationSubmissions: getDuplicates(rawData.projectEstimationSubmissions),
    projectApprovalSubmissions: getDuplicates(rawData.projectApprovalSubmissions),
    projectDeliverySubmissions: getDuplicates(rawData.projectDeliverySubmissions),
    projectFeedbackSubmissions: getDuplicates(rawData.projectFeedbackSubmissions),
  };
}

export function buildUnmappedRows(rawData: AllSubmissions) {
  const deduped = {
    newProjectSubmissions: dedupeByProjectId(rawData.newProjectSubmissions),
    versionUpgradeSubmissions: dedupeByProjectId(rawData.versionUpgradeSubmissions),
    projectEstimationSubmissions: dedupeByProjectId(rawData.projectEstimationSubmissions),
    projectApprovalSubmissions: dedupeByProjectId(rawData.projectApprovalSubmissions),
    projectDeliverySubmissions: dedupeByProjectId(rawData.projectDeliverySubmissions),
    projectFeedbackSubmissions: dedupeByProjectId(rawData.projectFeedbackSubmissions),
  };

  const newProjectIds = new Set(deduped.newProjectSubmissions.map(item => item.projectId));
  const versionUpgradeIds = new Set(deduped.versionUpgradeSubmissions.map(item => item.projectId));
  const estimationIds = new Set(deduped.projectEstimationSubmissions.map(item => item.projectId));
  const approvalIds = new Set(deduped.projectApprovalSubmissions.map(item => item.projectId));
  const deliveryIds = new Set(deduped.projectDeliverySubmissions.map(item => item.projectId));
  const feedbackIds = new Set(deduped.projectFeedbackSubmissions.map(item => item.projectId));

  const isOnlyInOneSheet = (projectId: string, currentIds: Set<string>) => {
    const sets = [newProjectIds, versionUpgradeIds, estimationIds, approvalIds, deliveryIds, feedbackIds];
    const presentCount = sets.reduce((count, set) => count + (set.has(projectId) ? 1 : 0), 0);
    return presentCount === 1 && currentIds.has(projectId);
  };

  const missingAny = (projectId: string, required: Set<string>[]) =>
    required.some(set => !set.has(projectId));

  return {
    newProjectSubmissions: deduped.newProjectSubmissions.filter(item =>
      isOnlyInOneSheet(item.projectId, newProjectIds)
    ),
    versionUpgradeSubmissions: deduped.versionUpgradeSubmissions.filter(item =>
      isOnlyInOneSheet(item.projectId, versionUpgradeIds)
    ),
    projectEstimationSubmissions: deduped.projectEstimationSubmissions.filter(item => {
      const missingStart = missingAny(item.projectId, [newProjectIds, versionUpgradeIds]);
      return missingStart || isOnlyInOneSheet(item.projectId, estimationIds);
    }),
    projectApprovalSubmissions: deduped.projectApprovalSubmissions.filter(item => {
      const missingEstimate = missingAny(item.projectId, [estimationIds]);
      return missingEstimate || isOnlyInOneSheet(item.projectId, approvalIds);
    }),
    projectDeliverySubmissions: deduped.projectDeliverySubmissions.filter(item => {
      const missingApproval = missingAny(item.projectId, [approvalIds]);
      return missingApproval || isOnlyInOneSheet(item.projectId, deliveryIds);
    }),
    projectFeedbackSubmissions: deduped.projectFeedbackSubmissions.filter(item => {
      const missingDelivery = missingAny(item.projectId, [deliveryIds]);
      return missingDelivery || isOnlyInOneSheet(item.projectId, feedbackIds);
    }),
  };
}

function getDuplicates<T extends { projectId?: string }>(items: T[]) {
  const counts = new Map<string, number>();
  items.forEach(item => {
    if (!item.projectId) return;
    counts.set(item.projectId, (counts.get(item.projectId) ?? 0) + 1);
  });

  const duplicates = new Set(
    Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([projectId]) => projectId)
  );

  return items.filter(item => item.projectId && duplicates.has(item.projectId));
}
