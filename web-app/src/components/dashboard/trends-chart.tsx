
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

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
    color: '#00f3ff', // Neon Blue
  },
  Health: {
    label: 'Health',
    color: '#ff00ff', // Neon Pink
  },
  Finance: {
    label: 'Finance',
    color: '#ffe600', // Neon Yellow
  },
} satisfies ChartConfig;

export function TrendsChart() {
  return (
    <Card className="h-full bg-glass-gradient backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(0,243,255,0.05)]">
      <CardHeader>
        <CardTitle className="text-gray-100 tracking-wide uppercase font-bold">Topic Trends</CardTitle>
        <CardDescription className="text-gray-400">
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
              top: 10,
              bottom: 10
            }}
          >
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#6b7280"
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }} content={<ChartTooltipContent className="bg-black/90 border-white/10 text-white" />} />
            <ChartLegend content={<ChartLegendContent className="text-gray-300" />} />

            {/* Neon Blue Line with Glow */}
            <Line
              dataKey="Politics"
              type="monotone"
              stroke="var(--color-Politics)"
              strokeWidth={3}
              dot={false}
              style={{ filter: 'drop-shadow(0 0 8px #00f3ff)' }}
            />

            {/* Neon Pink Line with Glow */}
            <Line
              dataKey="Health"
              type="monotone"
              stroke="var(--color-Health)"
              strokeWidth={3}
              dot={false}
              style={{ filter: 'drop-shadow(0 0 8px #ff00ff)' }}
            />

            {/* Neon Yellow Line with Glow */}
            <Line
              dataKey="Finance"
              type="monotone"
              stroke="var(--color-Finance)"
              strokeWidth={3}
              dot={false}
              style={{ filter: 'drop-shadow(0 0 8px #ffe600)' }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
