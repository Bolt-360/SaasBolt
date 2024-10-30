import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { usePage } from "../Tasks/TasksContext";
import { TasksProvider } from '../Tasks/TasksContext';
import DropMenu from "../components/DropMenu";



function Members() {
    const navigate = useNavigate();
    const { members } = usePage();

    const handleBack = () => {
        navigate('/app/pipefull'); // '/' representa a rota da página principal
    };
    return(
        <div className="flex justify-center mt-20">
            <Card className="w-96 p-5">
                <CardHeader className="flex flex-row items-center justify-between">
                    <Button 
                    className="bg-white text-black hover:text-white"
                    onClick={handleBack}
                    >
                        Voltar
                    </Button>
                    <CardTitle className="text-xl">Bolt Tecnologia</CardTitle>
                </CardHeader>
                <hr className="mb-4"/>
                <CardContent>
                {members.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 mb-3">
                        <Avatar className="w-10 h-10 flex items-center">
                            <AvatarFallback className="text-white bg-black">
                                {member.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-center">
                            <span>{member.name}</span>
                            <p className="text-sm text-gray-400">{member.email}</p>
                        </div>
                        <div className="ml-auto">
                            <DropMenu />
                        </div>
                    </div>
                ))}
                </CardContent>
            </Card>
        </div>
    )
}

export default function MyMembers() {
    return (
        <TasksProvider>
            <Members />
        </TasksProvider>
    );
}