import { mockData } from '@/lib/data';
import { combineProjectData, calculateKpis } from '@/lib/metrics';
import { MetricCard } from '@/components/dashboard/metric-card';
import {
  Activity,
  CheckCircle,
  Clock,
  Smile,
  Target,
} from 'lucide-react';
import { ProjectVelocityChart } from '@/components/dashboard/project-velocity-chart';
import { EstimationAccuracyChart } from '@/components/dashboard/estimation-accuracy-chart';
import { RecentFeedback } from '@/components/dashboard/recent-feedback';
import { AITrends } from '@/components/dashboard/ai-trends';
import { ProjectsTable } from '@/components/dashboard/projects-table';
import { ClientSatisfactionChart } from '@/components/dashboard/client-satisfaction-chart';

export default function DashboardPage() {
  const combinedData = combineProjectData(mockData);
  const kpis = calculateKpis(combinedData);

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Projects"
          value={kpis.totalProjects}
          icon={Activity}
          description="All projects in the pipeline"
        />
        <MetricCard
          title="On-Time Delivery"
          value={`${kpis.onTimeDeliveryRate}%`}
          icon={CheckCircle}
          description="Based on delivered projects"
        />
        <MetricCard
          title="Avg. Satisfaction"
          value={`${kpis.avgSatisfaction} / 5`}
          icon={Smile}
          description="From client feedback"
        />
        <MetricCard
          title="Estimation Accuracy"
          value={`${kpis.estimationAccuracy}%`}
          icon={Target}
          description="Time-based accuracy"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-full lg:col-span-4">
          <ProjectVelocityChart data={combinedData} />
        </div>
        <div className="col-span-full lg:col-span-3">
          <ClientSatisfactionChart data={combinedData} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AITrends data={mockData} />
        </div>
        <div className="lg:col-span-1">
          <RecentFeedback data={combinedData} />
        </div>
      </div>
      <div>
        <ProjectsTable data={combinedData} />
      </div>
    </main>
  );
}
