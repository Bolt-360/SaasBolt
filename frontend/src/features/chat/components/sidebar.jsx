import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationItem from "./conversationItem";

export default function Sidebar() {
  return (
    <div className="w-1/4 flex flex-col border-r h-full bg-background">
      <div className="p-4">
        <h1 className="text-xl font-bold">Conversas</h1>
        <div className="mt-4">
          <Input type="search" placeholder="Pesquisar" className="w-full" />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="unread" className="h-full flex flex-col">
          <TabsList className="justify-around">
            <TabsTrigger value="all">Tudo</TabsTrigger>
            <TabsTrigger value="unread">Não lidas</TabsTrigger>
            <TabsTrigger value="groups">Grupos</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="flex-1 overflow-auto">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                <ConversationItem
                  name="João Pedro"
                  lastMessage="Bom dia. Tá certo"
                  time="10:41"
                />
                <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
                  <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
                  <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
                  <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
                  <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
                  <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
                  <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
                  <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
                  <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
                  <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
                  <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
                  <ConversationItem
                  name="Luana de Paula"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread" >
            <ScrollArea className="h-full">
                <div className="space-y-4 p-4">
                    <ConversationItem
                    name="Victor Máximo"
                    lastMessage="Fala Lucas"
                    time="10:41"
                    />
                    <ConversationItem
                    name="Lucas Zerino"
                    lastMessage="Acabei de ver nos códigos..."
                    time="10:32"
                    />
                </div>
                </ScrollArea>
            </TabsContent>
          <TabsContent value="groups">
          <ScrollArea className="h-full">
              <div className="space-y-4 p-4">
                <ConversationItem
                  name="Bolt 360º"
                  lastMessage="Bom dia. Tá certo"
                  time="10:41"
                />
                <ConversationItem
                  name="WebApp Saas Bolt 360"
                  lastMessage="Acabei de ver nos códigos..."
                  time="10:32"
                />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
