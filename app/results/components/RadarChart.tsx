"use client"

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts"

interface RadarChartProps {
  data: Array<{
    name: string
    score: number
  }>
}

export function RadarChart({ data }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadarChart data={data}>
        <PolarGrid 
          gridType="polygon"
          radialLines={true}
          stroke="#e5e7eb"
        />
        <PolarAngleAxis 
          dataKey="name"
          tick={{ fill: '#374151', fontSize: 12 }}
          className="font-medium"
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#9ca3af', fontSize: 10 }}
        />
        <Radar
          name="관심도"
          dataKey="score"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px'
          }}
          formatter={(value: number) => [`${value}점`, '관심도']}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}