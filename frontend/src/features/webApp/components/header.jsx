import { Link } from "react-router-dom";
import { LayoutDashboardIcon, AppWindowIcon, FileIcon, SettingsIcon, BellIcon, BuildingIcon, UserIcon, LogOutIcon, PowerIcon, ChevronDownIcon, FileWarningIcon, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useLogout from "@/hooks/useLogout";
import { Loader2 } from "lucide-react";


export default function Header() {
    const { loading, logout } = useLogout();
    
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
          <div className="flex flex-1 items-center justify-end gap-2"> {/* Reduzindo o gap */}
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
                  <span>Acme Inc</span>
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Switch Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <BuildingIcon className="mr-2 h-4 w-4" />
                  Acme Inc
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BuildingIcon className="mr-2 h-4 w-4" />
                  Globex Corp
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BuildingIcon className="mr-2 h-4 w-4" />
                  Stark Industries
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>John Doe</DropdownMenuLabel>
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
