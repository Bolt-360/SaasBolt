'use client'

import React from 'react'
import { useState } from 'react'    
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, Send, PlusCircle, Bell, User, Menu } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


// Dados simulados para os gráficos
const campaignPerformance = [
  { name: 'Campanha 1', enviadas: 1000, entregues: 950, lidas: 800 },
  { name: 'Campanha 2', enviadas: 1500, entregues: 1400, lidas: 1200 },
  { name: 'Campanha 3', enviadas: 800, entregues: 780, lidas: 600 },
  { name: 'Campanha 4', enviadas: 2000, entregues: 1900, lidas: 1700 },
]

const messageStatus = [
  { name: 'Entregues', value: 5030 },
  { name: 'Não Entregues', value: 170 },
  { name: 'Lidas', value: 4300 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard de Campanhas WhatsApp</h2>
          
          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,300</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Entrega</CardTitle>
                <PlusCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.8%</div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho das Últimas Campanhas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={campaignPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      scale="point"
                      padding={{ left: 10, right: 10 }}
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#ccc' }}
                      axisLine={{ stroke: '#ccc' }}
                    />
                    <YAxis 
                      allowDecimals={false}
                      scale="linear"
                      domain={[0, 'auto']}
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#ccc' }}
                      axisLine={{ stroke: '#ccc' }}
                    />
                    <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="enviadas" fill="#8884d8" />
                    <Bar dataKey="entregues" fill="#82ca9d" />
                    <Bar dataKey="lidas" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Status das Mensagens</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={messageStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {messageStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))} 
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
