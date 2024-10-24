import { Label } from "@/components/ui/label";  
import { Button } from "@/components/ui/button";
import { Info, Upload, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

export default function renderFileUpload({ field, label, accept, fileTypes, formData, handleInputChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRefs = useRef({});

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
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