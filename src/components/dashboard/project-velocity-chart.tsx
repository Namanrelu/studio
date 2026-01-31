'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts';
import type { CombinedProjectData } from '@/lib/types';
import { format, subMonths, isAfter } from 'date-fns';

type ProjectVelocityChartProps = {
  data: CombinedProjectData[];
};

export function ProjectVelocityChart({ data }: ProjectVelocityChartProps) {
  const sixMonthsAgo = subMonths(new Date(), 6);
  const relevantProjects = data.filter(
    p => p.actualDelivery && isAfter(p.actualDelivery, sixMonthsAgo)
  );

  const monthlyCompletions = relevantProjects.reduce((acc, project) => {
    if (project.actualDelivery) {
      const month = format(project.actualDelivery, 'MMM yyyy');
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subMonths(new Date(), 6 - i);
    const month = format(date, 'MMM yyyy');
    return {
      month: format(date, 'MMM'),
      completions: monthlyCompletions[month] || 0,
    };
  });
  
  const chartConfig = {
    completions: {
      label: 'Projects Completed',
      color: 'hsl(var(--primary))',
    },
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-headline'>Project Velocity</CardTitle>
        <CardDescription>Projects completed over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <defs>
              <linearGradient id="fillCompletions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area
              dataKey="completions"
              type="natural"
              fill="url(#fillCompletions)"
              stroke="hsl(var(--primary))"
              stackId="a"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
