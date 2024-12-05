'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaFileInvoiceDollar } from 'react-icons/fa'

const CriarDisparo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const titulo = formData.get('titulo')
    const valor = formData.get('valor')
    const vencimento = formData.get('vencimento')

    try {
      // Simular uma requisição
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Criando campanha de boletos:', { titulo, valor, vencimento })
      
      toast({
        title: "Campanha criada com sucesso",
        description: "Sua campanha de boletos foi criada e está pronta para ser enviada.",
      })
    } catch (error) {
      console.error('Erro ao criar campanha:', error)
      toast({
        title: "Erro ao criar campanha",
        description: "Ocorreu um erro ao criar a campanha. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100/40 dark:bg-gray-800/40">
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FaFileInvoiceDollar className="w-6 h-6" />
                <div>
                  <CardTitle>Nova Campanha de Boletos</CardTitle>
                  <CardDescription>Crie uma nova campanha para envio de boletos em massa.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título da Campanha</Label>
                    <Input
                      id="titulo"
                      name="titulo"
                      placeholder="Ex: Cobrança Mensal Abril/2024"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor Padrão (R$)</Label>
                    <Input
                      id="valor"
                      name="valor"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="vencimento">Data de Vencimento</Label>
                    <Input
                      id="vencimento"
                      name="vencimento"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="mensagem">Mensagem Personalizada</Label>
                    <Input
                      id="mensagem"
                      name="mensagem"
                      placeholder="Mensagem que será enviada junto com o boleto"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Criando Campanha...' : 'Criar Campanha de Boletos'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-muted-foreground">
                Após criar a campanha, você poderá importar sua lista de contatos e personalizar os valores individualmente.
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CriarDisparo 