import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const members = [
    {name: "Matheus", mail: "matheus@bolt360.com.br"},
    {name: "Lucas", mail: "lucas@bolt360.com.br"},
    {name: "Victor", mail: "victor@bolt360.com.br"},
    {name: "Michael", mail: "michael@bolt360.com.br"}
]

export default function Members() {
    const navigate = useNavigate();

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
                            <p className="text-sm text-gray-400">{member.mail}</p>
                        </div>
                        <Button className="bg-white text-black ml-auto">
                            <MoreVertical className="w-4 hover:text-white"/>
                        </Button>
                    </div>
                ))}
                </CardContent>
            </Card>
        </div>
    )
}