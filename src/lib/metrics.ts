import type { AllSubmissions, CombinedProjectData, Kpi } from '@/lib/types';
import { parseISO, isAfter, isBefore, differenceInDays } from 'date-fns';

export function combineProjectData(data: AllSubmissions): CombinedProjectData[] {
  const combined: CombinedProjectData[] = data.newProjectSubmissions.map(newProject => {
    const approval = data.projectApprovalSubmissions.find(p => p.projectId === newProject.projectId);
    const delivery = data.projectDeliverySubmissions.find(p => p.projectId === newProject.projectId);
    const feedback = data.projectFeedbackSubmissions.find(p => p.projectId === newProject.projectId);
    const estimation = data.projectEstimationSubmissions.find(p => p.projectId === newProject.projectId);

    const approvalDate = approval ? parseISO(approval.approvalDate) : undefined;
    const expectedDelivery = approval ? parseISO(approval.expectedDeliveryDate) : undefined;
    const actualDelivery = delivery ? parseISO(delivery.deliveryDate) : undefined;

    let status: CombinedProjectData['status'] = 'Planning';
    if (actualDelivery) {
      status = 'Delivered';
    } else if (approvalDate) {
      if (expectedDelivery && isBefore(new Date(), expectedDelivery)) {
        status = 'In Progress';
      } else if (expectedDelivery && isAfter(new Date(), expectedDelivery)) {
        status = 'Delayed';
      } else {
        status = 'Approved';
      }
    }

    if (newProject.projectId === 'P002') status = 'On Hold';
    
    return {
      id: newProject.projectId,
      name: newProject.projectName,
      client: newProject.clientName,
      approvalDate: approvalDate,
      expectedDelivery: expectedDelivery,
      actualDelivery: actualDelivery,
      estimatedHours: estimation?.estimatedHours,
      satisfaction: feedback?.satisfactionScore,
      feedback: feedback?.feedback,
      status: status,
    };
  });
  return combined;
};

export function calculateKpis(data: CombinedProjectData[]): Kpi {
  const deliveredProjects = data.filter(p => p.status === 'Delivered');
  const totalProjects = data.length;

  const onTimeDeliveries = deliveredProjects.filter(p => 
    p.actualDelivery && p.expectedDelivery && !isAfter(p.actualDelivery, p.expectedDelivery)
  ).length;
  
  const onTimeDeliveryRate = deliveredProjects.length > 0
    ? (onTimeDeliveries / deliveredProjects.length) * 100
    : 0;

  const projectsWithFeedback = data.filter(p => p.satisfaction !== undefined);
  const totalSatisfaction = projectsWithFeedback.reduce((sum, p) => sum + (p.satisfaction || 0), 0);
  
  const avgSatisfaction = projectsWithFeedback.length > 0
    ? totalSatisfaction / projectsWithFeedback.length
    : 0;

  const projectsWithEstimatesAndDelivery = data.filter(p => p.estimatedHours && p.approvalDate && p.actualDelivery);
  const totalDeviation = projectsWithEstimatesAndDelivery.reduce((sum, p) => {
    const deliveryDuration = differenceInDays(p.actualDelivery!, p.approvalDate!);
    const estimatedDays = p.estimatedHours! / 8; // Assuming 8 hours/day
    const deviation = Math.abs(deliveryDuration - estimatedDays) / estimatedDays;
    return sum + deviation;
  }, 0);

  const avgDeviation = projectsWithEstimatesAndDelivery.length > 0
    ? totalDeviation / projectsWithEstimatesAndDelivery.length
    : 0;

  const estimationAccuracy = (1 - avgDeviation) * 100;

  return {
    totalProjects,
    onTimeDeliveryRate: parseFloat(onTimeDeliveryRate.toFixed(1)),
    avgSatisfaction: parseFloat(avgSatisfaction.toFixed(1)),
    estimationAccuracy: parseFloat(estimationAccuracy.toFixed(1)),
  };
}
