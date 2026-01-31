'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { NewProjectSubmission } from '@/lib/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type SubmissionsBySlotChartProps = {
  data: NewProjectSubmission[];
};

export function SubmissionsBySlotChart({ data }: SubmissionsBySlotChartProps) {
  const slots = {
    '12PM - 8PM': 0,
    '8PM - 4AM': 0,
    '4AM - 12PM': 0,
  };

  data.forEach(submission => {
    if (submission.timestamp) {
      const submissionDate = new Date(submission.timestamp);
      const hour = submissionDate.getHours();

      if (hour >= 12 && hour < 20) {
        slots['12PM - 8PM']++;
      } else if (hour >= 20 || hour < 4) {
        slots['8PM - 4AM']++;
      } else if (hour >= 4 && hour < 12) {
        slots['4AM - 12PM']++;
      }
    }
  });

  const chartData = Object.entries(slots).map(([slot, count]) => ({
    slot,
    count,
  }));

  const chartConfig = {
    count: {
      label: 'Projects',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Submissions by Time Slot</CardTitle>
        <CardDescription>Number of projects submitted in different time windows.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="slot"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
