import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboardIcon, AppWindowIcon, FileIcon, SettingsIcon, BellIcon, BuildingIcon, UserIcon, LogOutIcon, PowerIcon, ChevronDownIcon, FileWarningIcon, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useLogout from "@/hooks/useLogout";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { changeActiveWorkspace } from '@/lib/workspaceApi';
import { useToast } from "@/hooks/use-toast";
import useConversation from "@/zustand/useConversation";

export default function Header() {
    const { loading, logout } = useLogout();
    const { authUser, setAuthUser } = useAuthContext();
    const { toast } = useToast();
    const { clearSelectedConversation } = useConversation();

    const activeWorkspace = authUser?.workspaces?.find(w => w.id === authUser.activeWorkspaceId);

    const handleChangeWorkspace = async (workspaceId) => {
        if (workspaceId === authUser.activeWorkspaceId) {
            return; // Não faz nada se tentar trocar para a mesma empresa
        }

        try {
            await changeActiveWorkspace(authUser.token, workspaceId);
            const updatedUser = { ...authUser, activeWorkspaceId: workspaceId };
            setAuthUser(updatedUser);
            clearSelectedConversation();
            const newActiveWorkspace = authUser.workspaces.find(w => w.id === workspaceId);
            toast({
                title: "Workspace alterado com sucesso",
                description: `Você agora está no workspace ${newActiveWorkspace.name}`,
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Erro ao trocar de workspace",
                description: error.message || "Ocorreu um erro inesperado",
                variant: "destructive",
            });
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Filtra as workspaces para excluir a atual
    const otherWorkspaces = authUser?.workspaces?.filter(w => w.id !== authUser.activeWorkspaceId) || [];

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between sm:px-6 lg:px-8 w-full">
                <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
                    <Link to="#" className="flex shrink-0 items-center gap-3">
                        <LayoutDashboardIcon className="h-6 w-6" />
                        <span className="text-lg font-bold tracking-tight">Bolt 360</span>
                    </Link>
                    <nav className="hidden md:block">
                        <ul className="flex items-center gap-6">
                            <li>
                                <Link
                                    to="/app"
                                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                                >
                                    <AppWindowIcon className="mr-2 h-4 w-4" />
                                    Apps
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/app/chat"
                                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                                >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Chat
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/app/settings"
                                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                                >
                                    <SettingsIcon className="mr-2 h-4 w-4" />
                                    Configurações
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <BellIcon className="h-5 w-5" />
                                <span className="sr-only">Open notifications</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <FileIcon className="mr-2 h-4 w-4" />
                                    <span>New file uploaded</span>
                                    <span className="ml-auto font-normal">2h ago</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>New user registered</span>
                                    <span className="ml-auto font-normal">6h ago</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <PowerIcon className="mr-2 h-4 w-4" />
                                    <span>System update available</span>
                                    <span className="ml-auto font-normal">12h ago</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <FileWarningIcon className="mr-2 h-4 w-4" />
                                    <span>Backup failed</span>
                                    <span className="ml-auto font-normal">14h ago</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <BuildingIcon className="mr-2 h-4 w-4" />
                                <span>{activeWorkspace ? activeWorkspace.name : 'Selecione uma empresa'}</span>
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Trocar Empresa</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {otherWorkspaces.length === 0 ? (
                                <DropdownMenuItem disabled>
                                    Nenhuma outra empresa disponível
                                </DropdownMenuItem>
                            ) : (
                                otherWorkspaces.map(workspace => (
                                    <DropdownMenuItem key={workspace.id} onClick={() => handleChangeWorkspace(workspace.id)}>
                                        <BuildingIcon className="mr-2 h-4 w-4" />
                                        {workspace.name}
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Avatar>
                                    <AvatarImage src={authUser?.profilePicture || authUser?.avatarUrl} alt={authUser?.username} />
                                    <AvatarFallback>{getInitials(authUser?.username || 'User')}</AvatarFallback>
                                </Avatar>
                                <span className="sr-only">Open user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{authUser?.username}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <SettingsIcon className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOutIcon className="mr-2 h-4 w-4" />}
                                <span>{loading ? "Saindo..." : "Sair"}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
