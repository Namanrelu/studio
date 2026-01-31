'use client';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { CombinedProjectData } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type ClientSatisfactionChartProps = {
  data: CombinedProjectData[];
};

export function ClientSatisfactionChart({ data }: ClientSatisfactionChartProps) {
  const feedbackData = data.filter(p => p.satisfaction);
  const scoreCounts = feedbackData.reduce((acc, p) => {
    const score = p.satisfaction || 0;
    acc[score] = (acc[score] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const chartData = [
    { rating: 1, count: scoreCounts[1] || 0 },
    { rating: 2, count: scoreCounts[2] || 0 },
    { rating: 3, count: scoreCounts[3] || 0 },
    { rating: 4, count: scoreCounts[4] || 0 },
    { rating: 5, count: scoreCounts[5] || 0 },
  ];
  
  const chartConfig = {
    count: {
      label: 'Projects',
      color: 'hsl(var(--accent))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Client Satisfaction</CardTitle>
        <CardDescription>Distribution of satisfaction scores.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="rating"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: 'Rating', position: 'insideBottom', offset: -5 }}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="count"
              fill="hsl(var(--accent))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
