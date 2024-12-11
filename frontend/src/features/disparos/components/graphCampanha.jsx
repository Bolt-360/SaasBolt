"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", total: 5 },
  { name: "Fev", total: 8 },
  { name: "Mar", total: 12 },
  { name: "Abr", total: 10 },
  { name: "Mai", total: 15 },
  { name: "Jun", total: 18 },
  { name: "Jul", total: 20 },
  { name: "Ago", total: 22 },
  { name: "Set", total: 25 },
  { name: "Out", total: 28 },
  { name: "Nov", total: 30 },
  { name: "Dez", total: 35 },
]

export function CampaignChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

