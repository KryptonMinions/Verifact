
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
  type ChartConfig,
} from '@/components/ui/chart';
import { trendsData } from '@/app/dashboard/data';

const chartConfig = {
  Politics: {
    label: 'Politics',
    color: 'hsl(var(--chart-1))',
  },
  Health: {
    label: 'Health',
    color: 'hsl(var(--chart-2))',
  },
  Finance: {
    label: 'Finance',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function TrendsChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Topic Trends</CardTitle>
        <CardDescription>
          Monthly frequency of reported topics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <LineChart
            accessibilityLayer
            data={trendsData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="Politics"
              type="monotone"
              stroke="var(--color-Politics)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="Health"
              type="monotone"
              stroke="var(--color-Health)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="Finance"
              type="monotone"
              stroke="var(--color-Finance)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
