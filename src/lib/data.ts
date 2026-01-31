import { AllSubmissions } from '@/lib/types';
import { subDays, addDays } from 'date-fns';

const now = new Date();

export const mockData: AllSubmissions = {
  newProjectSubmissions: [
    { timestamp: subDays(now, 60).toISOString(), projectId: 'P001', projectName: 'E-commerce Platform', clientName: 'Global Retail Inc.', projectType: 'Web Development' },
    { timestamp: subDays(now, 55).toISOString(), projectId: 'P002', projectName: 'Mobile Banking App', clientName: 'Secure Bank', projectType: 'Mobile App' },
    { timestamp: subDays(now, 45).toISOString(), projectId: 'P003', projectName: 'AI-Powered Chatbot', clientName: 'SupportPro', projectType: 'AI/ML' },
    { timestamp: subDays(now, 30).toISOString(), projectId: 'P004', projectName: 'Cloud Migration', clientName: 'Legacy Systems', projectType: 'Infrastructure' },
    { timestamp: subDays(now, 10).toISOString(), projectId: 'P005', projectName: 'Marketing Website Redesign', clientName: 'Creative Co.', projectType: 'Web Development' },
  ],
  versionUpgradeSubmissions: [
    { timestamp: subDays(now, 20).toISOString(), projectId: 'P001', version: '1.1', newRequirements: 'Add support for new payment gateway.' },
  ],
  projectEstimationSubmissions: [
    { timestamp: subDays(now, 58).toISOString(), projectId: 'P001', estimatedHours: 400, estimatedCost: 40000 },
    { timestamp: subDays(now, 54).toISOString(), projectId: 'P002', estimatedHours: 600, estimatedCost: 75000 },
    { timestamp: subDays(now, 43).toISOString(), projectId: 'P003', estimatedHours: 350, estimatedCost: 50000 },
    { timestamp: subDays(now, 28).toISOString(), projectId: 'P004', estimatedHours: 500, estimatedCost: 60000 },
    { timestamp: subDays(now, 8).toISOString(), projectId: 'P005', estimatedHours: 150, estimatedCost: 15000 },
  ],
  projectApprovalSubmissions: [
    { timestamp: subDays(now, 50).toISOString(), projectId: 'P001', approvedBy: 'John Doe', approvalDate: subDays(now, 50).toISOString(), expectedDeliveryDate: addDays(subDays(now, 50), 40).toISOString(), deliveryMethod: 'Agile' },
    { timestamp: subDays(now, 48).toISOString(), projectId: 'P002', approvedBy: 'Jane Smith', approvalDate: subDays(now, 48).toISOString(), expectedDeliveryDate: addDays(subDays(now, 48), 60).toISOString(), deliveryMethod: 'Waterfall' },
    { timestamp: subDays(now, 40).toISOString(), projectId: 'P003', approvedBy: 'John Doe', approvalDate: subDays(now, 40).toISOString(), expectedDeliveryDate: addDays(subDays(now, 40), 30).toISOString(), deliveryMethod: 'Agile' },
    { timestamp: subDays(now, 25).toISOString(), projectId: 'P004', approvedBy: 'Emily White', approvalDate: subDays(now, 25).toISOString(), expectedDeliveryDate: addDays(subDays(now, 25), 35).toISOString(), deliveryMethod: 'Hybrid' },
  ],
  projectDeliverySubmissions: [
    { timestamp: subDays(now, 8).toISOString(), projectId: 'P001', deliveryDate: subDays(now, 8).toISOString(), deliveredBy: 'Dev Team A' },
    { timestamp: subDays(now, 5).toISOString(), projectId: 'P003', deliveryDate: subDays(now, 5).toISOString(), deliveredBy: 'Dev Team B', notes: 'Delivered ahead of schedule.' },
  ],
  projectFeedbackSubmissions: [
    { timestamp: subDays(now, 6).toISOString(), projectId: 'P001', satisfactionScore: 4, feedback: 'The platform is robust, but the UI could be more intuitive.', clientContact: 'client1@globalretail.com' },
    { timestamp: subDays(now, 2).toISOString(), projectId: 'P003', satisfactionScore: 5, feedback: 'Excellent work! The chatbot exceeded our expectations. The team was very responsive.', clientContact: 'client2@supportpro.com' },
  ],
};
