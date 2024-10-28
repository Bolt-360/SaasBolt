import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Download, Info } from 'lucide-react'
import FileUpload from './FileUpload'
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useVerifyNumbers } from '@/hooks/use-verify-numbers';

export default function StepContacts({ formData, handleInputChange }) {
  const [csvData, setCsvData] = useState([]);
  const [formattedNumbers, setFormattedNumbers] = useState([]);
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const { toast } = useToast();
  const { verifyNumbers, isVerifying } = useVerifyNumbers();

  const formatPhoneNumber = (number) => {
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

      const headers = lines[0]
        .split(',')
        .map(h => h.trim().toLowerCase());

      if (!headers.includes('numero')) {
        throw new Error('O arquivo CSV deve conter uma coluna "numero"');
      }

      const parsedData = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const row = {};
        
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });

        // Formata o número
        if (row.numero) {
          row.numeroFormatado = formatPhoneNumber(row.numero);
        }

        return row;
      });

      return parsedData;
    } catch (error) {
      throw new Error(`Erro ao processar CSV: ${error.message}`);
    }
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const text = e.target.result;
          const parsedData = parseCsvContent(text);
          
          setCsvData(parsedData);
          setFormattedNumbers(parsedData.map(row => row.numeroFormatado));
          setShowVerifyButton(true);
          
          handleInputChange(field, file);
        } catch (error) {
          console.error('Erro ao processar CSV:', error);
          toast({
            title: "Erro no processamento",
            description: error.message,
            variant: "destructive"
          });
        }
      };

      reader.onerror = () => {
        toast({
          title: "Erro",
          description: "Falha ao ler o arquivo",
          variant: "destructive"
        });
      };

      reader.readAsText(file);
    } catch (error) {
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
      const results = await verifyNumbers(formattedNumbers, formData.instancia || "2-2");
      // Implementar lógica após verificação
      console.log('Resultados da verificação:', results);
    } catch (error) {
      console.error('Erro na verificação:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Importação de Contatos</AlertTitle>
        <AlertDescription>
          Faça o upload de um arquivo CSV contendo os números e nomes dos contatos.
          O arquivo deve ter pelo menos as colunas "numero" e "nome".
        </AlertDescription>
      </Alert>

      <FileUpload
        field="csvFile"
        label="Arquivo CSV"
        accept=".csv"
        formData={formData}
        handleInputChange={handleFileUpload}
      />

      {csvData.length > 0 && (
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Contatos Importados</h3>
          <ScrollArea className="h-[200px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número Original</TableHead>
                  <TableHead>Número Formatado</TableHead>
                  <TableHead>Nome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.numero}</TableCell>
                    <TableCell>{row.numeroFormatado}</TableCell>
                    <TableCell>{row.nome}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          {showVerifyButton && (
            <Button 
              onClick={handleVerifyNumbers}
              disabled={isVerifying}
              className="mt-4"
            >
              {isVerifying ? 'Verificando...' : 'Verificar Números'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
