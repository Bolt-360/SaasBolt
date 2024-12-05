import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function StepScheduling({ formData, handleInputChange }) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="enviar-linha-digitavel"
            checked={formData.enviarLinhaDigitavel}
            onCheckedChange={(checked) => handleInputChange('enviarLinhaDigitavel', checked)}
          />
          <Label htmlFor="enviar-linha-digitavel">Enviar Linha digitável do boleto</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="enviar-qrcode-pix"
            checked={formData.enviarQrCodePix}
            onCheckedChange={(checked) => handleInputChange('enviarQrCodePix', checked)}
          />
          <Label htmlFor="enviar-qrcode-pix">Enviar QrCode Pix separado</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="enviar-codigo-pix"
            checked={formData.enviarCodigoPix}
            onCheckedChange={(checked) => handleInputChange('enviarCodigoPix', checked)}
          />
          <Label htmlFor="enviar-codigo-pix">Enviar Código Pix separado</Label>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Essas informações serão enviadas em uma mensagem adicional, após o envio da mensagem principal.
        </p>
      </div>
    </>
  )
}