import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { FilePenIcon, PowerIcon, TrashIcon } from 'lucide-react';
import FormSteps from "@/features/campanhas/Boletos/form/FormSteps";
import Modal from "./form/Modal";
import { Switch } from "@/components/ui/switch";

export default function Campaigns() {
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    instancia: '',
    csvFile: null,
    csvData: [],
    formattedNumbers: [],
    verifiedNumbers: [],
    mensagens: [{ principal: '' }],
    inicioImediato: false,
    dataInicio: '',
    intervalo: '',
    envioFinaisSemana: true,
    envioFeriados: true,
    limitarHorarioEnvio: true,
  });

  const [horarios, setHorarios] = useState({
    segunda: { inicio: '', fim: '' },
    terca: { inicio: '', fim: '' },
    quarta: { inicio: '', fim: '' },
    quinta: { inicio: '', fim: '' },
    sexta: { inicio: '', fim: '' },
    sabado: { inicio: '', fim: '' },
    domingo: { inicio: '', fim: '' },
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHorarioChange = (dia, tipo, valor) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [tipo]: valor,
      },
    }));
  };

  const replicarHorario = (inicio, fim) => {
    const novoHorario = {
      segunda: { inicio, fim },
      terca: { inicio, fim },
      quarta: { inicio, fim },
      quinta: { inicio, fim },
      sexta: { inicio, fim },
      sabado: { inicio, fim },
      domingo: { inicio, fim },
    };
    setHorarios(novoHorario);
  };

  const handleSaveSettings = () => {
    // Lógica para salvar as configurações
    console.log("Configurações salvas:", formData, horarios);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <Tabs defaultValue="campaigns" className="border-b">
        <TabsList className="flex">
          <TabsTrigger value="campaigns">Disparos Recorrentes</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        <TabsContent value="campaigns" className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Disparo de Boletos</h2>
              <Button onClick={() => setIsCreatingCampaign(true)}>Nova Campanha de Boletos</Button>
            </div>
            <Modal isOpen={isCreatingCampaign} onClose={() => setIsCreatingCampaign(false)}>
              <FormSteps formData={formData} handleInputChange={handleInputChange} onClose={() => setIsCreatingCampaign(false)} />
            </Modal>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Último Envio</TableHead>
                  <TableHead>Próximo Envio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Link to="#" className="font-medium">
                      Campanha de Natal
                    </Link>
                  </TableCell>
                  <TableCell>12/12/2023</TableCell>
                  <TableCell>25/12/2023</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Ativa</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost">
                        <FilePenIcon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <PowerIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Link to="#" className="font-medium">
                      Campanha de Aniversário
                    </Link>
                  </TableCell>
                  <TableCell>01/05/2023</TableCell>
                  <TableCell>01/05/2024</TableCell>
                  <TableCell>
                    <Badge variant="outline">Inativa</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost">
                        <FilePenIcon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <PowerIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="p-6">
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="flex justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="envio-finais-semana"
                  checked={formData.envioFinaisSemana}
                  onCheckedChange={(checked) => handleInputChange('envioFinaisSemana', checked)}
                />
                <Label htmlFor="envio-finais-semana">Envio em Finais de Semana</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="envio-feriados"
                  checked={formData.envioFeriados}
                  onCheckedChange={(checked) => handleInputChange('envioFeriados', checked)}
                />
                <Label htmlFor="envio-feriados">Envio em Feriados</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="limitar-horario-envio"
                  checked={formData.limitarHorarioEnvio}
                  onCheckedChange={(checked) => handleInputChange('limitarHorarioEnvio', checked)}
                />
                <Label htmlFor="limitar-horario-envio">Limitar Horário de Envio</Label>
              </div>
            </div>
            {formData.limitarHorarioEnvio && (
              <div className="space-y-2">
                {Object.keys(horarios).map(dia => (
                  <div key={dia} className="flex items-center space-x-2">
                    <Label className="w-24 capitalize">{dia}</Label>
                    <Input
                      type="time"
                      value={horarios[dia].inicio}
                      onChange={(e) => handleHorarioChange(dia, 'inicio', e.target.value)}
                      className="w-28"
                    />
                    <span>até</span>
                    <Input
                      type="time"
                      value={horarios[dia].fim}
                      onChange={(e) => handleHorarioChange(dia, 'fim', e.target.value)}
                      className="w-28"
                    />
                  </div>
                ))}
                <div className="flex justify-center space-x-4 mt-4">
                  <Button
                    onClick={() => replicarHorario(horarios.segunda.inicio, horarios.segunda.fim)}
                    className="px-4 py-2 text-base font-medium border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
                  >
                    Replicar Horário
                  </Button>
                  <Button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 text-base font-medium text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600"
                  >
                    Salvar Configurações
                  </Button>
                </div>
              </div>
            )}
            <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              <p>Caso o envio seja interrompido, ele continuará no próximo dia útil.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
