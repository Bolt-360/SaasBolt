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
import { FaWhatsapp, FaFileInvoiceDollar, FaUserPlus } from 'react-icons/fa'
import CreateInstanceModal from '@/components/CreateInstanceModal'
import InviteUserModal from '@/components/InviteUserModal'
import { useAuthContext } from '@/context/AuthContext'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/app/disparos', end: true },
  { icon: FaWhatsapp, label: 'Campanhas', href: '/app/disparos/listar-campanhas' },
]

export default function Sidebar() {
  const { logout } = useLogout()
  const { authUser } = useAuthContext()
  const [isCreateInstanceModalOpen, setIsCreateInstanceModalOpen] = useState(false)
  const [isInviteUserModalOpen, setIsInviteUserModalOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(true)

  const handleOpenCreateInstanceModal = (e) => {
    e.preventDefault()
    setIsCreateInstanceModalOpen(true)
  }

  const handleOpenInviteUserModal = () => {
    setIsInviteUserModalOpen(true)
  }

  return (
    <aside className="bg-primary text-primary-foreground w-64 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-grow p-4">
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
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-primary-foreground/20 p-4 space-y-2">
        <NavLink
          to="/app/disparos/configuracoes"
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
    </aside>
  )
}
