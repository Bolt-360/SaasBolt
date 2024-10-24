import { useState, useRef, useCallback } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Bold, Italic, Smile } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { Picker } from 'emoji-mart'; // Certifique-se de que o emoji-mart esteja instalado
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAuthContext } from '@/context/AuthContext';

export default function StepMessages({ formData, handleInputChange, csvVariables }) {
  const { authUser } = useAuthContext();
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const textareaRefs = useRef([]);
  const editorRef = useRef(null);
  const [emojiPickers, setEmojiPickers] = useState({});

  // Remova a primeira coluna (número do contato) das variáveis CSV
  const availableVariables = csvVariables.slice(1);

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

  const handleMensagemChange = (index, field, value) => {
    const novasMensagens = [...formData.mensagens];
    if (field === 'principal') {
      novasMensagens[index].principal = value;
    } else {
      novasMensagens[index].alternativas[field] = value;
    }
    handleInputChange('mensagens', novasMensagens);
  };

  const handleAddMensagem = () => {
    if (formData.mensagens.length < 3) {
      handleInputChange('mensagens', [...formData.mensagens, { principal: '', alternativas: ['', ''] }]);
    }
  };

  const handleRemoveMensagem = (index) => {
    if (formData.mensagens.length > 1 && index !== 0) {
      const novasMensagens = formData.mensagens.filter((_, i) => i !== index);
      handleInputChange('mensagens', novasMensagens);
      if (activeMessageIndex >= index) {
        setActiveMessageIndex(prev => prev - 1);
      }
    }
  };

  const handleDragStart = (e, variable) => {
    e.dataTransfer.setData('text/plain', `{{${variable}}}`);
  };

  const handleDrop = (e, index, field) => {
    e.preventDefault();
    const variable = e.dataTransfer.getData('text/plain');
    const textarea = textareaRefs.current[`${index}-${field}`];
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      handleMensagemChange(index, field, `${before}${variable}${after}`);
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const applyTextFormat = (index, field, format) => {
    const textarea = textareaRefs.current[`${index}-${field}`];
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      let formattedText = selectedText;

      if (format === 'bold') {
        formattedText = `**${selectedText}**`;
      } else if (format === 'italic') {
        formattedText = `*${selectedText}*`;
      }

      handleMensagemChange(index, field, `${textarea.value.substring(0, start)}${formattedText}${textarea.value.substring(end)}`);
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }
  };

  const toggleEmojiPicker = (index, field) => {
    setEmojiPickers(prev => ({ ...prev, [`${index}-${field}`]: !prev[`${index}-${field}`] }));
  };

  const addEmoji = (index, field, emoji) => {
    const textarea = textareaRefs.current[`${index}-${field}`];
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      handleMensagemChange(index, field, `${before}${emoji.native}${after}`);
      textarea.focus();
      textarea.setSelectionRange(start + emoji.native.length, start + emoji.native.length);
    }
  };

  const handleSend = useCallback(async () => {
    if (editor && authUser?.activeWorkspaceId) {
      const htmlContent = editor.getHTML();
      const whatsappFormattedMessage = convertToWhatsAppFormat(htmlContent);
      if (whatsappFormattedMessage && whatsappFormattedMessage.trim() !== '') {
        try {
          console.log('whatsappFormattedMessage', whatsappFormattedMessage)
        } catch (error) {
          console.error('Error sending message:', error);
          // You might want to show an error toast here
        }
      }
    } else {
      console.error('Cannot send message: Missing conversation or workspace');
      // You might want to show an error toast here
    }
  }, [editor, authUser]);
  

  if (!editor) {
    return <div>Loading editor...</div>
  }


  return (
    <div className="space-y-4">
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Variáveis Disponíveis</AlertTitle>
        <AlertDescription>
          Arraste e solte as variáveis abaixo para incluí-las em suas mensagens.
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-2 mb-4">
        {availableVariables.map((variable, index) => (
          <Badge
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, variable)}
            className="cursor-move"
          >
            {variable}
          </Badge>
        ))}
      </div>
      {formData.mensagens.map((mensagem, index) => (
        <div key={index} className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Mensagem {index + 1}</h3>
            {index !== 0 && (
              <Button
                type="button"
                onClick={() => handleRemoveMensagem(index)}
                variant="ghost"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Tabs defaultValue="principal">
            <TabsList>
              <TabsTrigger value="principal">Principal</TabsTrigger>
              <TabsTrigger value="alternativa1">Alternativa 1</TabsTrigger>
              <TabsTrigger value="alternativa2">Alternativa 2</TabsTrigger>
            </TabsList>
            <TabsContent value="principal">
              <div className="flex gap-2 mb-2">
                <Button size="sm" onClick={() => applyTextFormat(index, 'principal', 'bold')}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => applyTextFormat(index, 'principal', 'italic')}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => toggleEmojiPicker(index, 'principal')}>
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-grow relative border rounded-lg">
          <div 
            className="min-h-[24px] max-h-[120px] py-1 px-2 overflow-y-auto"
            style={{
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
                }}
              >
                <EditorContent editor={editor} />
              </div>
              {!editor.getText() && (
                <span className="absolute top-1 left-2 text-gray-400 pointer-events-none">
                  Digite uma mensagem
                </span>
              )}
              </div>

              {/* 
              Text área antigo 
              <Textarea
                ref={el => textareaRefs.current[`${index}-principal`] = el}
                placeholder={`Digite a mensagem principal ${index + 1}`}
                value={mensagem.principal}
                onChange={(e) => handleMensagemChange(index, 'principal', e.target.value)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index, 'principal')}
                required={index === 0}
              />

              */}

              {emojiPickers[`${index}-principal`] && (
                <Picker onSelect={(emoji) => addEmoji(index, 'principal', emoji)} />
              )}
            </TabsContent>
            <TabsContent value="alternativa1">
              <div className="flex gap-2 mb-2">
                <Button size="sm" onClick={() => applyTextFormat(index, 0, 'bold')}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => applyTextFormat(index, 0, 'italic')}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => toggleEmojiPicker(index, 0)}>
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                ref={el => textareaRefs.current[`${index}-0`] = el}
                placeholder={`Digite a mensagem alternativa 1 para a mensagem ${index + 1}`}
                value={mensagem.alternativas[0]}
                onChange={(e) => handleMensagemChange(index, 0, e.target.value)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index, 0)}
                required={index === 0}
              />
              {emojiPickers[`${index}-0`] && (
                <Picker onSelect={(emoji) => addEmoji(index, 0, emoji)} />
              )}
            </TabsContent>
            <TabsContent value="alternativa2">
              <div className="flex gap-2 mb-2">
                <Button size="sm" onClick={() => applyTextFormat(index, 1, 'bold')}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => applyTextFormat(index, 1, 'italic')}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => toggleEmojiPicker(index, 1)}>
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                ref={el => textareaRefs.current[`${index}-1`] = el}
                placeholder={`Digite a mensagem alternativa 2 para a mensagem ${index + 1}`}
                value={mensagem.alternativas[1]}
                onChange={(e) => handleMensagemChange(index, 1, e.target.value)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index, 1)}
                required={index === 0}
              />
              {emojiPickers[`${index}-1`] && (
                <Picker onSelect={(emoji) => addEmoji(index, 1, emoji)} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      ))}
      <Button type="button" onClick={handleAddMensagem}>
        <Plus className="h-4 w-4" /> Adicionar Mensagem
      </Button>
    </div>
  );
}
