'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import {
  addDays,
  format,
  startOfDay,
  endOfDay,
  isWithinInterval,
  differenceInDays,
  eachDayOfInterval,
  eachHourOfInterval,
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
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewProjectSubmission } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

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
    switch (rangeOption) {
      case '1': // Today
        fromDate = startOfDay(now);
        break;
      case '3': // Last 3 days
        fromDate = startOfDay(addDays(now, -2));
        break;
      case '7': // Last 7 days
        fromDate = startOfDay(addDays(now, -6));
        break;
      case 'custom':
        return; // Custom range is handled by the calendar
      default:
        fromDate = startOfDay(addDays(now, -6));
    }
    setDateRange({ from: fromDate, to: endOfDay(now) });
  }, [rangeOption]);

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from) {
       range.from = startOfDay(range.from);
    }
    if (range?.to) {
        range.to = endOfDay(range.to);
    }
    setDateRange(range);
    if(range?.from && range?.to && differenceInDays(range.to, range.from) >= 0) {
        setRangeOption('custom');
    } else if (range?.from && !range.to) {
        // selecting a single day
        setRangeOption('custom');
        setDateRange({ from: startOfDay(range.from), to: endOfDay(range.from) });
    }
  };

  const filteredProjects = React.useMemo(() => {
    if (!dateRange?.from) return [];
    const interval = { start: dateRange.from, end: dateRange.to || dateRange.from };
    return projects.filter(p =>
      p.timestamp && isWithinInterval(new Date(p.timestamp), interval)
    );
  }, [projects, dateRange]);

  const chartData: ChartData[] = React.useMemo(() => {
    if (!dateRange?.from) return [];

    const isSingleDay =
      !dateRange.to || differenceInDays(dateRange.to, dateRange.from) === 0;

    if (isSingleDay) {
      const hours = eachHourOfInterval({
        start: dateRange.from,
        end: dateRange.to || endOfDay(dateRange.from),
      });
      return hours.map(hour => {
        const count = filteredProjects.filter(p => {
          const pDate = new Date(p.timestamp);
          return pDate.getHours() === hour.getHours();
        }).length;
        return { label: format(hour, 'ha'), count };
      });
    } else {
      const days = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to,
      });
      return days.map(day => {
        const count = filteredProjects.filter(p => {
          const pDate = new Date(p.timestamp);
          return startOfDay(pDate).getTime() === startOfDay(day).getTime();
        }).length;
        return { label: format(day, 'MMM d'), count };
      });
    }
  }, [filteredProjects, dateRange]);
  
  const chartConfig = {
    count: {
      label: 'Projects',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="font-headline">Incoming Projects</CardTitle>
            <CardDescription>
              Number of new projects submitted over a selected period.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={rangeOption} onValueChange={setRangeOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Today</SelectItem>
                <SelectItem value="3">Last 3 days</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="custom" disabled>Custom Range</SelectItem>
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
                    <span>Pick a date</span>
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
  );
}
