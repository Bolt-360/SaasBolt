import models from '../models/index.js';
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { validateCPF } from "../utils/validarCPF.js"
import { errorHandler } from "../utils/error.js"
import bcrypt from 'bcryptjs';

dotenv.config();
const { User, Workspace, UserWorkspace } = models;
//Cadastro
export const cadastro = async(req, res, next) => {
    const { username, email, password, confirmPassword, cpf, gender } = req.body
    //Verificar se todos os campos foram preenchidos
    if (!username || !email || !password || !confirmPassword || !cpf || !gender) {
        return next(errorHandler(400, 'Por favor, preencha todos os campos'));
    }
    //Limpar os CPF
    const cleanedCPF = cpf.replace(/\D/g, '');
    //Validações Iniciais
    if(!username || !email || !password || !confirmPassword || !cleanedCPF || !gender){
        return next(errorHandler(400, 'Este CPF ja existe'))
    }
    if(!validateCPF(cleanedCPF)){
        return res.status(400).json({
            sucess: false,
            message: 'CPF inválido',
        })
    }
    //Verifica se o email já está em uso
    let validUser = await User.findOne({ where: { email } });
    if(validUser){
        return next(errorHandler(400, 'Este email ja existe'))
    }
    //Verifica se o CPF já está em uso
    let validUserCPF = await User.findOne({ where: { cpf: cleanedCPF } });
    if(validUserCPF){
        return next(errorHandler(400, 'Este CPF ja existe'))
    }
    //Verificar se as senhas conferem
    if(password !== confirmPassword){
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
    try{
        //Gerar Token JWT
        const token = jwt.sign({
            id: newUser._id,
            email: newUser.email,
            username: newUser.username,
        }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })
        // Salvar o usuário no banco de dados
        await newUser.save()
        res.status(201).json({
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            },
            token
        });
    }catch(error){
        return next(errorHandler(500, 'Erro interno do servidor'));
    }
}

//Login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: Workspace,
                    as: 'participatedWorkspaces',
                    through: { model: UserWorkspace, attributes: ['role'] },
                    required: false
                },
                {
                    model: Workspace,
                    as: 'activeWorkspace',
                    required: false
                }
            ],
            attributes: ['id', 'email', 'username', 'password', 'profilePicture'] // Adicionando profilePicture
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username,
            activeWorkspaceId: user.activeWorkspace ? user.activeWorkspace.id : null,
            profilePicture: user.profilePicture // Adicionando profilePicture ao token
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                profilePicture: user.profilePicture, // Adicionando profilePicture à resposta
                activeWorkspaceId: user.activeWorkspace ? user.activeWorkspace.id : null,
                workspaces: user.participatedWorkspaces ? user.participatedWorkspaces.map(w => ({
                    id: w.id,
                    name: w.name,
                    role: w.UserWorkspace ? w.UserWorkspace.role : null
                })) : []
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res) => {
    try{
        res.clearCookie('access_token').status(200).json({
            success: true,
            message: 'Logout realizado com sucesso'
        })
    }catch(error){
        next(errorHandler(500, 'Internal Server Error'))
    }
}
