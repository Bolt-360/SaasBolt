import { auth } from "@/services/auth"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { MailIcon, PercentIcon, ActivityIcon, MoveHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"

export default async function Page(){
    const session = await auth()
    return (
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MailIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">1,234</span>
                </div>
                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                  <PercentIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Messages Sent</h3>
                <p className="text-gray-500 dark:text-gray-400">Total messages sent across all campaigns.</p>
              </div>
            </Card>
            <Card className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PercentIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">92%</span>
                </div>
                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                  <PercentIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Success Rate</h3>
                <p className="text-gray-500 dark:text-gray-400">Percentage of messages successfully delivered.</p>
              </div>
            </Card>
            <Card className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ActivityIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">14</span>
                </div>
                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                  <ActivityIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Active Campaigns</h3>
                <p className="text-gray-500 dark:text-gray-400">Number of active marketing campaigns.</p>
              </div>
            </Card>
          </div>
          <div className="border shadow-sm rounded-lg p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Campaign</TableHead>
                  <TableHead className="min-w-[150px]">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Messages Sent</TableHead>
                  <TableHead className="hidden md:table-cell">Success Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Black Friday</TableCell>
                  <TableCell className="text-green-500">Active</TableCell>
                  <TableCell className="hidden md:table-cell">12,345</TableCell>
                  <TableCell className="hidden md:table-cell">92%</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoveHorizontalIcon className="w-4 h-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Pause Campaign</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Holiday Promo</TableCell>
                  <TableCell className="text-yellow-500">Paused</TableCell>
                  <TableCell className="hidden md:table-cell">8,765</TableCell>
                  <TableCell className="hidden md:table-cell">85%</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoveHorizontalIcon className="w-4 h-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Resume Campaign</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">New Product Launch</TableCell>
                  <TableCell className="text-red-500">Ended</TableCell>
                  <TableCell className="hidden md:table-cell">5,432</TableCell>
                  <TableCell className="hidden md:table-cell">88%</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoveHorizontalIcon className="w-4 h-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Analyze Results</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
      )
    }