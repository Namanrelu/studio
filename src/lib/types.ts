export type NewProjectSubmission = {
  timestamp: string;
  emailAddress?: string;
  projectId: string;
  projectName: string;
  clientName: string;
  companyName?: string;
  companyType?: string;
  projectDescription?: string;
  clientMessage?: string;
  clientCountry?: string;
  clientTimezone?: string;
  communicationPlatforms?: string;
  businessManager?: string;
  internalInstructions?: string;
  attachments?: string;
  gdriveFolderLink?: string;
};

export type VersionUpgradeSubmission = {
  timestamp: string;
  projectId: string;
  version: string;
  newRequirements: string;
};

export type ProjectEstimationSubmission = {
  timestamp: string;
  projectId: string;
  estimatedHours: number;
  estimatedCost: number;
};

export type ProjectApprovalSubmission = {
  timestamp: string;
  projectId: string;
  approvedBy: string;
  approvalDate: string;
  expectedDeliveryDate: string;
  deliveryMethod: string;
};

export type ProjectDeliverySubmission = {
  timestamp: string;
  projectId: string;
  deliveryDate: string;
  deliveredBy: string;
  notes?: string;
};

export type ProjectFeedbackSubmission = {
  timestamp: string;
  projectId: string;
  satisfactionScore: number;
  feedback: string;
  clientContact: string;
};

export type AllSubmissions = {
  newProjectSubmissions: NewProjectSubmission[];
  versionUpgradeSubmissions: VersionUpgradeSubmission[];
  projectEstimationSubmissions: ProjectEstimationSubmission[];
  projectApprovalSubmissions: ProjectApprovalSubmission[];
  projectDeliverySubmissions: ProjectDeliverySubmission[];
  projectFeedbackSubmissions: ProjectFeedbackSubmission[];
}
