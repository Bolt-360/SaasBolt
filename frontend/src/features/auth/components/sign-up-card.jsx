import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { SignInFlow } from "../types";
=======
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209
import { CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
<<<<<<< HEAD
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSignup } from "@/hooks/useSignup";
import { Eye, EyeOff } from "lucide-react"; // Importe os ícones

/**
 * @typedef {Object} SignInCardProps
 * @property {function(SignInFlow): void} setState
 */
=======
import { useNavigate } from "react-router-dom"; // Importando useNavigate
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209

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

<<<<<<< HEAD
const formatCPF = (value) => {
  const cpf = value.replace(/\D/g, '').slice(0, 11);
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

/**
 * @param {SignInCardProps} props
 * @returns {JSX.Element}
 */
export const SignUpCard = ({ setState }) => {
  const { signup, loading } = useSignup();
=======
export const SignUpCard = ({ setState }) => {
  const { toast } = useToast();
  const navigate = useNavigate(); // Criando uma instância de navigate
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
<<<<<<< HEAD
  const [passwordStrengthValue, setPasswordStrengthValue] = useState(0);
  const [cpf, setCpf] = useState("");
  const [gender, setGender] = useState("M");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
=======
  const [pending, setPending] = useState(false);
  const [passwordStrengthValue, setPasswordStrengthValue] = useState(0);
  const [cpf, setCpf] = useState("");
  const [gender, setGender] = useState(""); 
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209

  useEffect(() => {
    setPasswordStrengthValue(passwordStrength(password));
  }, [password]);

  const onPasswordSignUp = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
    await signup({
      username: name,
      email,
      password,
      confirmPassword,
      cpf: cpf.replace(/\D/g, ''),
      gender: gender === "M" ? "Masculino" : "Feminino"
    });
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
=======
    // Verifica se as senhas são iguais
    if (password !== confirmPassword) {
      toast({
        title: "Erro ao cadastrar",
        description: "As senhas não coincidem. Por favor, tente novamente.",
        variant: "destructive",
      });
      return; // Impede que o formulário continue se as senhas forem diferentes
    }

    // Verifica a força da senha
    if (passwordStrength < 75) {
      toast({
        title: "Senha fraca",
        description: "Por favor, use uma senha mais forte antes de cadastrar.",
        variant: "destructive",
      });
      return; // Impede que o formulário continue se a senha for fraca
    }

    setPending(true);

    try {
      const response = await fetch("http://localhost:2345/api/auth/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          password,
          confirmPassword,
          cpf,
          gender,
        }),
      });

      const data = await response.json(); // Extraímos a resposta da API

      if (!response.ok) {
        if (data.message && data.message.includes("CPF já registrado")) {
          toast({
            title: "Erro ao cadastrar",
            description: "Este CPF já está em uso. Tente outro.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro ao cadastrar",
            description: data.message || "Erro desconhecido.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Você pode fazer login agora.",
          variant: "default",
        });
        setRegistrationSuccess(true);

        // Limpa os campos após sucesso no cadastro
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setCpf("");
        setGender("");

        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Erro na requisição",
        description: "Não foi possível realizar o cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  // Função para formatar o CPF
  const formatCPF = (value) => {
    value = value.replace(/\D/g, ""); 
    value = value.replace(/(\d{3})(\d)/, "$1.$2"); 
    value = value.replace(/(\d{3})(\d)/, "$1.$2"); 
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); 
    return value;
  };

  const handleCPFChange = (e) => {
    const formattedCpf = formatCPF(e.target.value);
    setCpf(formattedCpf); // Atualiza o estado com o CPF formatado
  };

  return (
    <>
      <div className="bg-card rounded-2xl shadow-lg ring-1 ring-border">
        <CardTitle className="text-center text-1xl font-bold text-primary pt-4">
          Crie sua conta aqui
        </CardTitle>
        <div className="px-6 py-8 sm:px-10">
          <form className="space-y-6" onSubmit={onPasswordSignUp}>
            <div>
              <Label
                htmlFor="cpf"
                className="block text-sm font-medium text-muted-foreground"
              >
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209
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
<<<<<<< HEAD
                  maxLength={14} // Limita a quantidade de caracteres no CPF
=======
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209
                  placeholder="000.000.000-00"
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
<<<<<<< HEAD
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
                    <SelectValue placeholder="M" />
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
=======
            </div>
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-muted-foreground"
              >
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
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-muted-foreground"
              >
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209
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
<<<<<<< HEAD
                  maxLength={50} // Limita a quantidade de caracteres do email
=======
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209
                  placeholder="email@bolt360.com.br"
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div>
<<<<<<< HEAD
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
                  maxLength={20}
                  placeholder="********"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
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
=======
              <Label
                htmlFor="gender"
                className="block text-sm font-medium text-muted-foreground"
              >
                Gênero
              </Label>
              <div className="mt-1">
                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Selecione o gênero</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
            </div>
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-muted-foreground"
              >
                Senha
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="********"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="password-confirm"
                className="block text-sm font-medium text-muted-foreground"
              >
                Confirme a senha
              </Label>
              <div className="mt-1">
                <Input
                  id="password-confirm"
                  name="confirmPassword"
                  type="password"
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209
                  autoComplete="new-password"
                  required
                  placeholder="********"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
<<<<<<< HEAD
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
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
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
=======
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <div className="mt-1">
                <Progress value={passwordStrengthValue} />
              </div>
            </div>
            <div>
              <Button
                className="w-full rounded-md bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                type="submit"
                disabled={pending}
              >
                {pending ? "Cadastrando..." : "Cadastrar"}
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209
              </Button>
            </div>
          </form>
        </div>
      </div>
<<<<<<< HEAD
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
=======
    </>
  );
};
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209
