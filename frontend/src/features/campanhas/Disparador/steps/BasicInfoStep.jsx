import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function BasicInfoStep({
  formData,
  handleInputChange,
  isLoading,
  error,
  openInstances,
  renderFileUpload,
  fileTypes
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Campanha*</Label>
        <Input
          id="nome"
          placeholder="Digite o nome da campanha"
          value={formData.nome}
          onChange={(e) => handleInputChange("nome", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Campanha*</Label>
        <Select
          onValueChange={(value) => handleInputChange("tipo", value)}
          required
        >
          <SelectTrigger id="tipo">
            <SelectValue placeholder="Selecione o tipo de campanha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mensagem">Mensagem</SelectItem>
            <SelectItem value="mensagem_imagem">Mensagem + Imagem</SelectItem>
            <SelectItem value="mensagem_documento">
              Mensagem + Documento
            </SelectItem>
            <SelectItem value="audio">Áudio</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.tipo &&
        formData.tipo !== "mensagem" &&
        renderFileUpload({
          field: "arquivo",
          label:
            formData.tipo === "mensagem_imagem"
              ? "Imagem"
              : formData.tipo === "mensagem_documento"
              ? "Documento"
              : "Áudio",
          accept:
            formData.tipo === "mensagem_imagem"
              ? "image/*"
              : formData.tipo === "mensagem_documento"
              ? ".pdf,.doc,.docx"
              : "audio/*",
          formData,
          handleInputChange,
          fileTypes
        })}
      <div className="space-y-2">
        <Label htmlFor="instancia">Instância*</Label>
        {isLoading ? (
          <p>Carregando instâncias...</p>
        ) : error ? (
          <p className="text-red-500">Erro ao carregar instâncias: {error}</p>
        ) : openInstances.length === 0 ? (
          <p>Nenhuma instância conectada disponível</p>
        ) : (
          <Select
            onValueChange={(value) => handleInputChange("instancia", value)}
            required
          >
            <SelectTrigger id="instancia">
              <SelectValue placeholder="Selecione a instância" />
            </SelectTrigger>
            <SelectContent>
              {openInstances.map((instance) => (
                <SelectItem key={instance.id} value={instance.id}>
                  {instance.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </>
  );
}
