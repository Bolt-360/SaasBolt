import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignInFlow } from "../types";
import { CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const formatCPF = (value) => {
  const cpf = value.replace(/\D/g, '').slice(0, 11);
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const validateCPF = (cpf) => {
  const strippedCPF = cpf.replace(/\D/g, '');
  return strippedCPF.length === 11;
};

/**
 * @param {SignInCardProps} props
 * @returns {JSX.Element}
 */
export const SignUpCard = ({ setState }) => {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [passwordStrengthValue, setPasswordStrengthValue] = useState(0);
  const [cpf, setCpf] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    setPasswordStrengthValue(passwordStrength(password));
  }, [password]);

  const onPasswordSignUp = async (e) => {
    e.preventDefault();

    if (!validateCPF(cpf)) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido.",
        variant: "destructive",
      });
      return;
    }

    if (name.trim().length === 0 || name.length > 50) {
      toast({
        title: "Nome inválido",
        description: "O nome não pode estar vazio e deve ter no máximo 50 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (email.length > 50) {
      toast({
        title: "Email inválido",
        description: "O email deve ter no máximo 50 caracteres.",
        variant: "destructive",
      });
      return;
    }

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

    if (!gender) {
      toast({
        title: "Gênero não selecionado",
        description: "Por favor, selecione um gênero.",
        variant: "destructive",
      });
      return;
    }

    setPending(true);
    console.log('Signup attempt:', JSON.stringify({
      username: name,
      email,
      password,
      confirmPassword,
      cpf: cpf.replace(/\D/g, ''),
      gender: gender === "M" ? "Masculino" : "Feminino"
    }, null, 2));
    setTimeout(() => {
      setPending(false);
      toast({
        title: "Cadastro simulado",
        description: "Dados de cadastro registrados no console.",
        variant: "default",
      });
    }, 1000);
  };

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleCPFChange = (e) => {
    setCpf(formatCPF(e.target.value));
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
                  maxLength={14} // Limita a quantidade de caracteres no CPF
                  placeholder="000.000.000-00"
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-grow">
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
                    maxLength={50} // Limita a quantidade de caracteres do nome
                    placeholder="Nome completo"
                    className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              <div className="w-1/6">
                <Label htmlFor="gender" className="block text-sm font-medium text-muted-foreground">
                  Gênero
                </Label>
                <Select onValueChange={setGender} value={gender}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  maxLength={50} // Limita a quantidade de caracteres do email
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
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  maxLength={20} // Limita a quantidade de caracteres da senha
                  placeholder="********"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password-confirm" className="block text-sm font-medium text-muted-foreground">
                  Confirme a senha
                </Label>
              </div>
              <div className="mt-1">
                <Input
                  id="password-confirm"
                  name="password-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="********"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
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
  );
};
