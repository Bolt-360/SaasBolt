import React, { useState, useRef } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Download, Info, Upload, X } from "lucide-react";

export default function ImportContacts({
  handleDownloadModelo,
  renderFileUpload,
  fileTypes,
  formData,
  handleInputChange,
}) {
  return (
    <>
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Importação de Contatos</AlertTitle>
        <AlertDescription>
          Faça o upload de um arquivo CSV contendo os números e nomes dos
          contatos. O arquivo deve ter duas colunas: "numero" e "nome".
        </AlertDescription>
      </Alert>
      <div className="space-y-4">
        <Button type="button" onClick={handleDownloadModelo} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Baixar Modelo CSV
        </Button>
        {renderFileUpload({
          field: "csvFile",
          label: "arquivo CSV",
          accept: ".csv",   
          fileTypes,
          formData,
          handleInputChange,
        })}
      </div>
    </>
  );
}
