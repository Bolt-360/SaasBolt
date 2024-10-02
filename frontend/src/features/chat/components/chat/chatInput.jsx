import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SendIcon, MicIcon, SmileIcon, PaperclipIcon, BoldIcon, ItalicIcon, StrikethroughIcon } from "lucide-react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const MAX_LINES = 7;

export default function ChatInput() {
    const [message, setMessage] = useState("");
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        strikethrough: false
    });
    const inputRef = useRef(null);

    useEffect(() => {
        adjustTextareaHeight();
    }, [message]);

    const adjustTextareaHeight = () => {
        const textarea = inputRef.current;
        if (!textarea) return;

        textarea.style.height = 'auto';
        const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
        const lines = textarea.scrollHeight / lineHeight;

        if (lines <= MAX_LINES) {
            textarea.style.height = `${textarea.scrollHeight}px`;
            textarea.style.overflowY = 'hidden';
        } else {
            textarea.style.height = `${lineHeight * MAX_LINES}px`;
            textarea.style.overflowY = 'auto';
        }
    };

    const handleEmojiSelect = (emoji) => {
        insertTextAtCursor(emoji.native);
    };

    const insertTextAtCursor = (text) => {
        const textarea = inputRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newMessage = message.substring(0, start) + text + message.substring(end);
        setMessage(newMessage);
        
        // Ajusta o cursor após a inserção
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
            textarea.focus();
        }, 0);
    };

    const formatText = (format) => {
        const textarea = inputRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const symbol = format === 'bold' ? '*' : format === 'italic' ? '_' : '~';

        if (activeFormats[format]) {
            const newMessage = message.replace(new RegExp(`\\${symbol}(.*?)\\${symbol}`, 'g'), '$1');
            setMessage(newMessage);
            textarea.setSelectionRange(start - symbol.length, end - symbol.length);
        } else {
            const selectedText = message.substring(start, end);
            const formattedText = `${symbol}${selectedText}${symbol}`;
            const newMessage = message.substring(0, start) + formattedText + message.substring(end);
            setMessage(newMessage);
            textarea.setSelectionRange(start + symbol.length, end + symbol.length);
        }

        setActiveFormats(prev => ({ ...prev, [format]: !prev[format] }));
        textarea.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = () => {
        console.log("Mensagem enviada:", processMessage(message));
        setMessage('');
        setActiveFormats({ bold: false, italic: false, strikethrough: false });
    };

    const processMessage = (text) => {
        text = text.replace(/\n/g, '<br>');
        text = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        text = text.replace(/_(.*?)_/g, '<em>$1</em>');
        text = text.replace(/~(.*?)~/g, '<del>$1</del>');
        return text;
    };

    return (
        <TooltipProvider>
            <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <SmileIcon className="w-5 h-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                                </PopoverContent>
                            </Popover>
                        </TooltipTrigger>
                        <TooltipContent>Adicionar emoji</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <PaperclipIcon className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Anexar arquivo</TooltipContent>
                    </Tooltip>

                    <div className="flex space-x-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant={activeFormats.bold ? "secondary" : "ghost"} 
                                    size="icon" 
                                    onClick={() => formatText('bold')}
                                >
                                    <BoldIcon className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Negrito</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant={activeFormats.italic ? "secondary" : "ghost"} 
                                    size="icon" 
                                    onClick={() => formatText('italic')}
                                >
                                    <ItalicIcon className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Itálico</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant={activeFormats.strikethrough ? "secondary" : "ghost"} 
                                    size="icon" 
                                    onClick={() => formatText('strikethrough')}
                                >
                                    <StrikethroughIcon className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Tachado</TooltipContent>
                        </Tooltip>
                    </div>

                    <textarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 border rounded p-2 min-h-[50px] outline-none resize-none"
                        onKeyDown={handleKeyDown}
                        placeholder="Digite uma mensagem"
                        rows={1}
                    />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={sendMessage}
                            >
                                <SendIcon className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Enviar mensagem</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <MicIcon className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Gravar áudio</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    );
}