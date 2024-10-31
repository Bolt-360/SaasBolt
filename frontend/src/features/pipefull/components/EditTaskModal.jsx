import React from 'react'
import { useState } from 'react'
import { usePage } from '../Tasks/TasksContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function EditTaskModal() {
    const { updateTask, taskStatus, members, tableData } = usePage();
    const [isOpen, setIsOpen] = useState(false)

    const [updateTaskName, setUpdateTaskName] = useState()
    const [updateTaskProject, setUpdateTaskProject] = useState('')
    const [updateTaskStatus, setUpdateTaskStatus] = useState('')
    const [updateResponsibleTask, setUpdateResponsibleTask] = useState('')
    const [updateDueDateTask, setUpdateDueDateTask] = useState('')

    const onClose = () => setIsOpen(false);

    const handleUpdateTask = () => {
        {tableData.map((task) => {
            if (updateTaskName.trim() !== '') {
                // Ajusta a data de vencimento para meio-dia do dia selecionado
                const dueDate = new Date(newDueDateTask);
                dueDate.setHours(12, 0, 0, 0);
    
                const taskEdit = {
                    task: updateTaskName,
                    projeto: updateTaskProject,
                    responsavel: updateResponsibleTask,
                    data: new Date(),
                    status: updateTaskStatus,
                    dueDate: updateDueDateTask.toISOString() // Salva como ISO string para manter consistência
                };
        
                updateTask(taskEdit);
                setUpdateTaskName(task.task);
                setUpdateTaskProject(task.projeto);
                setUpdateTaskStatus(task.status);
                setUpdateResponsibleTask(task.responsavel);
                setUpdateDueDateTask(new Date(task.dueDate));
                onClose();
            }
        })}
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]" onEscapeKeyDown={onClose}>
                <DialogHeader>
                    <DialogTitle>Editar Task</DialogTitle>
                    <DialogDescription>
                        Altere as informações que você deseja alterar
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Título
                        </Label>
                        <Input
                            id="name"
                            value={updateTaskName}
                            onChange={(e) => setUpdateTaskName(e.target.value)}
                            className="col-span-3"
                        />

                        <Label htmlFor="project" className="text-right">
                            Projeto
                        </Label>
                        <Input 
                            id="project"
                            value={updateTaskProject}
                            onChange={(e) => setUpdateTaskProject(e.target.value)}
                            className="col-span-3"
                        />

                        <Label htmlFor="responsible" className="text-right">
                            Responsável
                        </Label>
                        <Select onValueChange={setUpdateResponsibleTask}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map((member, index) => (
                                    <SelectItem key={index} value={member.name}>{member.name}</SelectItem> 
                                ))}
                            </SelectContent>
                        </Select>

                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select onValueChange={updateTaskStatus}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                {taskStatus.map((status, index) => (
                                    <SelectItem key={index} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Label htmlFor="dueDate" className="text-right">
                            Data de Vencimento
                        </Label>
                        <Input 
                            type="date"
                            id="dueDate"
                            value={updateDueDateTask}
                            onChange={(e) => setUpdateDueDateTask(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleUpdateTask}>Editar Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}