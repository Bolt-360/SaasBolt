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

export default function StepContacts({ formData, handleInputChange }) {
  const [csvData, setCsvData] = useState([]);
  const [formattedNumbers, setFormattedNumbers] = useState([]);
  const [verifiedNumbers, setVerifiedNumbers] = useState([]);
  const { toast } = useToast();
  const { verifyNumbers, isVerifying } = useVerifyNumbers();

  const clearContactsData = () => {
    setCsvData([]);
    setFormattedNumbers([]);
    setVerifiedNumbers([]);
  };

  const formatInstanceName = () => {
    const workspaceId = 2; // Você pode pegar isso do contexto ou props
    const instanceId = formData.instancia;
    return `${workspaceId}-${instanceId}`;
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

      // Pega os headers mas não valida mais o nome da coluna numero
      const headers = lines[0]
        .split(',')
        .map(h => h.trim());

      const parsedData = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const row = {
          numeroOriginal: values[0] || '', // Primeira coluna sempre será o número
          numeroFormatado: formatPhoneNumber(values[0]), // Formata o número da primeira coluna
        };
        
        // Adiciona as outras colunas com seus respectivos headers
        headers.forEach((header, i) => {
          if (i > 0) { // Pula a primeira coluna que já foi tratada
            row[header] = values[i] || '';
          }
        });

        return row;
      });

      return parsedData;
    } catch (error) {
      throw new Error(`Erro ao processar CSV: ${error.message}`);
    }
  };

  const handleFileUpload = async (field, file) => {
    // Se o arquivo for null (removido), limpa os dados
    if (!file) {
      clearContactsData();
      handleInputChange(field, null);
      return;
    }
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const text = e.target.result;
          const parsedData = parseCsvContent(text);
          
          // Filtra números vazios ou inválidos
          const validData = parsedData.filter(row => row.numeroFormatado.length >= 12);
          
          if (validData.length === 0) {
            throw new Error('Nenhum número válido encontrado no CSV');
          }

          setCsvData(validData);
          setFormattedNumbers(validData.map(row => row.numeroFormatado));
          setVerifiedNumbers([]);
          
          handleInputChange(field, file);
        } catch (error) {
          clearContactsData();
          handleInputChange(field, null);
          console.error('Erro ao processar CSV:', error);
          toast({
            title: "Erro no processamento",
            description: error.message,
            variant: "destructive"
          });
        }
      };

      reader.onerror = () => {
        clearContactsData();
        handleInputChange(field, null);
        toast({
          title: "Erro",
          description: "Falha ao ler o arquivo",
          variant: "destructive"
        });
      };

      reader.readAsText(file);
    } catch (error) {
      clearContactsData();
      handleInputChange(field, null);
      console.error('Erro na leitura do arquivo:', error);
      toast({
        title: "Erro",
        description: "Falha ao processar o arquivo CSV",
        variant: "destructive"
      });
    }
  };

  const handleVerifyNumbers = async () => {
    try {
      const payload = {
        numbers: formattedNumbers,
        instanceName: formatInstanceName()
      };

      const results = await verifyNumbers(payload);
      
      // Atualiza o csvData com os resultados da verificação
      const updatedCsvData = csvData.map(row => {
        const verifiedNumber = results.find(r => r.number === row.numeroFormatado);
        return {
          ...row,
          exists: verifiedNumber?.exists || false,
          name: verifiedNumber?.name || '',
          jid: verifiedNumber?.jid || ''
        };
      });

      setCsvData(updatedCsvData);
      setVerifiedNumbers(results);

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

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Importação de Contatos</AlertTitle>
        <AlertDescription>
          Faça o upload de um arquivo CSV. A primeira coluna será sempre considerada como números de telefone.
          Os números podem estar com ou sem o código do país (55).
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
                    .filter(key => !['numeroOriginal', 'numeroFormatado', 'exists', 'jid'].includes(key))
                    .map(header => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  {verifiedNumbers.length > 0 && (
                    <TableHead>Nome WhatsApp</TableHead>
                  )}
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
                      .filter(([key]) => !['numeroOriginal', 'numeroFormatado', 'exists', 'jid'].includes(key))
                      .map(([key, value]) => (
                        <TableCell key={key}>{value}</TableCell>
                      ))}
                    {verifiedNumbers.length > 0 && (
                      <TableCell>{row.name || '-'}</TableCell>
                    )}
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
                  <span className="mr-4">Números válidos</span>
                  <span className="inline-block w-3 h-3 bg-red-50 border border-red-200 rounded-sm mr-2" />
                  <span>Números inválidos</span>
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
