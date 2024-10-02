import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom"; // Importando useNavigate

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

export const SignUpCard = ({ setState }) => {
  const { toast } = useToast();
  const navigate = useNavigate(); // Criando uma instância de navigate

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [passwordStrengthValue, setPasswordStrengthValue] = useState(0);
  const [cpf, setCpf] = useState("");
  const [gender, setGender] = useState(""); 
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    setPasswordStrengthValue(passwordStrength(password));
  }, [password]);

  const onPasswordSignUp = async (e) => {
    e.preventDefault();

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
                  autoComplete="new-password"
                  required
                  placeholder="********"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
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
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
