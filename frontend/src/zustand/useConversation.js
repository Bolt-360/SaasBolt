import { create } from "zustand"

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  conversations: [],
  setConversations: (conversations) => set({ conversations }),

  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  updateConversationWithNewMessage: (newMessage) => set((state) => ({
    conversations: state.conversations.map(conv => 
      conv.id === newMessage.conversationId 
        ? { ...conv, lastMessage: newMessage }
        : conv
    )
  })),
}))

export default useConversation
