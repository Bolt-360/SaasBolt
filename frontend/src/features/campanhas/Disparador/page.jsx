'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Send, Download, PlayCircle } from 'lucide-react'
import { Switch } from "@/components/ui/switch"

export default function Disparador() {
  const [mensagens, setMensagens] = useState([''])
  const [inicioImediato, setInicioImediato] = useState(false)

  const handleAddMensagem = () => {
    if (mensagens.length < 3) {
      setMensagens([...mensagens, ''])
    }
  }

  const handleMensagemChange = (index, value) => {
    const novasMensagens = [...mensagens]
    novasMensagens[index] = value
    setMensagens(novasMensagens)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Lógica para enviar o formulário
    console.log('Formulário enviado')
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      // Lógica para processar o arquivo CSV
      console.log('Arquivo selecionado:', file.name)
    }
  }

  const handleDownloadModelo = () => {
    // Lógica para baixar o arquivo modelo
    console.log('Baixando arquivo modelo')
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto mb-6"> 
          <Card className="max-h-[calc(100vh-10rem)] overflow-y-auto">
            <CardHeader>
              <CardTitle>Nova Campanha</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Campanha</Label>
                  <Input id="nome" placeholder="Digite o nome da campanha" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Campanha</Label>
                  <Select>
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo de campanha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensagem">Mensagem</SelectItem>
                      <SelectItem value="mensagem_imagem">Mensagem + Imagem</SelectItem>
                      <SelectItem value="mensagem_documento">Mensagem + Documento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="inicio-imediato"
                    checked={inicioImediato}
                    onCheckedChange={setInicioImediato}
                  />
                  <Label htmlFor="inicio-imediato">Início Imediato</Label>
                </div>

                {!inicioImediato && (
                  <div className="space-y-2">
                    <Label htmlFor="data-inicio">Data de Início</Label>
                    <Input id="data-inicio" type="datetime-local" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="intervalo">Intervalo entre Mensagens (segundos)</Label>
                  <Input id="intervalo" type="number" min="1" placeholder="Ex: 30" />
                </div>

                {mensagens.map((mensagem, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`mensagem-${index}`}>Mensagem {index + 1}</Label>
                    <Textarea
                      id={`mensagem-${index}`}
                      placeholder={`Digite a mensagem ${index + 1}`}
                      value={mensagem}
                      onChange={(e) => handleMensagemChange(index, e.target.value)}
                    />
                  </div>
                ))}

                {mensagens.length < 3 && (
                  <Button type="button" onClick={handleAddMensagem} variant="outline">
                    Adicionar Mensagem
                  </Button>
                )}

                <div className="space-y-2">
                  <Label htmlFor="csv">Arquivo CSV com números e variáveis</Label>
                  <Input id="csv" type="file" accept=".csv" onChange={handleFileUpload} />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button type="button" onClick={handleDownloadModelo} variant="outline" className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Modelo CSV
                  </Button>

                  <Button type="submit" className="w-full sm:w-auto">
                    {inicioImediato ? (
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
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
