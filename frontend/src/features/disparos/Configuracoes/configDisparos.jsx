import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CopyIcon, Cross2Icon } from "@radix-ui/react-icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function ConfigDisparos() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedToken, setGeneratedToken] = useState('')
  const [vencimentos, setVencimentos] = useState([''])
  const [firstDay, setFirstDay] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')
    const token = formData.get('token')

    // Filtrar datas vazias e validar
    const datasVencimento = vencimentos.filter(data => data !== '').map(Number)
    const datasInvalidas = datasVencimento.filter(data => data < 1 || data > 31 || isNaN(data))

    if (datasInvalidas.length > 0) {
      toast({
        title: "Datas inválidas",
        description: "Todas as datas devem ser números entre 1 e 31.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Simular uma requisição de sincronização
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Sincronizando com:', { username, password, token, vencimentos: datasVencimento, firstDay })

      setGeneratedToken(Math.random().toString(36).substring(2, 15))

      toast({
        title: "Sincronização bem-sucedida",
        description: "Sua conexão foi sincronizada com sucesso.",
      })
    } catch (error) {
      console.error('Erro na sincronização:', error)
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um erro ao tentar sincronizar. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddVencimento = () => {
    setVencimentos([...vencimentos, ''])
  }

  const handleRemoveVencimento = (index) => {
    setVencimentos(vencimentos.filter((_, i) => i !== index))
  }

  const handleVencimentoChange = (index, value) => {
    const newValue = value.replace(/\D/g, '').slice(0, 2) // Permite apenas números e máximo 2 dígitos
    const newVencimentos = [...vencimentos]
    newVencimentos[index] = newValue
    setVencimentos(newVencimentos)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedToken)
    toast({
      title: "Token copiado",
      description: "O token foi copiado para a área de transferência.",
    })
  }

  return (
    <div className="flex items-start justify-center mb-10">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Definir Configurações</CardTitle>
          <CardDescription>Preencha suas credenciais para sincronizar a conexão e gerar um novo token.</CardDescription>
        </CardHeader>
        <CardContent className="max-h-[calc(100vh-24rem)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-gray-950 py-2">
                <Label>Datas de Vencimento</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddVencimento}
                >
                  Adicionar Data
                </Button>
              </div>
              <div className="space-y-2">
                {vencimentos.map((vencimento, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={vencimento}
                      onChange={(e) => handleVencimentoChange(index, e.target.value)}
                      placeholder="Dia do mês (1-31)"
                      className="flex-1"
                    />
                    {vencimentos.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveVencimento(index)}
                      >
                        <Cross2Icon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex items-center justify-between space-x-2 sticky bottom-0 bg-white dark:bg-gray-950 py-2">
              <Label htmlFor="first-day">Enviar todos os boletos no primeiro dia útil do mês</Label>
              <Switch
                id="first-day"
                checked={firstDay}
                onCheckedChange={setFirstDay}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}