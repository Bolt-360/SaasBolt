'use client'

import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CircleCheckBig, Handshake, GitCompareArrows } from 'lucide-react'
import { cn } from "@/lib/utils"
import useLogout from '@/hooks/useLogout'

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/app/pipefull', end: true },
    { icon: CircleCheckBig, label: 'Minhas Tasks', href: '/app/pipefull/my-tasks', end: true },
    { icon: Handshake, label: 'Membros', href: '/app/pipefull/members', end: true},
    { icon: GitCompareArrows, label: 'Projetos', href: '/app/pipefull/', end: true},
]

export default function Sidebar() {
    const { logout } = useLogout()

    return (
        <aside className="bg-primary text-primary-foreground w-64 min-h-screen p-4">
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
        </aside>
    )
    }
