import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Bold, Italic, Smile } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useAuthContext } from '@/context/AuthContext';
import DynamicEditor from './DynamicEditor';

export default function StepMessages({ formData, handleInputChange, csvVariables }) {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const editorRefs = useRef({}); // Armazena referências separadas para cada aba
  const [emojiPickers, setEmojiPickers] = useState({});

  const availableVariables = csvVariables.slice(1);

  const handleMensagemChange = (index, field, value) => {
    const novasMensagens = [...formData.mensagens];
    if (field === 'principal') {
      novasMensagens[index].principal = value;
    } else {
      const alternativaIndex = field === 'alternativa1' ? 0 : 1;
      novasMensagens[index].alternativas[alternativaIndex] = value;
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

  const toggleEmojiPicker = (index, field) => {
    setEmojiPickers(prev => ({ ...prev, [`${index}-${field}`]: !prev[`${index}-${field}`] }));
  };

  const addEmoji = (emoji, index, field) => {
    const editorInstance = editorRefs.current[`${index}-${field}`];
    if (editorInstance) {
      editorInstance.commands.insertContent(emoji.native);
    } else {
      console.log("Editor não encontrado para o índice:", index, "e aba:", field);
    }
  };

  const setEditorRef = (el, index, field) => {
    if (el) {
      editorRefs.current[`${index}-${field}`] = el;
    }
  };

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
            {['principal', 'alternativa1', 'alternativa2'].map((field) => (
              <TabsContent value={field} key={field}>
                <DynamicEditor
                  ref={(el) => setEditorRef(el, index, field)}
                  content={field === 'principal' ? mensagem.principal : mensagem.alternativas[field === 'alternativa1' ? 0 : 1]}
                  onContentChange={(value) => handleMensagemChange(index, field, value)}
                />
                <br/>
                <div className="flex gap-2 mb-2">
                  <div
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
                    onClick={() => applyTextFormat(index, field, 'bold')}
                  >
                    <Bold className="h-4 w-4" />
                  </div>
                  <div
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
                    onClick={() => applyTextFormat(index, field, 'italic')}
                  >
                    <Italic className="h-4 w-4" />
                  </div>
                  <div
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
                    onClick={() => toggleEmojiPicker(index, field)}
                  >
                    <Smile className="h-4 w-4" />
                  </div>
                </div>
                {emojiPickers[`${index}-${field}`] && (
                  <Picker data={data} onEmojiSelect={(emoji) => addEmoji(emoji, index, field)} />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ))}
      <Button type="button" onClick={handleAddMensagem} variant="outline" className="w-full">
        <Plus className="mr-2" /> Adicionar Mensagem
      </Button>
    </div>
  );
}
