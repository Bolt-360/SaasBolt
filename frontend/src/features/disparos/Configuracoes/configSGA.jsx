import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CopyIcon, Cross2Icon } from "@radix-ui/react-icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfigSGA() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedToken, setGeneratedToken] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')
    const token = formData.get('token')

    try {
      // Simular uma requisição de sincronização
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Sincronizando com:', { username, password, token})

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
          <CardTitle>Sincronizar Conexão</CardTitle>
          <CardDescription>Preencha suas credenciais para sincronizar a conexão e gerar um novo token.</CardDescription>
        </CardHeader>
        <CardContent className="max-h-[calc(100vh-24rem)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  name="username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="token">Token Atual</Label>
                <Input
                  id="token"
                  name="token"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sincronizando...' : 'Sincronizar Conexão'}
            </Button>
          </form>
        </CardContent>
        {generatedToken && (
          <CardFooter className="flex flex-col space-y-4 border-t">
            <div className="w-full">
              <Label htmlFor="generatedToken">Novo Token Gerado</Label>
              <div className="flex mt-2">
                <Input
                  id="generatedToken"
                  value={generatedToken}
                  readOnly
                  className="flex-grow"
                />
                <Button
                  onClick={copyToClipboard}
                  className="ml-2"
                  variant="outline"
                  size="icon"
                >
                  <CopyIcon className="h-4 w-4" />
                  <span className="sr-only">Copiar token</span>
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}