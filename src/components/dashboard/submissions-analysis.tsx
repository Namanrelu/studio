'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import {
  addDays,
  format,
  startOfDay,
  endOfDay,
  isWithinInterval,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar as CalendarIcon, Package, Sunrise, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewProjectSubmission } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { StatCard } from './stat-card';

type SubmissionsAnalysisProps = {
  projects: NewProjectSubmission[];
};

type ChartData = {
  label: string;
  count: number;
};

export function SubmissionsAnalysis({ projects }: SubmissionsAnalysisProps) {
  const [rangeOption, setRangeOption] = React.useState<string>('7');
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startOfDay(addDays(new Date(), -6)),
    to: endOfDay(new Date()),
  });

  React.useEffect(() => {
    const now = new Date();
    let fromDate;
    let toDate = endOfDay(now);
    
    switch (rangeOption) {
      case 'today':
        fromDate = startOfDay(now);
        break;
      case 'yesterday':
        fromDate = startOfDay(subDays(now, 1));
        toDate = endOfDay(subDays(now, 1));
        break;
      case '3': // Last 3 days
        fromDate = startOfDay(addDays(now, -2));
        break;
      case '7': // Last 7 days
        fromDate = startOfDay(addDays(now, -6));
        break;
      case 'this_month':
        fromDate = startOfMonth(now);
        break;
      case 'last_month':
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        fromDate = lastMonthStart;
        toDate = endOfMonth(lastMonthStart);
        break;
      case 'last_3_months':
        fromDate = startOfMonth(subMonths(now, 2));
        break;
      case 'all_time':
        setDateRange(undefined);
        return;
      case 'custom':
        return; // Custom range is handled by the calendar
      default:
        fromDate = startOfDay(addDays(now, -6));
    }
    setDateRange({ from: fromDate, to: toDate });
  }, [rangeOption]);

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from) {
       range.from = startOfDay(range.from);
    }
    if (range?.to) {
        range.to = endOfDay(range.to);
    } else if (range?.from) {
        range.to = endOfDay(range.from);
    }

    setDateRange(range);
    
    if(range?.from) {
        setRangeOption('custom');
    }
  };

  const filteredProjects = React.useMemo(() => {
    if (!dateRange) return projects;
    if (!dateRange?.from) return [];
    const interval = { start: dateRange.from, end: dateRange.to || dateRange.from };
    return projects.filter(p =>
      p.timestamp && isWithinInterval(new Date(p.timestamp), interval)
    );
  }, [projects, dateRange]);
  
  const totalProjects = filteredProjects.length;

  const timeSlots = React.useMemo(() => {
    const slots = {
      morning: 0,
      afternoon: 0,
      night: 0,
    };

    filteredProjects.forEach(p => {
      if (p.timestamp) {
        const hour = new Date(p.timestamp).getHours();
        if (hour >= 4 && hour < 12) {
          slots.morning++;
        } else if (hour >= 12 && hour < 20) {
          slots.afternoon++;
        } else {
          slots.night++;
        }
      }
    });
    return slots;
  }, [filteredProjects]);

  const chartData: ChartData[] = React.useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23
    
    return hours.map(hour => {
      const count = filteredProjects.filter(p => {
        if (!p.timestamp) return false;
        const submissionDate = new Date(p.timestamp);
        return submissionDate.getHours() === hour;
      }).length;
      
      const hourLabelDate = new Date();
      hourLabelDate.setHours(hour, 0);
      
      return {
        label: format(hourLabelDate, 'ha'),
        count: count,
      };
    });
  }, [filteredProjects]);
  
  const chartConfig = {
    count: {
      label: 'Projects',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <div className="space-y-4">
       <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Select value={rangeOption} onValueChange={setRangeOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="3">Last 3 days</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                  <SelectItem value="all_time">All Time</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full sm:w-[300px] justify-start text-left font-normal',
                      !dateRange && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'LLL dd, y')} -{' '}
                          {format(dateRange.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(dateRange.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date or range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon={Package}
          description="Projects in the selected date range"
        />
        <StatCard
          title="Morning"
          value={timeSlots.morning}
          icon={Sunrise}
          description="4 AM - 12 PM"
        />
        <StatCard
          title="Afternoon"
          value={timeSlots.afternoon}
          icon={Sun}
          description="12 PM - 8 PM"
        />
        <StatCard
          title="Night"
          value={timeSlots.night}
          icon={Moon}
          description="8 PM - 4 AM"
        />
      </div>
      <Card>
        <CardHeader>
            <div>
              <CardTitle className="font-headline">Incoming Projects by Hour</CardTitle>
              <CardDescription>
                Aggregated project submissions by hour of the day for the selected period.
              </CardDescription>
            </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
