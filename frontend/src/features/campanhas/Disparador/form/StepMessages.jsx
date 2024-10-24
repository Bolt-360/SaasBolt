import { useState, useRef } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'

export default function StepMessages({ formData, handleInputChange, csvVariables }) {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0)
  const textareaRefs = useRef([])

  // Remova a primeira coluna (número do contato) das variáveis CSV
  const availableVariables = csvVariables.slice(1)

  const handleMensagemChange = (index, field, value) => {
    const novasMensagens = [...formData.mensagens]
    if (field === 'principal') {
      novasMensagens[index].principal = value
    } else {
      novasMensagens[index].alternativas[field] = value
    }
    handleInputChange('mensagens', novasMensagens)
  }

  const handleAddMensagem = () => {
    if (formData.mensagens.length < 3) {
      handleInputChange('mensagens', [...formData.mensagens, { principal: '', alternativas: ['', ''] }])
    }
  }

  const handleRemoveMensagem = (index) => {
    if (formData.mensagens.length > 1 && index !== 0) {
      const novasMensagens = formData.mensagens.filter((_, i) => i !== index)
      handleInputChange('mensagens', novasMensagens)
      if (activeMessageIndex >= index) {
        setActiveMessageIndex(prev => prev - 1)
      }
    }
  }

  const handleDragStart = (e, variable) => {
    e.dataTransfer.setData('text/plain', `{{${variable}}}`)
  }

  const handleDrop = (e, index, field) => {
    e.preventDefault()
    const variable = e.dataTransfer.getData('text/plain')
    const textarea = textareaRefs.current[`${index}-${field}`]
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      const before = text.substring(0, start)
      const after = text.substring(end, text.length)
      handleMensagemChange(index, field, `${before}${variable}${after}`)
      textarea.focus()
      textarea.setSelectionRange(start + variable.length, start + variable.length)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
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
              <Textarea
                ref={el => textareaRefs.current[`${index}-principal`] = el}
                placeholder={`Digite a mensagem principal ${index + 1}`}
                value={mensagem.principal}
                onChange={(e) => handleMensagemChange(index, 'principal', e.target.value)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index, 'principal')}
                required={index === 0}
              />
            </TabsContent>
            <TabsContent value="alternativa1">
              <Textarea
                ref={el => textareaRefs.current[`${index}-0`] = el}
                placeholder={`Digite a mensagem alternativa 1 para a mensagem ${index + 1}`}
                value={mensagem.alternativas[0]}
                onChange={(e) => handleMensagemChange(index, 0, e.target.value)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index, 0)}
              />
            </TabsContent>
            <TabsContent value="alternativa2">
              <Textarea
                ref={el => textareaRefs.current[`${index}-1`] = el}
                placeholder={`Digite a mensagem alternativa 2 para a mensagem ${index + 1}`}
                value={mensagem.alternativas[1]}
                onChange={(e) => handleMensagemChange(index, 1, e.target.value)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index, 1)}
              />
            </TabsContent>
          </Tabs>
        </div>
      ))}
      {formData.mensagens.length < 3 && (
        <Button type="button" onClick={handleAddMensagem} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Mensagem
        </Button>
      )}
    </div>
  )
}
