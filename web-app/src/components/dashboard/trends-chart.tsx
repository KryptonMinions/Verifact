'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import ReactApexChart to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TrendsChartProps {
  chartData?: {
    labels: string[];
    series: {
      name: string;
      data: number[];
    }[];
  };
}

export function TrendsChart({ chartData }: TrendsChartProps) {
  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 }
    },
    colors: ['#00E396', '#775DD0', '#FEB019', '#FF4560', '#008FFB'], // Neon Palette
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: chartData?.labels || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#6b7280' } }
    },
    yaxis: {
      labels: { style: { colors: '#6b7280' } }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } }
    },
    theme: { mode: 'dark' },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#9ca3af' }
    }
  };

  const series = chartData?.series || [];

  return (
    <div className="bg-[#1a1d2d] rounded-xl border border-gray-800 p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div id="chart">
        <ReactApexChart options={options} series={series} type="area" height={350} />
      </div>
    </div>
  );
}
