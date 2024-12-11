'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import ConfigDisparos from './configDisparos'
import ConfigSGA from './configSGA'

const DisparosConfiguracoes = () => {
  const [activeContent, setActiveContent] = useState('sga')
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
    <div className="min-h-screen bg-gray-100/40 dark:bg-gray-800/40">
      <div className="container mx-auto py-10">
        <div className='mx-auto flex justify-between w-full max-w-4xl'>
          <div className='flex items-center gap-5 justify-center mb-10'>
            <Button className="w-24"
            onClick={() => setActiveContent('sga')}
            variant={activeContent === 'sga' ? 'default' : 'outline'}
            >
              SGA
            </Button>
            <Button className="w-24"
            onClick={() => setActiveContent('disparos')}
            variant={activeContent === 'disparos' ? 'default' : 'outline'}
            >
              Disparos
            </Button>
          </div>
          <div className=''>
            <Button>Como gerar meu token no SGA?</Button>
          </div>
        </div>

        {activeContent === 'sga' ? (
          <ConfigSGA />
          ) : (
            <ConfigDisparos />
          )
        }
      </div>
    </div>
  )
}

export default DisparosConfiguracoes