import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import EmojiPicker from 'emoji-picker-react'
import { Button } from "@/components/ui/button"
import { Smile, Paperclip, Bold, Italic, Strikethrough, Send, Mic, Check, X } from 'lucide-react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import * as Tooltip from '@radix-ui/react-tooltip'
import useSendMessage from '@/hooks/useSendMessage'
import useConversation from "@/zustand/useConversation";
import { cn } from "@/lib/utils";

const TooltipButton = ({ onClick, icon, tooltip, isActive = false }) => (
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button 
          onClick={onClick ? () => onClick() : undefined} 
          className={`p-1 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200' : ''}`}
        >
          {icon}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg"
          sideOffset={5}
        >
          {tooltip}
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
)

const ChatInput = () => {
  const { selectedConversation } = useConversation();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { sendMessage, loading, status } = useSendMessage();
  const emojiPickerRef = useRef(null);
  const editorRef = useRef(null);
  

  const convertToWhatsAppFormat = (html) => {
    let whatsappText = html
      .replace(/<strong>(.*?)<\/strong>/g, '*$1*')
      .replace(/<em>(.*?)<\/em>/g, '_$1_')
      .replace(/ (.*?)<\/s>/g, '~$1~')
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n')
      .trim();
    return whatsappText;
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && !event.shiftKey && !(event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          handleSend();
          return true;
        }
        if (event.key === 'Enter' && (event.shiftKey || event.metaKey || event.ctrlKey)) {
          return false;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      if (editorRef.current) {
        editorRef.current.scrollTop = editorRef.current.scrollHeight;
      }
    },
  });

  const handleSend = useCallback(async () => {
    if (editor && selectedConversation) {
      const htmlContent = editor.getHTML();
      const whatsappFormattedMessage = convertToWhatsAppFormat(htmlContent);
      if (whatsappFormattedMessage && whatsappFormattedMessage.trim() !== '') {
        await sendMessage(whatsappFormattedMessage);
        editor.commands.clearContent();
      }
    }
  }, [editor, sendMessage, selectedConversation]);

  const toggleFormat = useCallback((format) => {
    if (editor && editor.isEditable) {
      editor.chain().focus()[format]().run();
    }
  }, [editor]);

  const addEmoji = useCallback((emoji) => {
    if (editor && editor.isEditable) {
      editor.chain().focus().insertContent(emoji.native).run();
      setShowEmojiPicker(false);
    }
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderSendButton = () => {
    switch (status) {
      case 'success':
        return <Check className="text-green-500" />;
      case 'error':
        return <X className="text-red-500" />;
      default:
        return <Send />;
    }
  };

  const buttonIcon = () => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'error':
        return <X className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  const buttonColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md relative">
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute bottom-full left-0 mb-2 z-10"
        >
          <Picker data={data} onEmojiSelect={addEmoji} />
        </div>
      )}
      <div className="flex items-center p-2">
        <div className="flex space-x-2 mr-2">
          <TooltipButton
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            icon={<Smile size={20} />}
            tooltip="Emojis"
          />
          <TooltipButton
            icon={<Paperclip size={20} />}
            tooltip="Anexar arquivo"
          />
          <TooltipButton
            onClick={() => toggleFormat('toggleBold')}
            icon={<Bold size={20} />}
            tooltip="Negrito"
            isActive={editor.isActive('bold')}
          />
          <TooltipButton
            onClick={() => toggleFormat('toggleItalic')}
            icon={<Italic size={20} />}
            tooltip="Itálico"
            isActive={editor.isActive('italic')}
          />
          <TooltipButton
            onClick={() => toggleFormat('toggleStrike')}
            icon={<Strikethrough size={20} />}
            tooltip="Tachado"
            isActive={editor.isActive('strike')}
          />
        </div>
        <div className="flex-grow relative border rounded-lg">
          <div 
            ref={editorRef}
            className="min-h-[24px] max-h-[120px] py-1 px-2 overflow-y-auto"
          >
            <EditorContent editor={editor} />
          </div>
          {!editor.getText() && (
            <span className="absolute top-1 left-2 text-gray-400 pointer-events-none">
              Digite uma mensagem
            </span>
          )}
        </div>
        <div className="flex space-x-2 ml-2">
            <TooltipButton
                onClick={handleSend}  // A função que será chamada ao clicar
                icon={buttonIcon()}    // Usa o ícone atual gerado pela função buttonIcon()
                tooltip="Enviar mensagem"  // Texto exibido no Tooltip
            />
          <TooltipButton
            icon={<Mic size={20} />}
            tooltip="Mensagem de voz"
          />
        </div>
      </div>
    </div>
  )
}

export default ChatInput;