import models from '../models/index.js';
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { validateCPF } from "../utils/validarCPF.js"
import { errorHandler } from "../utils/error.js"
import nodemailer from 'nodemailer';


dotenv.config();
const { User } = models;
const { PwdReset } = models;

//Cadastro
export const cadastro = async (req, res, next) => {
    const { username, email, password, confirmPassword, cpf, gender } = req.body
    //Verificar se todos os campos foram preenchidos
    if (!username || !email || !password || !confirmPassword || !cpf || !gender) {
        return next(errorHandler(400, 'Por favor, preencha todos os campos'));
    }
    //Limpar os CPF
    const cleanedCPF = cpf.replace(/\D/g, '');
    //Validações Iniciais
    if (!username || !email || !password || !confirmPassword || !cleanedCPF || !gender) {
        return next(errorHandler(400, 'Este CPF ja existe'))
    }
    if (!validateCPF(cleanedCPF)) {
        return res.status(400).json({
            sucess: false,
            message: 'CPF inválido',
        })
    }
    //Verifica se o email já está em uso
    let validUser = await User.findOne({ where: { email } });
    if (validUser) {
        return next(errorHandler(400, 'Este email ja existe'))
    }
    //Verifica se o CPF já está em uso
    let validUserCPF = await User.findOne({ where: { cpf: cleanedCPF } });
    if (validUserCPF) {
        return next(errorHandler(400, 'Este CPF ja existe'))
    }
    //Verificar se as senhas conferem
    if (password !== confirmPassword) {
        return next(errorHandler(400, 'As senhas não conferem'))
    }
    //Criptografar a senha
    const hashedPassword = bcryptjs.hashSync(password, 10)
    //Define a imagem de perfil com base no genero
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
    //Criar o usuário
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        cpf: cleanedCPF,
        gender,
        profilePicture: gender === 'Masculino' ? boyProfilePic : girlProfilePic
    })
    try {
        //Gerar Token JWT
        const token = jwt.sign({
            id: newUser._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })
        // Salvar o usuário no banco de dados
        await newUser.save()
        res.cookie('access_token', token, { httpOnly: true }).status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            token,
            profilePicture: newUser.profilePicture,
        })
    } catch (error) {
        console.log("Erro ao cadastrar", error)
        return next(errorHandler(500, 'Internal Server Error'))
    }
}

//Login
export const login = async (req, res, next) => {
    const { email, password } = req.body

    // Verificar se email e senha foram fornecidos
    if (!email || !password) {
        return next(errorHandler(400, 'Preencha todos os campos'))
    }

    try {
        // Buscar o usuário pelo email (aguardando a resposta do banco)
        const user = await User.findOne({ where: { email } })

        // Verificar se o usuário existe
        if (!user) {
            return next(errorHandler(400, 'Email ou senha inválido'))
        }

        // Verificar se a senha fornecida corresponde à senha criptografada
        const match = bcryptjs.compareSync(password, user.password)

        if (!match) {
            return next(errorHandler(400, 'Email ou senha inválido'))
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: user.id },  // Corrigido para usar `user.id`
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        // Definir cookie e enviar resposta
        res.cookie('access_token', token, { httpOnly: true }).status(200).json({
            _id: user.id,  // Corrigido para usar `user.id`
            username: user.username,
            email: user.email,
            token,
            profilePicture: user.profilePicture,
        })

    } catch (error) {
        console.log("Erro ao logar", error)
        return next(errorHandler(500, 'Internal Server Error'))
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('access_token').status(200).json({
            success: true,
            message: 'Logout realizado com sucesso'
        })
    } catch (error) {
        next(errorHandler(500, 'Internal Server Error'))
    }
}

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body; // Obter o email do corpo da requisição

    try {
        // Verificar se o usuário existe
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'E-mail inválido!' });
        }

        // Gerar um token numérico de 6 dígitos
        const token = Math.floor(100000 + Math.random() * 900000).toString();

        // Definir a expiração do token (30 minutos)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);

        // Armazenar o token no banco de dados
        await PwdReset.create({
            token,
            userId: user.id,
            expiresAt,
        });

        // Criar o transporte para envio de e-mail
        const transporter = nodemailer.createTransport({
            host: "mail.bolt360.com.br",
            port: 587,
            secure: false,
            auth: {
                user: "testesti@bolt360.com.br",
                pass: "Gmais2023@@",
            },
        });

        // Enviar o e-mail com o token
        await transporter.sendMail({
            from: '"SeuApp" <testesti@bolt360.com.br>',
            to: email,
            subject: 'Recuperação de Senha',
            text: `Seu código de recuperação de senha é: ${token}. Ele é válido por 30 minutos.`,
        });

        // Retornar uma mensagem de sucesso
        return res.status(200).json({ success: true, message: 'Código de recuperação enviado para o e-mail' });

    } catch (error) {
        // Em caso de erro, retorna success: false
        return res.status(500).json({ success: false, message: 'Erro ao enviar o código de recuperação. Tente novamente mais tarde.' });
    }
};


export const verPwdToken = async (req, res, next) => {
    const { token, email } = req.body; // Obter o token e o e-mail do corpo da requisição

    try {
        // Buscar o usuário pelo e-mail
        const user = await User.findOne({ where: { email } });
        // Verificar se o token existe no banco de dados para o userId encontrado
        const pwdResetRecord = await PwdReset.findOne({
            where: {
                token,
                userId: user.id // Relacionando o token ao usuário
            }
        });

        // Se o token não for encontrado ou não corresponder ao usuário, retorne um erro
        if (!pwdResetRecord) {
            return res.status(400).json({
                success: false,
                message: 'Token inválido ou não encontrado para este usuário.',
            });
        }

        // Verificar se o token ainda é válido
        const currentTime = new Date();
        if (pwdResetRecord.expiresAt < currentTime) {
            return res.status(400).json({
                success: false,
                message: 'Token expirado.',
            });
        }

        // Se tudo estiver correto, retornar uma resposta de sucesso
        return res.status(200).json({
            success: true,
            message: 'Token válido!',
        });
    } catch (error) {
        console.error("Erro ao verificar o token", error);
        return next(errorHandler(500, 'Internal Server Error'));
    }
};

export const changePassword = async (req, res, next) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Usuário não encontrado.',
            });
        }

        const hashedPassword = bcryptjs.hashSync(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Senha alterada com sucesso!',
        });
    } catch (error) {
        console.error("Erro ao atualizar a senha", error);
        return next(errorHandler(500, 'Erro interno do servidor'));
    }
};
