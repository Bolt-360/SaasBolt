// import React from 'react'
// import { useState } from 'react'
// import { usePage } from '../Tasks/TasksContext';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//     } from "@/components/ui/dialog"
// import {
//         Select,
//         SelectContent,
//         SelectItem,
//         SelectTrigger,
//         SelectValue,
//     } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { PlusCircle } from 'lucide-react'

// export default function ModalTasks() {
//     const [newTaskName, setNewTaskName] = useState('')
//     const [newTaskProject, setNewTaskProject] = useState('')
//     const [newTaskStatus, setNewTaskStatus] = useState('')
//     const [newResponsibleTask, setNewResponsibleTask] = useState('')
//     const [newDueDateTask, setNewDueDateTask] = useState('')
//     const { addTask, taskStatus, members  } = usePage();
//     const [isOpen, setIsOpen] = useState(false)

//     // Função para fechar o modal
//     const onClose = () => setIsOpen(false);

//     const handleAddTask = () => {
//         if (newTaskName.trim() !== '') {
//             const newTask = {
//                 task: newTaskName,
//                 projeto: newTaskProject,
//                 responsavel: newResponsibleTask,
//                 data: new Date(),
//                 status: newTaskStatus,
//                 dueDate: newDueDateTask
//             };
    
//             addTask(newTask);  // Adiciona a tarefa ao estado global
//             setNewTaskName('');  // Limpa o campo de entrada
//             setNewTaskProject('');
//             setNewResponsibleTask('');  // Limpa o campo de entrada
//             setNewTaskStatus('');
//             setNewDueDateTask('');  // Limpa o campo de entrada
//             onClose();  // Fecha o modal
//         }
//     };
    

//     return (
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <DialogTrigger asChild>
//                 <Button variant="outline" className="bg-blue-600 text-white ml-auto" onClick={() => setIsOpen(true)}>
//                     <PlusCircle className="mr-2 h-4 w-4" /> New
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]" onEscapeKeyDown={onClose}>
//                 <DialogHeader>
//                     <DialogTitle>Adicionar Nova Task</DialogTitle>
//                     <DialogDescription>
//                         Digite o nome da task que você deseja adicionar.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                     <div className="grid grid-cols-4 items-center gap-4">

//                         <Label htmlFor="name" className="text-right">
//                             Título
//                         </Label>
//                         <Input
//                         id="name"
//                         value={newTaskName}
//                         onChange={(e) => setNewTaskName(e.target.value)}
//                         className="col-span-3"
//                         />

//                         <Label htmlFor="project" className="text-right">
//                             Projeto
//                         </Label>
//                         <Input 
//                         id="project"
//                         value={newTaskProject}
//                         onChange={(e) => setNewTaskProject(e.target.value)}
//                         className="col-span-3"
//                         />

//                         <Label htmlFor="responsible" className="text-right">
//                             Responsável
//                         </Label>
//                         <Select onValueChange={setNewResponsibleTask}>
//                             <SelectTrigger className="col-span-3">
//                                 <SelectValue placeholder="Selecione" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {members.map((member, index) => (
//                                     <SelectItem key={index} value={member.name}>{member.name}</SelectItem> 
//                                 ))}
//                             </SelectContent>
//                         </Select>

//                         <Label htmlFor="status" className="text-right">
//                             Status
//                         </Label>
//                         <Select onValueChange={setNewTaskStatus}>
//                             <SelectTrigger className="col-span-3">
//                                 <SelectValue placeholder="Selecione" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {taskStatus.map((status, index) => (
//                                     <SelectItem key={index} value={status}>{status}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>

//                         <Label htmlFor="dueDate" className="text-right">
//                             Data de Vencimento
//                         </Label>
//                         <Input 
//                         type="date"
//                         id="dueDate"
//                         value={newDueDateTask}
//                         onChange={(e) => setNewDueDateTask(e.target.value)}
//                         className="col-span-3"
//                         />
                        
//                     </div>
//                 </div>
//                 <DialogFooter>
//                     <Button type="submit" onClick={handleAddTask}>Adicionar Task</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     )
// }



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
import { PlusCircle } from 'lucide-react'

export default function ModalTasks() {
    const [newTaskName, setNewTaskName] = useState('')
    const [newTaskProject, setNewTaskProject] = useState('')
    const [newTaskStatus, setNewTaskStatus] = useState('')
    const [newResponsibleTask, setNewResponsibleTask] = useState('')
    const [newDueDateTask, setNewDueDateTask] = useState('')
    const { addTask, taskStatus, members } = usePage();
    const [isOpen, setIsOpen] = useState(false)

    const onClose = () => setIsOpen(false);

    const handleAddTask = () => {
        if (newTaskName.trim() !== '') {
            // Ajusta a data de vencimento para meio-dia do dia selecionado
            const dueDate = new Date(newDueDateTask);
            dueDate.setHours(12, 0, 0, 0);

            const newTask = {
                task: newTaskName,
                projeto: newTaskProject,
                responsavel: newResponsibleTask,
                data: new Date(),
                status: newTaskStatus,
                dueDate: dueDate.toISOString() // Salva como ISO string para manter consistência
            };
    
            addTask(newTask);
            setNewTaskName('');
            setNewTaskProject('');
            setNewResponsibleTask('');
            setNewTaskStatus('');
            setNewDueDateTask('');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-blue-600 text-white ml-auto" onClick={() => setIsOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> New
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onEscapeKeyDown={onClose}>
                <DialogHeader>
                    <DialogTitle>Adicionar Nova Task</DialogTitle>
                    <DialogDescription>
                        Digite o nome da task que você deseja adicionar.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Título
                        </Label>
                        <Input
                            id="name"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            className="col-span-3"
                        />

                        <Label htmlFor="project" className="text-right">
                            Projeto
                        </Label>
                        <Input 
                            id="project"
                            value={newTaskProject}
                            onChange={(e) => setNewTaskProject(e.target.value)}
                            className="col-span-3"
                        />

                        <Label htmlFor="responsible" className="text-right">
                            Responsável
                        </Label>
                        <Select onValueChange={setNewResponsibleTask}>
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
                        <Select onValueChange={setNewTaskStatus}>
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
                            value={newDueDateTask}
                            onChange={(e) => setNewDueDateTask(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleAddTask}>Adicionar Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}