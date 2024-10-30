import models from '../models/index.js';
<<<<<<< Updated upstream
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
=======
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validateCPF } from "../utils/validarCPF.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from 'nodemailer';

dotenv.config();
const { User, Workspace, UserWorkspace, PwdReset } = models;

// Cadastro
export const cadastro = async (req, res, next) => {
    const { username, email, password, confirmPassword, cpf, gender } = req.body;

    // Verificar se todos os campos foram preenchidos
>>>>>>> Stashed changes
    if (!username || !email || !password || !confirmPassword || !cpf || !gender) {
        return next(errorHandler(401, 'Por favor, preencha todos os campos'));
    }
<<<<<<< Updated upstream
    //Limpar o CPF
    const cleanedCPF = cpf.replace(/\D/g, '');
    //Validações Iniciais
    if (!username || !email || !password || !confirmPassword || !cleanedCPF || !gender) {
        return next(errorHandler(401, 'Este CPF ja existe'))
    }
    if (!validateCPF(cleanedCPF)) {
        return res.status(401).json({
=======

    // Limpar o CPF
    const cleanedCPF = cpf.replace(/\D/g, '');

    // Validações Iniciais
    if (!validateCPF(cleanedCPF)) {
        return res.status(400).json({
>>>>>>> Stashed changes
            success: false,
            message: 'CPF inválido',
        });
    }
<<<<<<< Updated upstream
    //Verifica se o email já está em uso
    let validUser = await User.findOne({ where: { email } });
    if (validUser) {
        return next(errorHandler(401, 'Este email ja existe'))
    }
    //Verifica se o CPF já está em uso
    let validUserCPF = await User.findOne({ where: { cpf: cleanedCPF } });
    if (validUserCPF) {
        return next(errorHandler(401, 'Este CPF ja existe'))
    }
    //Verificar se as senhas conferem
    if (password !== confirmPassword) {
        return next(errorHandler(401, 'As senhas não conferem'))
=======

    // Verifica se o email já está em uso
    const validUser = await User.findOne({ where: { email } });
    if (validUser) {
        return next(errorHandler(400, 'Este email já existe'));
    }

    // Verifica se o CPF já está em uso
    const validUserCPF = await User.findOne({ where: { cpf: cleanedCPF } });
    if (validUserCPF) {
        return next(errorHandler(400, 'Este CPF já existe'));
    }

    // Verificar se as senhas conferem
    if (password !== confirmPassword) {
        return next(errorHandler(400, 'As senhas não conferem'));
>>>>>>> Stashed changes
    }

    // Criptografar a senha
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Criar o usuário
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        cpf: cleanedCPF,
        gender,
<<<<<<< Updated upstream
        profilePicture: gender === 'Masculino' ? boyProfilePic : girlProfilePic
    })
    try {
        //Gerar Token JWT
=======
        profilePicture: gender === 'Masculino' ? boyProfilePic : girlProfilePic,
    });

    try {
        // Gerar Token JWT
>>>>>>> Stashed changes
        const token = jwt.sign({
            id: newUser._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // Salvar o usuário no banco de dados
<<<<<<< Updated upstream
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
=======
        await newUser.save();
        res.status(201).json({
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            },
            token,
        });
    } catch (error) {
        return next(errorHandler(500, `Erro interno do servidor: ${error.message}`));
>>>>>>> Stashed changes
    }
};

// Login
export const login = async (req, res, next) => {
    const { email, password } = req.body

    // Verificar se email e senha foram fornecidos
    if (!email || !password) {
        return next(errorHandler(400, 'Preencha todos os campos'))
    }

    try {
        // Buscar o usuário pelo email (aguardando a resposta do banco)
        const user = await User.findOne({ where: { email } })

<<<<<<< Updated upstream
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

=======
        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: Workspace,
                    as: 'participatedWorkspaces',
                    through: { model: UserWorkspace, attributes: ['role'] },
                    required: false,
                },
                {
                    model: Workspace,
                    as: 'activeWorkspace',
                    required: false,
                },
            ],
            attributes: ['id', 'email', 'username', 'password', 'profilePicture'],
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username,
            activeWorkspaceId: user.activeWorkspace ? user.activeWorkspace.id : null,
            profilePicture: user.profilePicture,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                profilePicture: user.profilePicture,
                activeWorkspaceId: user.activeWorkspace ? user.activeWorkspace.id : null,
                workspaces: user.participatedWorkspaces ? user.participatedWorkspaces.map(w => ({
                    id: w.id,
                    name: w.name,
                    role: w.UserWorkspace ? w.UserWorkspace.role : null,
                })) : [],
            },
            token,
        });
>>>>>>> Stashed changes
    } catch (error) {
        console.log("Erro ao logar", error)
        return next(errorHandler(500, 'Internal Server Error'))
    }
}

// Logout
export const logout = (req, res) => {
    try {
        res.clearCookie('access_token').status(200).json({
            success: true,
<<<<<<< Updated upstream
            message: 'Logout realizado com sucesso'
        })
    } catch (error) {
        next(errorHandler(500, 'Internal Server Error'))
=======
            message: 'Logout realizado com sucesso',
        });
    } catch (error) {
        next(errorHandler(500, `Erro interno do servidor: ${error.message}`));
>>>>>>> Stashed changes
    }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'E-mail inválido!' });
        }

        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);

        await PwdReset.create({ token, userId: user.id, expiresAt });

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"SeuApp" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Recuperação de Senha',
            text: ` `,
            html: `<div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="color: #11ab8a;">Recuperação de Senha</h1>
            <p>Olá,</p>
            <p>Você solicitou a recuperação da sua senha. Use o código abaixo para redefinir sua senha:</p>
            <p style="font-size: 24px; font-weight: bold; color: #FF5722;">${token}</p>
            <p>Este código é válido por <strong>30 minutos</strong>.</p>
            <p style="margin-top: 20px;">Caso você não tenha solicitado a recuperação de senha, por favor, ignore este e-mail.</p>
            <p>Atenciosamente,</p>
            <p style="color: #11ab8a"><strong>Equipe de TI - Bolt 360 Assessoria</strong></p>
            <br>
             <p style ="font-size: 14px; italic; color: gray"> <i>--- Este é um email automático, por favor não responda ---</i></p>
        </div>`
        });

        return res.status(200).json({ success: true, message: 'Código de recuperação enviado para o e-mail' });

    } catch (error) {
        return res.status(500).json({ success: false, message: `Erro ao enviar o código de recuperação: ${error.message}` });
    }
};

// Verificar Token de Recuperação
export const verPwdToken = async (req, res, next) => {
    const { token, email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado.' });
        }

        const pwdResetRecord = await PwdReset.findOne({ where: { token, userId: user.id } });

        if (!pwdResetRecord) {
            return res.status(400).json({ success: false, message: 'Token inválido ou não encontrado para este usuário.' });
        }

        const currentTime = new Date();
        if (pwdResetRecord.expiresAt < currentTime) {
            return res.status(400).json({ success: false, message: 'Token expirado.' });
        }

        return res.status(200).json({ success: true, message: 'Token válido!' });

    } catch (error) {
        console.error("Erro ao verificar o token", error);
        return next(errorHandler(500, `Erro interno do servidor: ${error.message}`));
    }
};

// Alterar Senha
export const changePassword = async (req, res, next) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        // Verifica se o usuário existe
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Usuário não encontrado.',
            });
        }

        // Verifica o comprimento da nova senha
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'A nova senha deve ter pelo menos 8 caracteres.',
            });
        }

        // Criptografa a nova senha
        const hashedPassword = bcryptjs.hashSync(newPassword, 10);
        user.password = hashedPassword;

        // Salva o usuário com a nova senha
        await user.save();
<<<<<<< Updated upstream

        const idUser = user.id;
        // Deleta o token de reset de senha associado ao usuário
        await PwdReset.destroy({ where: { userId: idUser } }); // Certifique-se de que `idUser` está correto
=======
        await PwdReset.destroy({ where: { userId: user.id } });
>>>>>>> Stashed changes

        return res.status(200).json({
            success: true,
            message: 'Senha alterada com sucesso!',
        });

    } catch (error) {
        console.error("Erro ao atualizar a senha", error);
<<<<<<< Updated upstream

        return next(errorHandler ? errorHandler(500, 'Erro interno do servidor') : res.status(500).json({ success: false, message: 'Erro interno do servidor' }));
=======
        return next(errorHandler(500, `Erro interno do servidor: ${error.message}`));
>>>>>>> Stashed changes
    }
};

// Verifica se já existe um token de reset criado
export const verTokenExists = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

<<<<<<< Updated upstream
        // Verifica se o usuário existe
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado!' });
        }

        const idUser = user.id;

        const pwdResetRecord = await PwdReset.findOne({ where: { userId: idUser } });

        if (pwdResetRecord) {
            return res.status(401).json({ success: false, message: 'Já existe um token de reset para esse usuário!' });
        }

        return res.status(200).json({ success: true});

    } catch (error) {
        console.error("Erro ao verificar o token", error);

        return next(errorHandler ? errorHandler(500, 'Internal Server Error') : res.status(500).json({ success: false, message: 'Erro interno do servidor' }));
=======
        if (!user) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado.' });
        }

        const pwdResetRecord = await PwdReset.findOne({ where: { userId: user.id } });

        if (pwdResetRecord) {
            return res.status(409).json({ success: false, message: 'Já existe um token de reset para esse usuário!' });
        }

        return res.status(200).json({ success: true, message: 'Nenhum token de reset encontrado.' });

    } catch (error) {
        console.error("Erro ao verificar se o token existe", error);
        return next(errorHandler(500, `Erro interno do servidor: ${error.message}`));
>>>>>>> Stashed changes
    }
};
