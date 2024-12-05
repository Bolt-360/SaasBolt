import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useRef, useState } from 'react';
import DynamicEditor from './DynamicEditor';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const variaveisFixas = [
  { label: "CPF", value: "{{CPF}}" },
  { label: "Primeiro Nome", value: "{{PrimeiroNome}}" },
  { label: "Nome Completo", value: "{{NomeCompleto}}" },
  { label: "Valor Boleto", value: "{{ValorBoleto}}" },
  { label: "Placa Veículo", value: "{{PlacaVeiculo}}" },
  { label: "Data de Vencimento", value: "{{DataVencimento}}" },
];

export default function StepMessages({ formData, handleInputChange }) {
  const editorRef = useRef(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const handleMensagemChange = (value) => {
    handleInputChange('mensagens', [{ principal: value }]);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(prev => !prev);
  };

  const addEmoji = (emoji) => {
    const editorInstance = editorRef.current;
    if (editorInstance) {
      editorInstance.commands.insertContent(emoji.native);
    } else {
      console.log("Editor não encontrado");
    }
  };

  const addVariable = (variable) => {
    const editorInstance = editorRef.current;
    if (editorInstance) {
      editorInstance.commands.insertContent(variable);
    } else {
      console.log("Editor não encontrado");
    }
  };

  const setEditorRef = (el) => {
    if (el) {
      editorRef.current = el;
    }
  };

  const formatContent = (content) => {
    if (!content) return '';
    
    return content
      .replace(/<p><\/p>/g, '<br>')
      .replace(/<p>\s*<\/p>/g, '<br>')
      .replace(/(<br\s*\/?>\s*){2,}/g, '<br>')
      .trim();
  };

  return (
    <TooltipProvider>
      <div className="max-h-[calc(100vh-150px)] overflow-y-auto "> 
        <div className="space-y-4">
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">As variáveis abaixo são pré-definidas ( Em relação ao associado ou boleto ) e podem ser utilizadas para personalizar a mensagem:</h3>
            </div>
            <h3 className="text-sm">Clique e arraste para adicionar a variável desejada:</h3>
            <div className="flex space-x-2 mb-2">
              {variaveisFixas.map((variavel) => (
                <Button
                  key={variavel.value}
                  onClick={() => addVariable(variavel.value)}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', variavel.value)}
                  variant="outline"
                  size="sm"
                >
                  {variavel.label}
                </Button>
              ))}
            </div>
            <DynamicEditor
              ref={setEditorRef}
              content={formData.mensagens[0].principal}
              onContentChange={handleMensagemChange}
              editorProps={{
                handleDrop: (view, event) => {
                  const data = event.dataTransfer.getData('text/plain');
                  if (data) {
                    view.editor.commands.insertContent(data);
                  }
                  event.preventDefault();
                },
                handleDragOver: (e) => e.preventDefault(),
              }}
            />
            {emojiPickerVisible && (
              <div className="relative">
                <Picker 
                  data={data} 
                  onEmojiSelect={addEmoji} 
                  style={{ position: 'absolute', zIndex: 10, width: '250px', height: '300px' }}
                />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="enviar-boleto-anexo"
                checked={formData.enviarBoletoAnexo}
                onCheckedChange={(checked) => handleInputChange('enviarBoletoAnexo', checked)}
              />
              <Label htmlFor="enviar-boleto-anexo">Enviar boleto em anexo (PDF)</Label>
            </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

