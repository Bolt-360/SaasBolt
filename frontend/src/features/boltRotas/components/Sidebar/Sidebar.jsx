'use client'

import { useState } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, List, Send, Settings, LogOut } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useLogout from '@/hooks/useLogout'
import { FaWhatsapp } from 'react-icons/fa'
import CreateInstanceModal from '@/components/CreateInstanceModal'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/app/campanhas', end: true },
  { icon: List, label: 'Listar Instâncias', href: '/app/campanhas/listar-instancias' },
  { icon: Send, label: 'Disparador', href: '/app/campanhas/disparador' },
  { icon: FaWhatsapp, label: 'Campanhas', href: '/app/campanhas/listar-campanhas' },
]

export default function Sidebar() {
  const { logout } = useLogout()
  const [isCreateInstanceModalOpen, setIsCreateInstanceModalOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(true)

  const handleOpenCreateInstanceModal = (e) => {
    e.preventDefault()
    setIsCreateInstanceModalOpen(true)
  }

  return (
    <aside className="bg-primary text-primary-foreground w-64 min-h-screen p-4 flex flex-col">
      <div className="flex-grow">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.label} className="flex items-center">
              <NavLink
                to={item.href}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center w-full px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-primary-foreground text-primary"
                      : "text-primary-foreground hover:bg-primary-foreground/10"
                  )
                }
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </NavLink>
              {item.label === 'Listar Instâncias' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleOpenCreateInstanceModal}
                        className="ml-2 p-2 rounded-full hover:bg-primary-foreground/10"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Criar Instância</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-primary-foreground/20 pt-4 mt-4 space-y-2">
        <NavLink
          to="/app/configuracoes"
          className={({ isActive }) =>
            cn(
              "flex items-center justify-between w-full px-2 py-2 text-sm font-medium rounded-md",
              isActive
                ? "bg-primary-foreground text-primary"
                : "text-primary-foreground hover:bg-primary-foreground/10"
            )
          }
        >
          <div className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-green-500" : "bg-red-500"
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{isConnected ? 'Conectado' : 'Desconectado'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavLink>

        <button
          onClick={logout}
          className="flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-primary-foreground hover:bg-primary-foreground/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </button>
      </div>

      <CreateInstanceModal
        isOpen={isCreateInstanceModalOpen}
        onClose={() => setIsCreateInstanceModalOpen(false)}
      />
    </aside>
  )
}
