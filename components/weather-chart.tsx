'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { WeatherData } from '@/lib/types';

interface WeatherChartProps {
  data: WeatherData['daily'];
}

export function WeatherChart({ data }: WeatherChartProps) {
  const chartData = data.map((day) => ({
    name: day.date,
    max: day.temp.max,
    min: day.temp.min,
  }));

  return (
    <div className="w-full h-[300px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            className="text-xs text-muted-foreground"
          />
          <YAxis
            className="text-xs text-muted-foreground"
            unit="°C"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
            }}
          />
          <Line
            type="monotone"
            dataKey="max"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={false}
            name="Máxima"
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={false}
            name="Mínima"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}