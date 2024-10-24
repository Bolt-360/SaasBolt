'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, PlayCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import StepBasicInfo from './form/StepBasicInfo'
import StepContacts from './form/StepContacts'
import StepMessages from './form/StepMessages'
import StepScheduling from './form/StepScheduling'
import StepReview from './form/StepReview'
import { steps } from './form/constants'
import { useToast } from "@/hooks/use-toast"
import { useFetchCampaign } from '@/hooks/useFetchCampaign';

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
    arquivo: null
  })
  const [isNextDisabled, setIsNextDisabled] = useState(true)
  const [csvVariables, setCsvVariables] = useState([])
  const { toast } = useToast()
  const { createCampaign, isLoading } = useFetchCampaign();

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
    if (field === 'csvFile' && value) {
      // Lógica para extrair variáveis do CSV
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        const lines = content.split('\n')
        if (lines.length > 0) {
          const headers = lines[0].split(',')
          setCsvVariables(headers)
        }
      }
      reader.readAsText(value)
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = error => reject(error)
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Assumindo que você tem acesso ao workspaceId
      const workspaceId = 2; // Substitua pelo ID correto do workspace
      await createCampaign(formData, workspaceId);
      toast({
        title: "Sucesso!",
        description: "Campanha criada com sucesso.",
      });
      // Aqui você pode redirecionar o usuário ou limpar o formulário
      // Por exemplo:
      // router.push('/campanhas');
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar a campanha. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const renderStep = () => {
    const props = {
      formData,
      handleInputChange,
      csvVariables
    }

    switch(currentStep) {
      case 0:
        return <StepBasicInfo {...props} />
      case 1:
        return <StepContacts {...props} />
      case 2:
        return <StepMessages {...props} />
      case 3:
        return <StepScheduling {...props} />
      case 4:
        return <StepReview {...props} />
      default:
        return null
    }
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
                  <Button type="button" onClick={nextStep} disabled={isNextDisabled}>
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      "Criando campanha..."
                    ) : formData.inicioImediato ? (
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
