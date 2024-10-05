import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { resetPwdcall, verPwdresetcall, chgPwdcall, verTokenExists } from "@/API/apicall-func";
import { useToast } from "@/hooks/use-toast";

/**
 * @typedef {Object} ForgotPasswordCardProps
 * @property {function(string): void} setState
 */

/**
 * @param {ForgotPasswordCardProps} props
 * @returns {JSX.Element}
 */
export const ForgotPasswordCard = ({ setState }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false); // Etapa 1: código enviado
  const [isCodeVerified, setIsCodeVerified] = useState(false); // Etapa 2: código verificado
  const [isPasswordChanged, setIsPasswordChanged] = useState(false); // Etapa 4: mudança de senha
  const [error, setError] = useState("");
  const [code, setCode] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    const response1 = await verTokenExists.vertknresetcall(email);
    if (response1 && !response1.success) {
      toast({
        title: "Opa!",
        description: response1.message,
        variant: "destructive",

      })
    } else {

      const response = await resetPwdcall.resetpwdcall(email);

      if (response && response.success) {
        toast({
          title: "Sucesso!",
          description: response.message,
          variant: "default",

        })
        setIsCodeSent(true); // Avançando para a Etapa 2
      } else {
        toast({
          title: "Erro ao enviar",
          description: response.message,
          variant: "destructive",
        })
      }
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    const response = await verPwdresetcall.verpwdresetcall(code.join(''), email);

    if (response && response.success) {
      toast({
        title: "Sucesso!",
        description: response.message,
        variant: "default",

      })
      setIsCodeVerified(true);
    } else {
      toast({
        title: "Erro!",
        description: response.message,
        variant: "destructive",
      })
    }

  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");

    const response = await chgPwdcall.chgpwdcall(email, newPassword);

    if (response && response.success) {
      toast({
        title: "Sucesso!",
        description: response.message,
        variant: "default",

      })
      setIsPasswordChanged(true);
    } else {
      toast({
        title: "Erro!",
        description: response.message,
        variant: "destructive",
      })
    }
  };

  const handleBack = () => {
    setIsCodeSent(false);
    setIsCodeVerified(false);
    setError("");
  };

  return (
    <Card className="w-[420px]">
      <CardHeader>
        <CardTitle>
          {isPasswordChanged ? "Sucesso" : isCodeVerified ? "Mudar Senha" : isCodeSent ? "Verificar Código" : "Esqueceu a Senha"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={isPasswordChanged ? handleBack : isCodeVerified ? handleChangePassword : isCodeSent ? handleVerifyCode : handleSendCode}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {!isCodeSent ? (
              // Etapa 1: Solicitação por Email
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            ) : !isCodeVerified ? (
              // Etapa 2: Verificação de Código
              <div className="flex flex-col space-y-1.5 justify-center items-center">
                <Label htmlFor="code">Código de Redefinição</Label>
                <div className="flex gap-2 justify-center items-center">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={1}
                      className="w-10 text-center"
                      value={digit}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Permite limpar o campo (valor vazio) ou validar se é um dígito numérico
                        if (value === "" || value.match(/^\d$/)) {
                          const newCode = [...code];
                          newCode[index] = value;
                          setCode(newCode);

                          // Move para o próximo campo se não for o último e o valor for um número válido
                          if (value.match(/^\d$/) && index < code.length - 1) {
                            document.getElementById(`code-${index + 1}`).focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Permite voltar ao campo anterior usando Backspace
                        if (e.key === "Backspace" && index > 0 && !code[index]) {
                          document.getElementById(`code-${index - 1}`).focus();
                        }
                      }}
                      onPaste={(e) => {
                        const pasteData = e.clipboardData.getData("text");
                        const pasteDigits = pasteData.split("").filter((char) => /^\d$/.test(char)); // Apenas números

                        if (pasteDigits.length > 0) {
                          const newCode = [...code];
                          pasteDigits.slice(0, code.length).forEach((digit, idx) => {
                            newCode[idx] = digit;
                          });
                          setCode(newCode);

                          // Move o foco para o último campo preenchido
                          const lastFilledIndex = Math.min(pasteDigits.length - 1, code.length - 1);
                          document.getElementById(`code-${lastFilledIndex}`).focus();
                        }
                        e.preventDefault(); // Impede o comportamento padrão de colar
                      }}
                      required
                    />
                  ))}
                </div>
              </div>


            ) : !isPasswordChanged ? (
              // Etapa 3: Mudança de Senha
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            ) : (
              // Etapa 4: Confirmação de Mudança
              <div className="text-center">
                <p className="text-green-600">Senha alterada com sucesso!</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          {!isPasswordChanged ? (
            <Button className="w-[210px]" type="submit">
              {isCodeVerified ? "Mudar Senha" : isCodeSent ? "Verificar Código" : "Enviar Código de Redefinição"}
            </Button>
          ) : (
            <Button className="w-[210px]" variant="outline" onClick={handleBack}>
              Voltar
            </Button>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isPasswordChanged && isCodeSent && (
            <Button className="w-[210px] mt-2" variant="outline" onClick={handleBack}>
              Voltar
            </Button>
          )}

          <div className="text-center text-sm mt-2">
            Lembrou da senha?{" "}
            <span onClick={() => setState("sign-in")} className="text-blue-600 hover:underline font-medium cursor-pointer">
              Entrar
            </span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
