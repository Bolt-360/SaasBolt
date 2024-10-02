import ChatHeader from "./chatHeader";
import ChatInput from "./chatInput";
import { Message } from "../message";

export default function Chat() {
    return(
        <div className="flex-1 flex flex-col">
            <ChatHeader />
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    <Message
                        text="Use o WhatsApp no seu computador?"
                        timestamp="09:22"
                        isUser={false}
                        hasImage={false}
                    />
                    <Message
                        text="Opa, como vai?"
                        timestamp="09:23"
                        isUser={true}
                        hasImage={false}
                    />
                </div>
            </div>
            <ChatInput />
        </div>
    )
}