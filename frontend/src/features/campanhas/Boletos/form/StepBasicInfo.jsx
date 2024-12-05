import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useInstancesFetch } from '@/hooks/useInstancesFetch'
import FileUpload from './FileUpload'
import { fileTypes } from './constants'
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState } from 'react';

export default function StepBasicInfo({ formData, handleInputChange }) {
  const { instances, isLoading, error } = useInstancesFetch()
  const navigate = useNavigate()
  const openInstances = instances.filter(instance => instance.connectionStatus === "open")

  const [daysOffset, setDaysOffset] = useState(0);

  const renderInstancesSection = () => {
    if (isLoading) {
      return <p className="text-sm text-muted-foreground">Carregando instâncias...</p>
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível carregar as instâncias: {error}
          </AlertDescription>
        </Alert>
      )
    }

    if (openInstances.length === 0) {
      return (
        <Alert className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nenhuma instância conectada</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Você precisa de uma instância conectada para criar uma campanha.</span>
            <Button 
              variant="secondary"
              onClick={() => navigate('/app/campanhas/listar-instancias')}
              className="ml-4"
            >
              Gerenciar Instâncias
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <Select onValueChange={(value) => handleInputChange('instancia', value)} required>
        <SelectTrigger id="instancia">
          <SelectValue placeholder="Selecione a instância" />
        </SelectTrigger>
        <SelectContent>
          {openInstances.map((instance) => (
            <SelectItem key={instance.id} value={instance.name}>
              {instance.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

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
        <Label htmlFor="dataEnvio">Data de Envio*</Label>
        <Select 
          onValueChange={(value) => {
            handleInputChange('dataEnvio', value);
            if (value === 'posterior' || value === 'anterior') {
              setDaysOffset(1); // Define um valor padrão de 1 dia
            } else {
              setDaysOffset(0);
            }
          }} 
          required
        >
          <SelectTrigger id="dataEnvio">
            <SelectValue placeholder="Selecione a data de envio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dia_vencimento">Dia do vencimento</SelectItem>
            <SelectItem value="posterior">Posterior ao vencimento</SelectItem>
            <SelectItem value="anterior">Anterior ao vencimento</SelectItem>
          </SelectContent>
        </Select>
        {(formData.dataEnvio === 'posterior' || formData.dataEnvio === 'anterior') && (
          <div className="mt-2">
            <Label htmlFor="diasOffset">Quantidade de Dias*</Label>
            <Input 
              id="diasOffset" 
              type="number" 
              min="1"
              value={daysOffset}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ''); // Remove tudo que não é dígito
                if (value.length <= 2) { // Limita a entrada a dois dígitos
                  setDaysOffset(value);
                }
              }}
              onBlur={() => handleInputChange('diasOffset', daysOffset)}
              required
            />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="instancia">Instância*</Label>
        {renderInstancesSection()}
      </div>
    </>
  )
}
