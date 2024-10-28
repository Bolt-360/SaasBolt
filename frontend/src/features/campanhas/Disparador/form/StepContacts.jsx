import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Download, Info, X } from 'lucide-react'
import FileUpload from './FileUpload'
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useVerifyNumbers } from '@/hooks/use-verify-numbers';
import { cn } from "@/lib/utils"

export default function StepContacts({ 
  formData, 
  handleInputChange,
  handleCsvDataChange 
}) {
  const { toast } = useToast();
  const { verifyNumbers, isVerifying } = useVerifyNumbers();
  
  // Usar os dados do formData
  const csvData = formData.csvData || [];
  const formattedNumbers = formData.formattedNumbers || [];
  const verifiedNumbers = formData.verifiedNumbers || [];
  
  const clearContactsData = () => {
    if (handleCsvDataChange) { // Adicione uma verificação de segurança
      handleCsvDataChange([], [], []);
      handleInputChange('csvFile', null);
    }
  };

  const formatInstanceName = () => {
    const instanceId = formData.instancia;
    return `${instanceId}`;
  };

  const formatPhoneNumber = (number) => {
    if (!number) return '';
    // Remove todos os caracteres não numéricos
    const cleaned = number.toString().replace(/\D/g, '');
    
    // Se já começar com 55, retorna o número como está
    if (cleaned.startsWith('55')) {
      return cleaned;
    }
    
    // Adiciona 55 no início
    return `55${cleaned}`;
  };

  const parseCsvContent = (content) => {
    try {
      const lines = content
        .trim()
        .split(/\r?\n/)
        .filter(line => line.trim());

      if (lines.length < 2) {
        throw new Error('O arquivo CSV deve conter pelo menos um cabeçalho e uma linha de dados');
      }

      // Extrai os headers e remove espaços em branco
      const headers = lines[0]
        .split(',')
        .map(h => h.trim());

      // Remove a primeira coluna (número) e pega as variáveis restantes
      const variables = headers.slice(1); // ['NOME', 'TURNO', 'ENVIADO']

      const parsedData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row = {
          numeroOriginal: values[0] || '',
          numeroFormatado: formatPhoneNumber(values[0]),
        };
        
        // Adiciona as outras colunas com seus respectivos headers
        headers.forEach((header, i) => {
          if (i > 0) { // Pula a primeira coluna que é o número
            row[header.toLowerCase()] = values[i] || ''; // Converte header para minúsculo
          }
        });

        return row;
      });

      return {
        data: parsedData,
        variables: variables
      };
    } catch (error) {
      throw new Error(`Erro ao processar CSV: ${error.message}`);
    }
  };

  const handleFileUpload = async (field, file) => {
    if (!file) {
      clearContactsData();
      return;
    }
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const text = e.target.result;
          const { data: parsedData, variables } = parseCsvContent(text);
          const validData = parsedData.filter(row => row.numeroFormatado.length >= 12);
          
          if (validData.length === 0) {
            throw new Error('Nenhum número válido encontrado no CSV');
          }

          if (handleCsvDataChange) {
            handleCsvDataChange(
              validData,
              validData.map(row => row.numeroFormatado),
              [],
              variables // Passando as variáveis extraídas
            );
          }
          
          handleInputChange(field, file);
        } catch (error) {
          clearContactsData();
          toast({
            title: "Erro no processamento",
            description: error.message,
            variant: "destructive"
          });
        }
      };

      reader.readAsText(file);
    } catch (error) {
      clearContactsData();
      toast({
        title: "Erro",
        description: "Falha ao processar o arquivo CSV",
        variant: "destructive"
      });
    }
  };

  const handleVerifyNumbers = async () => {
    try {
      const results = await verifyNumbers({
        numbers: formattedNumbers,
        instanceName: formatInstanceName()
      });
      
      const updatedCsvData = csvData.map(row => {
        const verifiedNumber = results.find(r => r.number === row.numeroFormatado);
        return {
          ...row,
          exists: verifiedNumber?.exists || false,
          name: verifiedNumber?.name || '',
          jid: verifiedNumber?.jid || ''
        };
      });

      // Aqui está o problema - precisamos manter as variáveis ao atualizar os dados
      handleCsvDataChange(
        updatedCsvData, 
        formattedNumbers, 
        results,
        formData.csvVariables // Mantém as variáveis existentes
      );

      toast({
        title: "Verificação concluída",
        description: `${results.filter(r => r.exists).length} números válidos encontrados`,
      });
    } catch (error) {
      console.error('Erro na verificação:', error);
      toast({
        title: "Erro na verificação",
        description: error.message || "Não foi possível verificar os números",
        variant: "destructive",
      });
    }
  };

  const handleDownloadExample = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do botão
    
    const csvContent = "numero,nome,cidade\n5584999999991,João Silva,Natal\n5584988888881,Maria Santos,Parnamirim";
    
    // Cria o blob com o conteúdo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Cria uma URL temporária para o blob
    const url = window.URL.createObjectURL(blob);
    
    // Cria um elemento <a> temporário
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'exemplo_contatos.csv');
    
    // Adiciona o link ao documento
    document.body.appendChild(link);
    
    // Simula o clique no link
    link.click();
    
    // Remove o link do documento
    document.body.removeChild(link);
    
    // Libera a URL temporária
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Importação de Contatos</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            Faça o upload de um arquivo CSV. A primeira coluna será sempre considerada como números de telefone.
            Os números podem estar com ou sem o código do país (55).
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadExample}
            className="ml-4"
            type="button" // Garante que o botão não submeta um formulário
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar Exemplo
          </Button>
        </AlertDescription>
      </Alert>

      <FileUpload
        field="csvFile"
        label="Arquivo CSV"
        accept=".csv"
        formData={formData}
        handleInputChange={(field, file) => {
          if (!file) {
            clearContactsData();
          }
          handleFileUpload(field, file);
        }}
      />

      {csvData.length > 0 && (
        <div className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Contatos Importados ({csvData.length})</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                handleInputChange('csvFile', null);
                clearContactsData();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[200px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  {Object.keys(csvData[0])
                    .filter(key => !['numeroOriginal', 'numeroFormatado', 'exists', 'jid', 'name'].includes(key))
                    .map(header => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, index) => (
                  <TableRow 
                    key={index}
                    className={cn(
                      row.exists === true && "bg-green-50",
                      row.exists === false && "bg-red-50"
                    )}
                  >
                    <TableCell>{row.numeroFormatado}</TableCell>
                    {Object.entries(row)
                      .filter(([key]) => !['numeroOriginal', 'numeroFormatado', 'exists', 'jid', 'name'].includes(key))
                      .map(([key, value]) => (
                        <TableCell key={key}>{value}</TableCell>
                      ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {verifiedNumbers.length > 0 && (
                <>
                  <span className="inline-block w-3 h-3 bg-green-50 border border-green-200 rounded-sm mr-2" />
                  <span className="mr-4">
                    Números válidos ({csvData.filter(row => row.exists === true).length})
                  </span>
                  <span className="inline-block w-3 h-3 bg-red-50 border border-red-200 rounded-sm mr-2" />
                  <span>
                    Números inválidos ({csvData.filter(row => row.exists === false).length})
                  </span>
                </>
              )}
            </div>
            
            <Button 
              onClick={handleVerifyNumbers}
              disabled={isVerifying}
            >
              {isVerifying ? 'Verificando...' : `Verificar ${formattedNumbers.length} Números`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
