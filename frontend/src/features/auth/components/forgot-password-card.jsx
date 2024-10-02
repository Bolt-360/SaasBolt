import { useState } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast"; // Exemplo de onde o hook useToast pode vir

/**
 * @typedef {Object} ForgotPasswordCardProps
 * @property {function(SignInFlow): void} setState
 */

/**
 * @param {ForgotPasswordCardProps} props
 * @returns {JSX.Element}
 */
export const ForgotPasswordCard = ({ setState }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      console.log('Reset de senha para:', email);
      setSubmitStatus('success');
      toast({ description: 'Email de recuperação enviado!' }); 
    } catch (error) {
      console.error('Erro ao tentar resetar senha:', error);
      setSubmitStatus('error');
      toast({ description: 'Erro ao enviar o email.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg ring-1 ring-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Esqueci minha senha</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-left block">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@bolt360.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Link de Reset'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {submitStatus === 'success' && (
          < Alert variant="default">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Sucesso</AlertTitle>
            <AlertDescription>
              Se uma conta existe para {email}, você receberá instruções de como resetar a senha por esse email.
            </AlertDescription>
          </Alert>
        )}
        {submitStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Um erro ocorreu enquanto processava a requisição. Por favor tente novamente.
            </AlertDescription>
          </Alert>
        )}
        <div className="text-center text-sm">
          Lembrou da senha?{' '}
          <span onClick={() => setState('sign-in')} className="text-blue-600 hover:underline font-medium cursor-pointer">
            Entrar
          </span>
        </div>
      </CardFooter>
    </div >
  );
};