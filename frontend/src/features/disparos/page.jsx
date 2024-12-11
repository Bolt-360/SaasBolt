'use client'

import React, { useMemo, useState } from 'react'
import { LayoutDashboard, Send, PlusCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCampaignSocket } from '@/hooks/useCampaignSocket'
import { CampaignChart } from './components/graphCampanha'
import { CampaignTable } from './components/tableCampanhas'
import { CampaignDetailsDialog } from "@/components/ui/campaign-details-dialog"
import { useMessageStats } from '@/hooks/useMessageStats';
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { DashboardPieChart } from './components/graphPie'

export default function DisparoDashboard() {
  const navigate = useNavigate();
  const { campaigns, campaignsStatus } = useCampaignSocket();
  const { messageStats, isLoading: statsLoading } = useMessageStats();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const hasNoCampaigns = campaigns.length === 0;

  // Cálculo das estatísticas gerais
  const stats = useMemo(() => {
    if (!messageStats?.stats) return {
      totalCampaigns: 0,
      totalMessages: 0,
      totalDelivered: 0,
      deliveryRate: "0%"
    };

    return {
      totalCampaigns: messageStats.stats.totalCampaigns,
      totalMessages: messageStats.stats.messageStats.total,
      totalDelivered: messageStats.stats.messageStats.delivered,
      deliveryRate: messageStats.stats.messageStats.successRate
    };
  }, [messageStats]);

  // Dados para o gráfico de barras
  const campaignPerformance = useMemo(() => {
    return campaigns
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 3)
      .map(camp => ({
        name: camp.name.length > 20 ? camp.name.substring(0, 20) + '...' : camp.name,
        enviadas: camp.totalMessages || 0,
        entregues: camp.successCount || 0,
        falhas: camp.failureCount || 0,
        campaignData: camp // Guardamos a referência completa da campanha
      }))
      .reverse();
  }, [campaigns]);

  // Últimas 5 campanhas
  const recentCampaigns = useMemo(() => {
    return campaigns
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  }, [campaigns]);

  // Handler para click na barra
  const handleBarClick = (data) => {
    if (data?.campaignData) {
      setSelectedCampaign(data.campaignData);
      setShowDetailsDialog(true);
    }
  };

  const pieChartData = [
    [
      { name: 'Concluídas', value: 95 },
      { name: 'Em andamento', value: 32 },
    ],
    [
      { name: 'Sucesso', value: 78 },
      { name: 'Falha', value: 22 },
    ],
    [
      { name: 'Ativas', value: 42 },
      { name: 'Inativas', value: 85 },
    ],
  ]

  const pieChartColors = [
    ['#ADFA1D', '#D3D3D3'],
    ['#ADFA1D', '#D3D3D3'],
    ['#ADFA1D', '#D3D3D3'],
  ]

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard de Disparos de Boletos</h2>
          
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="w-1/3">
                  <DashboardPieChart data={pieChartData[0]} colors={pieChartColors[0]} />
                </div>
                <div className="w-2/3 pl-4">
                  <CardHeader className="flex flex-row items-center justify-between p-0">
                    <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+5% do mês passado</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="w-1/3">
                  <DashboardPieChart data={pieChartData[1]} colors={pieChartColors[1]} />
                </div>
                <div className="w-2/3 pl-4">
                  <CardHeader className="flex flex-row items-center justify-between p-0">
                    <CardTitle className="text-sm font-medium">Boletos Entregues</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground">+10% do mês passado</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="w-1/3">
                  <DashboardPieChart data={pieChartData[2]} colors={pieChartColors[2]} />
                </div>
                <div className="w-2/3 pl-4">
                  <CardHeader className="flex flex-row items-center justify-between p-0">
                    <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">+20% do mês passado</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Campanhas por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <CampaignChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Campanhas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <CampaignTable />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
