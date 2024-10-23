'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Send, Download, PlayCircle, ArrowLeft, ArrowRight, Info, MessageSquare, Calendar, Upload, CheckCircle, Plus, Trash2, X } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { useInstancesFetch } from '@/hooks/useInstancesFetch';
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const steps = [
  { title: "Informações Básicas", icon: Info },
  { title: "Importação de Contatos", icon: Upload },
  { title: "Configuração de Mensagens", icon: MessageSquare },
  { title: "Agendamento", icon: Calendar },
  { title: "Revisão e Confirmação", icon: CheckCircle }
];

const fileTypes = {
  'mensagem_imagem': {
    accept: '.png,.jpg,.jpeg,.gif,.webp',
    description: 'Imagens (PNG, JPG, JPEG, GIF, WEBP)'
  },
  'mensagem_documento': {
    accept: '.pdf,.zip,.xlsx,.docx',
    description: 'Documentos (PDF, ZIP, XLSX, DOCX)'
  },
  'audio': {
    accept: '.mp3,.wav,.ogg',
    description: 'Áudio (MP3, WAV, OGG)'
  }
}

export default function Disparador() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    instancia: '',
    csvFile: null,
    mensagens: [{ principal: '', alternativas: ['', ''] }],
    inicioImediato: false,
    dataInicio: '',
    intervalo: '',
    arquivo: null // Novo campo para o arquivo adicional
  })
  const [isNextDisabled, setIsNextDisabled] = useState(true)
  const { instances, isLoading, error } = useInstancesFetch();
  const openInstances = instances.filter(instance => instance.connectionStatus === "open");
  const [csvVariables, setCsvVariables] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRefs = useRef({})
  const { toast } = useToast()

  useEffect(() => {
    if (currentStep === 0) {
      const isStepOneComplete = formData.nome && formData.tipo && formData.instancia &&
        (formData.tipo === 'mensagem' || (formData.tipo !== 'mensagem' && formData.arquivo))
      setIsNextDisabled(!isStepOneComplete)
    } else if (currentStep === 1) {
      setIsNextDisabled(!formData.csvFile)
    } else if (currentStep === 2) {
      const isStepThreeComplete = formData.mensagens.some(msg => msg.principal.trim() !== '')
      setIsNextDisabled(!isStepThreeComplete)
    }
  }, [currentStep, formData])

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleFileUpload = (event, field, accept) => {
    const file = event.target.files?.[0]
    if (file) {
      if (isValidFileType(file, accept)) {
        setFormData(prev => ({ ...prev, [field]: file }))
      } else {
        toast({
          title: "Tipo de arquivo inválido",
          description: `Por favor, selecione um arquivo do tipo correto: ${fileTypes[formData.tipo].description}`,
          variant: "destructive",
        })
        event.target.value = '' // Limpa o input de arquivo
      }
    }
  }

  const handleDownloadModelo = () => {
    const csvContent = "numero,nome\n5584988887777,João Silva\n5584999998888,Maria Santos"
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "modelo_contatos.csv")
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleMensagemChange = (index, field, value) => {
    const novasMensagens = [...formData.mensagens]
    if (field === 'principal') {
      novasMensagens[index].principal = value
    } else {
      novasMensagens[index].alternativas[field] = value
    }
    setFormData({ ...formData, mensagens: novasMensagens })
  }

  const handleAddMensagem = () => {
    if (formData.mensagens.length < 3) {
      setFormData({
        ...formData,
        mensagens: [...formData.mensagens, { principal: '', alternativas: ['', ''] }]
      })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Formulário enviado', formData)
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const handleRemoveMensagem = (index) => {
    if (formData.mensagens.length > 1 && index !== 0) {
      const novasMensagens = formData.mensagens.filter((_, i) => i !== index)
      setFormData({ ...formData, mensagens: novasMensagens })
    }
  }

  const handleDragStart = (e, variable) => {
    e.dataTransfer.setData('text/plain', `{{${variable}}}`)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, field, accept) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (isValidFileType(file, accept)) {
        setFormData(prev => ({ ...prev, [field]: file }))
      } else {
        toast({
          title: "Tipo de arquivo inválido",
          description: `Por favor, selecione um arquivo do tipo correto: ${fileTypes[formData.tipo].description}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleRemoveFile = (field) => {
    setFormData(prev => ({ ...prev, [field]: null }))
    if (fileInputRefs.current[field]) {
      fileInputRefs.current[field].value = '' // Limpa o input de arquivo
    }
    toast({
      title: "Arquivo removido",
      description: "O arquivo foi removido com sucesso.",
    })
  }

  const renderFileUpload = (field, label, accept) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={field}>{label}*</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tipos de arquivo aceitos: {fileTypes[formData.tipo].description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div 
          className={cn(
            "border-2 border-dashed rounded-md p-4 text-center cursor-pointer relative",
            isDragging ? "border-primary bg-primary/10" : "border-gray-300",
            formData[field] ? "bg-green-100" : ""
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, field, accept)}
          onClick={() => fileInputRefs.current[field]?.click()}
        >
          <input
            ref={el => fileInputRefs.current[field] = el}
            type="file"
            id={field}
            className="hidden"
            onChange={(e) => handleFileUpload(e, field, accept)}
            accept={accept}
          />
          {formData[field] ? (
            <>
              <p className="text-green-600">Arquivo carregado: {formData[field].name}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile(field)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p>Arraste e solte o {label.toLowerCase()} aqui, ou clique para selecionar</p>
              <p className="text-sm text-gray-500 mt-2">{fileTypes[formData.tipo].description}</p>
            </>
          )}
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Campanha*</Label>
              <Input 
                id="nome" 
                placeholder="Digite o nome da campanha" 
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Campanha*</Label>
              <Select onValueChange={(value) => handleInputChange('tipo', value)} required>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione o tipo de campanha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensagem">Mensagem</SelectItem>
                  <SelectItem value="mensagem_imagem">Mensagem + Imagem</SelectItem>
                  <SelectItem value="mensagem_documento">Mensagem + Documento</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.tipo && formData.tipo !== 'mensagem' && (
              renderFileUpload(
                'arquivo',
                formData.tipo === 'mensagem_imagem' ? 'Imagem' :
                formData.tipo === 'mensagem_documento' ? 'Documento' : 'Áudio',
                formData.tipo === 'mensagem_imagem' ? 'image/*' :
                formData.tipo === 'mensagem_documento' ? '.pdf,.doc,.docx' : 'audio/*'
              )
            )}
            <div className="space-y-2">
              <Label htmlFor="instancia">Instância*</Label>
              {isLoading ? (
                <p>Carregando instâncias...</p>
              ) : error ? (
                <p className="text-red-500">Erro ao carregar instâncias: {error}</p>
              ) : openInstances.length === 0 ? (
                <p>Nenhuma instância conectada disponível</p>
              ) : (
                <Select onValueChange={(value) => handleInputChange('instancia', value)} required>
                  <SelectTrigger id="instancia">
                    <SelectValue placeholder="Selecione a instância" />
                  </SelectTrigger>
                  <SelectContent>
                    {openInstances.map((instance) => (
                      <SelectItem key={instance.id} value={instance.id}>
                        {instance.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </>
        )
      case 1:
        return (
          <>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Importação de Contatos</AlertTitle>
              <AlertDescription>
                Faça o upload de um arquivo CSV contendo os números e nomes dos contatos.
                O arquivo deve ter duas colunas: "numero" e "nome".
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <Button type="button" onClick={handleDownloadModelo} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Baixar Modelo CSV
              </Button>
              {renderFileUpload('csvFile', 'arquivo CSV', '.csv')}
            </div>
          </>
        )
      case 2:
        return (
          <>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Variáveis Disponíveis</AlertTitle>
              <AlertDescription>
                Arraste e solte as variáveis abaixo para incluí-las em suas mensagens.
              </AlertDescription>
            </Alert>
            <div className="mb-4 flex flex-wrap gap-2">
              {csvVariables.map((variable, index) => (
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
                <h3 className="text-lg font-semibold">Mensagem {index + 1}</h3>
                <Tabs defaultValue="principal" className="relative">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="principal">Principal</TabsTrigger>
                      <TabsTrigger value="alternativa1">Alternativa 1</TabsTrigger>
                      <TabsTrigger value="alternativa2">Alternativa 2</TabsTrigger>
                    </TabsList>
                    {index !== 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              type="button" 
                              onClick={() => handleRemoveMensagem(index)} 
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir mensagem</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <TabsContent value="principal">
                    <Textarea
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
                      placeholder={`Digite a mensagem alternativa 1 para a mensagem ${index + 1}`}
                      value={mensagem.alternativas[0]}
                      onChange={(e) => handleMensagemChange(index, 0, e.target.value)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index, 0)}
                    />
                  </TabsContent>
                  <TabsContent value="alternativa2">
                    <Textarea
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
          </>
        )
      case 3:
        return (
          <>
            <div className="flex items-center space-x-2">
              <Switch
                id="inicio-imediato"
                checked={formData.inicioImediato}
                onCheckedChange={(checked) => handleInputChange('inicioImediato', checked)}
              />
              <Label htmlFor="inicio-imediato">Início Imediato</Label>
            </div>
            {!formData.inicioImediato && (
              <div className="space-y-2">
                <Label htmlFor="data-inicio">Data de Início</Label>
                <Input 
                  id="data-inicio" 
                  type="datetime-local" 
                  value={formData.dataInicio}
                  onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="intervalo">Intervalo entre Mensagens (segundos)</Label>
              <Input 
                id="intervalo" 
                type="number" 
                min="1" 
                placeholder="Ex: 30" 
                value={formData.intervalo}
                onChange={(e) => handleInputChange('intervalo', e.target.value)}
              />
            </div>
          </>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Revisão da Campanha</h3>
            <p><strong>Nome:</strong> {formData.nome}</p>
            <p><strong>Tipo:</strong> {formData.tipo}</p>
            <p><strong>Mensagens:</strong> {formData.mensagens.length}</p>
            <p><strong>Início Imediato:</strong> {formData.inicioImediato ? 'Sim' : 'Não'}</p>
            {!formData.inicioImediato && <p><strong>Data de Início:</strong> {formData.dataInicio}</p>}
            <p><strong>Intervalo:</strong> {formData.intervalo} segundos</p>
            <p><strong>Arquivo CSV:</strong> {formData.csvFile ? formData.csvFile.name : 'Não selecionado'}</p>
          </div>
        )
      default:
        return null
    }
  }

  const isValidFileType = (file, acceptedTypes) => {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    return acceptedTypes.split(',').some(type => fileExtension === type.trim())
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Campanha - {steps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-6 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center z-10">
                  <div className={cn(
                    "rounded-full p-2 bg-white border-2",
                    index <= currentStep
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-300"
                  )}>
                    <step.icon size={24} />
                  </div>
                  <div className={cn(
                    "mt-2 text-xs",
                    index <= currentStep ? "text-primary" : "text-gray-500"
                  )}>
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderStep()}
              <div className="flex justify-between mt-6">
                <Button type="button" onClick={prevStep} disabled={currentStep === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep} disabled={currentStep === 0 && isNextDisabled}>
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit">
                    {formData.inicioImediato ? (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Iniciar Campanha
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Agendar Campanha
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
