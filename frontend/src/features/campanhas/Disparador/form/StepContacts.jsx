import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Download, Info } from 'lucide-react'
import FileUpload from './FileUpload'

export default function StepContacts({ formData, handleInputChange }) {
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
        <FileUpload
          field="csvFile"
          label="Arquivo CSV"
          accept=".csv"
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
    </>
  )
}
