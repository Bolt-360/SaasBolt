'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardProvider, useDashboard } from './DashboardContext'

function DashboardContent() {
    const { projects, addProject, removeProject } = useDashboard();
    const [newProjectName, setNewProjectName] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const stats = [
        { title: "Todos os Projetos", value: projects.length, color: "text-primary" },
        { title: "Todas as Tarefas", value: 0, color: "text-green-600" },
        { title: "Tarefas Atribuídas", value: 0, color: "text-yellow-600" },
        { title: "Tarefas Concluídas", value: 0, color: "text-purple-600" },
        { title: "Tarefas Atrasadas", value: 0, color: "text-destructive" },
    ]

    const tasks = [
        { title: "Layout", project: "Disparador", days: 1 },
        { title: "Layout", project: "KANBAN", days: 1 },
        { title: "Só to fazendo o Design!", project: "Michael Etc Etc", days: 1 },
    ]

    const people = [
        { name: "Michael", email: "michael@bolt360.com.br" },
        { name: "Matheus", email: "matheus@bolt360.com.br" },
    ]

    const handleAddProject = () => {
        if (newProjectName.trim() !== '') {
            addProject(newProjectName);
            setNewProjectName('');
            setIsOpen(false);
        }
    }

    const handleRemoveProject = (projectName) => {
        removeProject(projectName);
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Tarefas Atribuídas (3)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tasks.map((task, index) => (
                                <div key={index} className="mb-4 p-4 bg-card rounded-lg shadow">
                                    <h3 className="font-semibold">{task.title}</h3>
                                    <p className="text-sm text-muted-foreground">{task.project} • {task.days} Dias</p>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full">Mostrar tudo</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Projetos ({projects.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {projects.map((project, index) => (
                                <div key={index} className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <span className={`w-8 h-8 bg-primary rounded-md mr-3 flex items-center justify-center text-primary-foreground font-bold`}>
                                            {project.name[0]}
                                        </span>
                                        <span>{project.name}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveProject(project.name)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full" onClick={() => setIsOpen(true)}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Projetos
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]" onEscapeKeyDown={() => setIsOpen(false)}>
                                    <DialogHeader>
                                        <DialogTitle>Adicionar Novo Projeto</DialogTitle>
                                        <DialogDescription>
                                            Digite o nome do novo projeto que você deseja adicionar.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Nome
                                            </Label>
                                            <Input
                                                id="name"
                                                value={newProjectName}
                                                onChange={(e) => setNewProjectName(e.target.value)}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={handleAddProject}>Adicionar Projeto</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Pessoas (2)</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        {people.map((person, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <Avatar className="w-16 h-16">
                                    <AvatarFallback>{person.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="mt-2 font-semibold">{person.name}</span>
                                <span className="text-sm text-muted-foreground">{person.email}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default function DashboardPipefull() {
    return (
        <DashboardProvider>
            <DashboardContent />
        </DashboardProvider>
    )
}
