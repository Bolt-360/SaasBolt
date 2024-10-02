import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SignInFlow } from "../types";
import { CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { signupcall } from "@/API/apicall-func";
import { cpfMask } from "../functions";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react'

/**
 * @typedef {Object} SignInCardProps
 * @property {function(SignInFlow): void} setState
 */

/**
 * @param {string} password
 * @returns {number}
 */
const passwordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.match(/[a-z]+/)) strength += 25;
  if (password.match(/[A-Z]+/)) strength += 25;
  if (password.match(/[0-9]+/)) strength += 25;
  return strength;
};



/**
 * @param {SignInCardProps} props
 * @returns {JSX.Element}
 */
export const SignUpCard = ({ setState }) => {
  const { toast } = useToast();
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pending, setPending] = useState(false);
  const [passwordStrengthValue, setPasswordStrengthValue] = useState(0);
  const [cpf, setCpf] = useState("")
  const [gender, setGender] = useState("Masculino")

  const [showPassword, setShowPassword] = useState(false) //Visualização de senha
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)//Visualização de Confirmar senha

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword) //Ação que define se é para visualizar senha
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword) //Ação que define se é para ver confirmação de senha
  }

  useEffect(() => {
    setPasswordStrengthValue(passwordStrength(password));
  }, [password]);

  const onPasswordSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erro ao cadastrar",
        description: "As senhas precisam ser iguais!",
        variant: "destructive",
      });
      return;
    }
    if (passwordStrengthValue < 75) {
      toast({
        title: "Senha fraca",
        description: "Por favor, use uma senha mais forte antes de cadastrar.",
        variant: "destructive",
      });
      return;
    }
    setPending(true);
    console.log('Signup attempt:', { name, email, password, confirmPassword, cpf, gender });

    const response = await signupcall.signup(email, password, confirmPassword, name, cpf, gender);
    if (response && response.data.token) {
      navigate('/');
    }
    else {
      toast({
        title: "Erro no cadastro",
        description: response.data.message,
        variant: "destructive",
      })
    }
    setPending(false);
  }

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleCPFChange = (e) => {
    setCpf(cpfMask(e.target.value));
  };

  return (
    <>
      <div className="bg-card rounded-2xl shadow-lg ring-1 ring-border">
        <CardTitle className="text-center text-1xl font-bold text-primary pt-4">Crie sua conta aqui</CardTitle>
        <div className="px-6 py-8 sm:px-10">
          <form className="space-y-6" onSubmit={onPasswordSignUp}>
            <div>
              <Label htmlFor="cpf" className="block text-sm font-medium text-muted-foreground">
                CPF
              </Label>
              <div className="mt-1">
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  autoComplete="cpf"
                  value={cpf}
                  onChange={handleCPFChange}
                  required
                  placeholder="000.000.000-00"
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                Nome
              </Label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Nome completo"
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="gender" className="block text-sm font-medium text-muted-foreground">
                Gênero
              </Label>
              <Select onValueChange={setGender} value={gender}>
                <SelectTrigger className="w-[180px] text-gray-500">
                  <SelectValue placeholder="Informe seu gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                Email
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@bolt360.com.br"
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                  Senha
                </Label>
              </div>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="********"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password-confirm" className="block text-sm font-medium text-muted-foreground">
                  Confirme a senha
                </Label>
              </div>
              <div className="mt-1 relative">
                <Input
                  id="password-confirm"
                  name="password-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="********"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <Progress value={passwordStrengthValue} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-1">
                Força da senha: {passwordStrengthValue < 25 ? "Fraca" : passwordStrengthValue < 50 ? "Média" : passwordStrengthValue < 75 ? "Boa" : "Forte"}
              </p>
            </div>
            <div>
              <Button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                disabled={pending}
              >
                {pending ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="text-sm">
          Já tem uma conta?{" "}
          <span onClick={() => setState('sign-in')} className="font-medium text-primary hover:text-primary/90 hover:cursor-pointer hover:underline">
            Faça login
          </span>
        </div>
      </div>
    </>
  )
}